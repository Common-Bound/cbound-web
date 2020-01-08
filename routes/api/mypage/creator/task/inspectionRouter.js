const express = require("express");
const router = express.Router();
const db = require("../../../../../db/index");
const moment = require("moment-timezone");
const logger = require("../../../../../config/logger");
const axios = require("axios");
const endpoint = require("../../../../AIserverEndpoint");
const uuid = require("uuid/v4");
const fs = require("fs");
const util = require("util");
const AWS = require("aws-sdk");
const path = require("path");
const sharp = require("sharp");

// AWS.config.loadFromPath(__dirname + "/../../../../../config/awsConfig.json");
AWS.config.update({
  secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
  accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
  region: "us-east-1"
});
let s3 = new AWS.S3();

// 검수 작업이 일정시간동안 제출되지 않으면
const timeout = async data_id => {
  const sql = `update data set schedule_state='queued' where id = $1`;
  const result = await db
    .query(sql, [data_id])
    .then(res => console.log("검수 작업 타임아웃"))
    .catch(err => {
      logger.error(err);
    });
};

// 타이머를 저장하는 오브젝트
const timerObject = {};

// path: ~/api/mypage/creator/task/inspection
// 검수 큐에 있는 data를 시간이 빠른 순서대로 불러온다
// 자신이 한번도 참여하지 않았고 상태가 'queued'인 data를 불러온다
// 그리고 해당 data의 상태를 'reserved' 로 변경한다
// 그리하여 다른 검수 작업자가 해당 data에 접근하지 못 하게 한다
router.get("/", (req, res, next) => {
  const project_id = req.query.project_id;
  console.log(project_id);
  const production_sql = `begin;
  lock table data in exclusive mode;
  update data 
  set schedule_state='reserved' 
  where id in (
    select 
      id from data 
    where 
      status='created'
      and
      schedule_state='queued' 
      and 
      '${req.user.id}' != ALL(inspector)
      and
      project_id='${project_id}'
    order by 
      created_at asc 
    limit 1 
  )
  returning *;
  commit;`;

  // const debug_sql = `
  //   select * from data order by created_at asc limit 1
  // `;
  db.query(production_sql, [], (err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }

    if (result[2].rows.length === 0) {
      return res.json({
        message: "참여 가능한 검수 작업이 존재하지 않습니다"
      });
    }

    // 하나의 유저별로 타이머를 할당한다
    // 하나의 작업 당 제한시간은 5분이다
    const data_id = result[2].rows[0].id;
    const timer = setTimeout(() => {
      timeout(data_id);
    }, 300000);
    timerObject[req.user.id] = timer;
    return res.json({ result: result[2].rows[0] });
  });
});
// 작업 완료 요청 핸들링
// reserved 상태 였던 data를 다시 queue로 되돌린다
/**
 * @dev new_crop_image 필드를 받아서 data의 payload 부분을 업데이트 해준다
 */
router.post("/", async (req, res, next) => {
  // 타이머를 초기화해준다
  clearTimeout(timerObject[req.user.id]);

  const data = req.body;

  const new_crop_image = data.new_crop_image;
  const data_id = data.data_id;
  console.log("data_id: ", data_id);
  console.log("req.user.id: ", req.user.id);
  // data 테이블에 주어진 id의 data를 업데이트 시킨다
  const updated_data = await db
    .query(
      "update data set schedule_state='queued', inspector = array_append(inspector, $1), payload = jsonb_set(payload, '{meta, crop_image}', $2, true) where id = $3 returning *;",
      [req.user.id, JSON.stringify(new_crop_image), data_id]
    )
    .then(res => res.rows[0])
    .catch(err => {
      logger.error(err);
      logger.error("data를 업데이트 하는 로직에서 에러 발생");
      return res.status(500).send(err);
    });
  // inspector_pool 에 검수자의 id와 data의 id를 추가한다
  const inspector_update_query = `insert into inspector_pool values($1, $2, $3)`;
  await db
    .query(inspector_update_query, [
      req.user.id,
      data_id,
      moment()
        .tz("Asia/Seoul")
        .format()
    ])
    .then(res => res.rows)
    .catch(err => {
      logger.error(err);
      logger.error("inspector_pool 업데이트 하는 로직에서 에러 발생");
      return res.status(500).send(err);
    });

  // console.log("updated_data: ", updated_data);
  const inspectors = updated_data.inspector;
  console.log("inspectors: ", inspectors);
  // 검수를 더 진행해야 된다면 그냥 true를 반환한다
  if (inspectors.length < updated_data.inspector_count)
    return res.json({ result: true });

  // 검수자 수가 inspector_count 와 같다면
  // 검수가 종료된 것으로 검수 결과를 확인해야 한다
  // correct 필드를 검사하여 data의 status를 변경해준다
  const crop_image = updated_data.payload.meta.crop_image;
  let inspection_result = []; // 검수 결과 저장
  let status; // 데이터의 최종 상태
  // 검수자들의 reliability를 가져온다
  const inspector_reliability_promises = await inspectors.map(
    async inspector => {
      const inspector_id = inspector;
      const sql = "select reliability from data_creator where id = $1";
      const inspector_reliability = await db
        .query(sql, [inspector_id])
        .then(res => res.rows[0].reliability)
        .catch(err => {
          logger.error(err);
          return res.status(500).send(err);
        });
      console.log(
        `reliability of inspector ${inspector_id}: `,
        inspector_reliability
      );
      return new Promise(resolve => resolve(inspector_reliability));
    }
  );
  const inspector_reliabilities = await Promise.all(
    inspector_reliability_promises
  );
  console.log("inspector_reliabilities: ", inspector_reliabilities);

  // 이미지의 각 crop 영역에 대해
  let crop_promises = await crop_image.map(async (crop, index) => {
    let correct_prob = 1; // correct 확률
    let incorrect_prob = 1; // incorrect 확률
    // 검수자들의 각 검수 결과를 순회한다
    let correct_promises = await crop.correct.map(async (is_correct, index) => {
      const inspector_reliability = inspector_reliabilities[index];

      if (Number(is_correct) === 1) {
        // 숫자가 커지는 것을 막기 위해 100 으로 나눠서 확률을 계산한다
        correct_prob *= Number(inspector_reliability) / 100;
        incorrect_prob *= 1 - Number(inspector_reliability) / 100;
      } else {
        correct_prob *= 1 - Number(inspector_reliability) / 100;
        incorrect_prob *= Number(inspector_reliability) / 100;
      }

      return new Promise(resolve => resolve(true));
    });
    correct_promises = await Promise.all(correct_promises);

    // 계산된 correct 확률을 비교한다
    // 만약 correct 확률의 비율이 0.5 이상이라면 이는 통과
    // 그렇지 않으면 반려시킨다
    // console.log("# index : ", index);
    // console.log("crop label: ", crop_image[index].region_attributes.label);
    // console.log("correct_prob: ", correct_prob);
    // console.log("incorrect_prob: ", incorrect_prob);
    correct_prob / (correct_prob + incorrect_prob) > 0.5
      ? inspection_result.push("done")
      : inspection_result.push("failure");
    return new Promise(resolve => resolve(true));
  });

  crop_promises = await Promise.all(crop_promises);
  // inspection_result 에는 각 crop의 검수 결과를 저장하고 있다
  // 만약 하나라도 failure이 존재한다면 data를 반려시킨다
  console.log("inspection_result: ", inspection_result);
  inspection_result.includes("failure")
    ? (status = "failure")
    : (status = "done");
  // DB에 저장된 data의 상태를 update 시킨다
  const sql = `update data set status = $1 where id = $2`;
  db.query(sql, [status, data_id], (err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }
    return res.json({ result: true });
  });
});

// 검수 내역 초기화 하는 요청 핸들링
// router.get("/reset", async (req, res, next) => {
//   // 데이터를 가져온다
//   const data_id_sql = `select id from data order by created_at asc limit 0`;
//   const datas = await db
//     .query(data_id_sql, [])
//     .then(res => res.rows)
//     .catch(err => {
//       console.log(err);
//     });
//   console.log(datas);
//   // 가져온 데이터 리스트를 순회하면서 요청을 보낸다
//   datas.forEach(async data => {
//     const data_id = data.id;
//     console.log("data.id: ", data_id);
//     const payload_sql = `select payload from data where id = $1`;
//     const result = await db
//       .query(payload_sql, [data_id])
//       .then(res => res.rows[0])
//       .catch(err => {
//         console.log(err);
//       });
//     const crop_image = result.payload.meta.crop_image;
//     console.log("crop_image[0]: ", crop_image[0]);

//     // crop_image의 길이 만큼 반복문을 돌면서 각 crop_image의 correct 필드를 초기화해준다
//     const new_crop_image_promises = await crop_image.map(async crop => {
//       crop.correct = [];

//       return new Promise(resolve => resolve(crop));
//     });
//     const new_crop_image = await Promise.all(new_crop_image_promises);
//     console.log("new_crop_image[0]: ", new_crop_image[0]);

//     // 수정된 new_crop_image 를 db에 반영한다
//     const updated_data = await db
//       .query(
//         `
//       update data set
//       status = 'created', inspector = '{}', schedule_state = 'queued',
//       payload = jsonb_set(payload, '{meta, crop_image}', jsonb '${JSON.stringify(
//         new_crop_image
//       )}', true)
//       where id='${data_id}' returning *;
//       `,
//         []
//       )
//       .then(res => res.rows[0])
//       .catch(err => {
//         logger.error(err);
//         return res.status(500).send(err);
//       });
//   });

//   return res.json({ result: true });

//   // 먼저 해당 데이터의 crop_image의 수를 가져온다
//   // let i = 0;
//   // const sql = `update data set payload = jsonb_set(payload, '{meta, crop_image, ${i}}')`
// });

// 업데이트 합수
const updateCompareSize = async datas => {
  // 각 데이터의 orig_image와 필드, 즉 URL을 가져온다
  const orig_image_URLs = datas.map(data => {
    return data.payload.orig_image;
  });
  // url에서 key를 추출한다
  const bucketName = "cloud-cube";
  const orig_image_keys = orig_image_URLs.map(url => {
    const splitted_url = url.split("/");
    let key = `${decodeURIComponent(splitted_url[3])}/${decodeURIComponent(
      splitted_url[4]
    )}/${decodeURIComponent(splitted_url[5])}`;
    key = key.split("+").join(" ");

    return key;
  });
  // 각 key별로 object를 가져온다
  const orig_image_base64_promises = await orig_image_keys.map(async key => {
    console.log("key: ", key);
    const params = {
      Bucket: bucketName,
      Key: key
    };
    const orig_image_base64 = await s3
      .getObject(params)
      .promise()
      .then(data => Buffer.from(data.Body).toString("base64"))
      .catch(err => {
        console.log(err);
      });
    return new Promise(resolve => resolve(orig_image_base64));
  });
  const orig_image_base64 = await Promise.all(orig_image_base64_promises);

  // base64로 인코딩된 이미지들을 detection하는 엔드포인트로 전송한다
  console.log("axios 요청 전송 시작");
  const new_crop_images = await axios(`${endpoint.url}/ocr/detection/`, {
    method: "POST",
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    data: {
      id: uuid(),
      orig_image: orig_image_base64
    }
  });

  console.log(new_crop_images.data);
  // 각 image의 ai_total_size 필드를 가져온다
  const ai_total_sizes = new_crop_images.data.meta.map(data => {
    return data.ai_total_size;
  });
  console.log("ai_total_sizes: ", ai_total_sizes);

  // data의 total_size와 ai_total_size를 비교한 값을 구한다
  const compare_size_promises = await datas.map((data, index) => {
    const total_size = data.payload.meta.total_size;
    const ai_total_size = ai_total_sizes[index];
    const compare_size = total_size / ai_total_size;

    return new Promise(resolve => resolve(compare_size));
  });
  const compare_sizes = await Promise.all(compare_size_promises);
  console.log("compare_sizes: ", compare_sizes);

  // 이제 각 데이터의 ai_total_size와 compare_size 필드를 업데이트 시켜준다
  const update_query_result_promises = await datas.map(async (data, index) => {
    const update_sql = `update data set payload = jsonb_set(payload, '{meta}', payload->'meta' || '{"ai_total_size": ${ai_total_sizes[index]}, "compare_size": ${compare_sizes[index]} }') where id = $1 returning *;`;
    const result = await db
      .query(update_sql, [data.id])
      .then(res => res.rows)
      .catch(err => {
        console.log(err);
      });

    return new Promise(resolve => resolve(result));
  });

  const update_query_results = await Promise.all(update_query_result_promises);
  logger.info(update_query_results);

  if (data_index >= 84) {
    clearInterval(update_2_per_10_sec);
    logger.info("compare_size 업데이트 완료");
  }
};

// 하나의 데이터를 받아서 recognition_prob 를 업데이트하는 함수
const updateRecognitionProb = async data => {
  // 각 데이터의 orig_image와 필드, 즉 URL을 가져온다
  const orig_image_URL = data.payload.orig_image;
  // url에서 key를 추출한다
  const bucketName = "cloud-cube";

  const splitted_url = orig_image_URL.split("/");
  let key = `${decodeURIComponent(splitted_url[3])}/${decodeURIComponent(
    splitted_url[4]
  )}/${decodeURIComponent(splitted_url[5])}`;
  const orig_image_key = key.split("+").join(" ");

  // key로 object를 가져온다
  console.log("key: ", orig_image_key);
  const params = {
    Bucket: bucketName,
    Key: orig_image_key
  };
  const orig_image_buffer = await s3
    .getObject(params)
    .promise()
    .then(data => Buffer.from(data.Body))
    .catch(err => {
      console.log(err);
    });
  console.log("orig_image_buffer length: ", orig_image_buffer.length);

  // 하나의 이미지 buffer에 대해서 각 crop 영역을 base64로 변환한다
  const crop_image_base64_promises = await data.payload.meta.crop_image.map(
    async crop => {
      const shape_attr = crop.shape_attributes;
      const x = Number(shape_attr.x);
      const y = Number(shape_attr.y);
      const width = Number(shape_attr.width);
      const height = Number(shape_attr.height);
      const option = {
        left: Math.round(x),
        top: Math.round(y),
        width: Math.round(width),
        height: Math.round(height)
      };
      const base64 = await sharp(orig_image_buffer)
        .extract(option)
        .toBuffer()
        .then(async data => {
          const crop_image_base64 = await Buffer.from(data).toString("base64");
          console.log(
            "crop_image_base64[0:10]: ",
            crop_image_base64.substring(0, 10)
          );
          return new Promise(resolve => resolve(crop_image_base64));
        })
        .catch(err => {
          logger.error(err);
        });

      return new Promise(resolve => resolve(base64));
    }
  );
  // 각 crop 영역의 base64 인코딩값을 저장한다
  const crop_image_base64s = await Promise.all(crop_image_base64_promises);

  // AI 서버로 요청을 전송한다
  console.log("axios 요청 전송 시작");
  const recog_result = await axios(`${endpoint.url}/ocr/recognition/`, {
    method: "POST",
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    data: {
      id: uuid(),
      crop_image: crop_image_base64s
    }
  })
    .then(res => res.data)
    .catch(err => {
      console.log(err);
    });
  console.log("recog_result: ", recog_result);

  // 확률 정보만 가져온다
  const new_prob = recog_result.prob;
  // 주어진 data의 region_attibutes 필드의 prob 값을 업데이트 시킨다
  const update_query_result_promises = await new_prob.map(
    async (prob, index) => {
      const update_sql = `update data set payload = jsonb_set(payload, '{meta, crop_image, ${index}, region_attributes}', payload->'meta'->'crop_image'->${index}->'region_attributes' || '{ "prob": ${prob} }') where id = $1 returning *;`;
      const result = await db
        .query(update_sql, [data.id])
        .then(res => res.rows)
        .catch(err => {
          logger.error(err);
          return false;
        });
      return new Promise(resolve => resolve(result));
    }
  );

  const update_query_results = await Promise.all(update_query_result_promises);
  console.log(
    `data ${data.id} result: ${update_query_results ? "true" : "false"}`
  );

  if (data_index >= 676) {
    clearInterval(update_1_per_10_sec);
    logger.info("recognition_prob 업데이트 완료");
  }
};

const InsertDataCreatedByAI = async data => {
  // 각 데이터의 orig_image와 필드, 즉 URL을 가져온다
  const orig_image_URLs = data.payload.orig_image;
  // url에서 key를 추출한다
  const bucketName = "cloud-cube";
  const splitted_url = orig_image_URLs.split("/");
  let key = `${decodeURIComponent(splitted_url[3])}/${decodeURIComponent(
    splitted_url[4]
  )}/${decodeURIComponent(splitted_url[5])}`;
  const orig_image_keys = key.split("+").join(" ");

  // 각 key별로 object를 가져온다
  console.log("key: ", orig_image_keys);
  const params = {
    Bucket: bucketName,
    Key: orig_image_keys
  };
  // 원본 이미지를 Buffer로 저장하는 변수
  let orig_image_buffer;
  const orig_image_base64 = await s3
    .getObject(params)
    .promise()
    .then(data => {
      orig_image_buffer = Buffer.from(data.Body);
      return Buffer.from(data.Body).toString("base64");
    })
    .catch(err => {
      console.log(err);
    });

  // base64로 인코딩된 이미지들을 detection하는 엔드포인트로 전송한다
  console.log("axios detection 요청 전송 시작");
  let new_payload = await axios(`${endpoint.url}/ocr/detection/`, {
    method: "POST",
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    data: {
      id: uuid(),
      orig_image: orig_image_base64
    }
  })
    .then(res => res.data)
    .catch(err => {
      logger.error(err);
    });
  console.log(new_payload);

  // payload 에서 crop_image 내 각 crop 의 shape_attributes의 영역을 recognition 시킨다
  new_payload.meta = new_payload.meta[0]; // meta 가 배열이므로 이를 object 로 변환함
  new_payload.orig_image = orig_image_URLs;
  // let new_meta = {};
  // new_meta = Object.assign(new_meta, new_payload.meta[0]);
  // new_payload = Object.assign(new_payload, { meta: new_meta });
  // crop내 정보들을 다 shape_attributes 로 wrapping 해준다
  const new_crop_promises = await new_payload.meta.crop_image.map(
    async (crop, id) => {
      let shape_attributes = {};
      let new_crop = {};
      shape_attributes = Object.assign(shape_attributes, crop);
      shape_attributes.id = id;
      new_crop.shape_attributes = shape_attributes;
      new_crop.correct = [];

      return new Promise(resolve => resolve(new_crop));
    }
  );
  const new_crops = await Promise.all(new_crop_promises);
  // shape_attributes로 wrapping 된 crop_image를 새롭게 저장한다
  new_payload.meta.crop_image = new_crops;

  const crop_image_base64_promises = await new_payload.meta.crop_image.map(
    async crop => {
      const shape_attr = crop.shape_attributes;
      const x = Number(shape_attr.x);
      const y = Number(shape_attr.y);
      const width = Number(shape_attr.width);
      const height = Number(shape_attr.height);
      const option = {
        left: Math.round(x),
        top: Math.round(y),
        width: Math.round(width),
        height: Math.round(height)
      };
      const base64 = await sharp(orig_image_buffer)
        .extract(option)
        .toBuffer()
        .then(async data => {
          const crop_image_base64 = await Buffer.from(data).toString("base64");

          return new Promise(resolve => resolve(crop_image_base64));
        })
        .catch(err => {
          logger.error(err);
        });

      return new Promise(resolve => resolve(base64));
    }
  );

  const crop_image_base64s = await Promise.all(crop_image_base64_promises);

  // AI 서버로 요청을 전송한다
  console.log("axios recognition 요청 전송 시작");
  const recog_result = await axios(`${endpoint.url}/ocr/recognition/`, {
    method: "POST",
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    data: {
      id: uuid(),
      crop_image: crop_image_base64s
    }
  })
    .then(res => res.data)
    .catch(err => {
      console.log(err);
    });
  console.log("recog_result.label[0]: ", recog_result.label[0]);
  console.log("recog_result.prob[0]: ", recog_result.prob[0]);

  // 각 crop_image 의 region_attributes 필드에 label, prob 값을 추가한다
  const new_crop_image_promises = await new_payload.meta.crop_image.map(
    (crop, index) => {
      crop.region_attributes = {};
      crop.region_attributes["label"] = recog_result.label[index];
      crop.region_attributes["prob"] = recog_result.prob[index];

      return new Promise(resolve => resolve(crop));
    }
  );
  const new_crop_image = await Promise.all(new_crop_image_promises);
  // region_attributes 필드를 추가한다
  new_payload.meta.crop_image = new_crop_image;

  // 새롭게 AI 가 생성한 데이터를 저장한다
  const data_id = uuid();
  const date = moment()
    .tz("Asia/Seoul")
    .format();
  const reliability = 0;
  const inspector_count = 1;
  const schedule_state = "queued";
  const project_id = "8eabb4e4-4129-4015-a2c3-b19040700326";
  const user_id = "c3348be3-7035-4943-b15a-b381f991a63a";
  const insert_query = `insert into data values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *;`;
  const update_query_results = await db
    .query(insert_query, [
      data_id,
      "image",
      new_payload,
      date,
      "created",
      user_id,
      [],
      project_id,
      schedule_state,
      reliability,
      inspector_count
    ])
    .then(res => res.rows)
    .catch(err => {
      logger.error(err);
      return false;
    });

  console.log(
    `data ${data.id} insert result: ${update_query_results ? "true" : "false"}`
  );

  if (data_index >= 873) {
    clearInterval(update_1_per_20_sec);
    logger.info("recognition_prob 업데이트 완료");
  }
};

// 업데이트 시킬 데이터의 인덱스
let data_index = 0;
// 10초마다 업뎃 함수를 호출하는 Interval 객체(detection)
let update_2_per_10_sec;
// 10초마다 업뎃 함수를 호출하는 Interval 객체(recognition)
let update_1_per_10_sec;
// 20초마다 업뎃 함수를 호출하는 Interval 객체(recognition)
let update_1_per_20_sec;
// data를 저장하는 배열
let datas;

// DB에 저장된 데이터의 compare_size를 계산하는 요청을 핸들링하는 라우터
// router.get("/update_compare_size", async (req, res, next) => {
//   // 먼저 데이터를 가져온다.
//   const get_data_sql = `select * from data order by created_at desc limit 84;`;
//   const data_promises = await db
//     .query(get_data_sql, [])
//     .then(res => res.rows)
//     .catch(err => {
//       console.log(err);
//     });
//   // compare_size가 NaN인 데이터들만 뽑아온다
//   // const data_promises = await datas.map(async data_id => {
//   //   const data_query_sql = `select * from data where id = $1`;
//   //   const result = await db
//   //     .query(data_query_sql, [data_id])
//   //     .then(res => res.rows[0])
//   //     .catch(err => {
//   //       console.log(err);
//   //     });

//   //   return new Promise(resolve => resolve(result));
//   // });

//   datas = await Promise.all(data_promises);

//   // 가져온 데이터에서 10초마다 2개씩 update하는 요청을 보낸다
//   update_2_per_10_sec = setInterval(() => {
//     console.log("data_index: ", data_index);
//     updateCompareSize([datas[data_index]]);
//     data_index += 1;
//   }, 20000);

//   return res.json({
//     result: "업데이트가 시작되었습니다."
//   });
//   // return res.send(datas);
// });

// DB에 저장된 데이터의 prob 를 업데이트 하는 요청을 핸들링하는 라우터
// router.get("/update_recognition_prob", async (req, res, next) => {
//   // 먼저 데이터들을 가져온다
//   const sql = `select * from data order by created_at asc limit 676`;
//   const data_promises = await db
//     .query(sql, [])
//     .then(res => res.rows)
//     .catch(err => {
//       logger.info(err);
//     });

//   datas = await Promise.all(data_promises);

//   // 가져온 데이터에서 10초 마다 1개씩 업데이트 하는 요청을 보낸다
//   update_1_per_10_sec = setInterval(() => {
//     console.log("data index: ", data_index);
//     updateRecognitionProb(datas[data_index]);
//     data_index += 1;
//   }, 10 * 1000);

//   return res.json({ result: "업데이트가 시작됩니다." });
// });

// DB에 저장된 데이터를 새롭게 detection 한 뒤 recognition 하고 이를 새로운 프로젝트에 저장하는 요청을 핸들링하는 라우트
router.get("/create_data_with_ai", async (req, res, next) => {
  // 먼저 저장된 데이터들을 가져온다
  const sql = `select * from data where project_id = '4ff5f94d-694d-420e-b7d6-0ccad18eb1f1' order by created_at asc;`;
  const data_promises = await db
    .query(sql, [])
    .then(res => res.rows)
    .catch(err => {
      logger.info(err);
    });

  datas = await Promise.all(data_promises);

  // 가져온 데이터에서 10초 마다 1개씩 업데이트 하는 요청을 보낸다
  update_1_per_10_sec = setInterval(() => {
    console.log("data index: ", data_index);
    InsertDataCreatedByAI(datas[data_index]);
    data_index += 1;
  }, 10 * 1000);

  return res.json({ result: "업데이트가 시작됩니다." });
});

module.exports = router;
