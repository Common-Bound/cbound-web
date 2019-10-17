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

AWS.config.loadFromPath(__dirname + "/../../../../../config/awsConfig.json");
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
  console.log("data: ", data);

  const new_crop_image = data.new_crop_image;
  console.log("new_crop_image: ", new_crop_image);
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
    console.log("# index : ", index);
    console.log("crop label: ", crop_image[index].region_attributes.label);
    console.log("correct_prob: ", correct_prob);
    console.log("incorrect_prob: ", incorrect_prob);
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
  const bucketName = "task-data-bucket";
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

  if (data_index >= 36) {
    clearInterval(update_2_per_10_sec);
    logger.info("compare_size 업데이트 완료");
  }
};

// 업데이트 시킬 데이터의 인덱스
let data_index = 0;
// 10초마다 업뎃 함수를 호출하는 Interval 객체
let update_2_per_10_sec;
// data를 저장하는 배열
let datas;

// DB에 저장된 데이터의 compare_size를 계산하는 요청을 핸들링하는 라우터
router.get("/update_compare_size", async (req, res, next) => {
  // 먼저 데이터를 가져온다.
  // const get_data_sql = `select * from data order by created_at asc;`;
  // datas = await db
  //   .query(get_data_sql, [])
  //   .then(res => res.rows)
  //   .catch(err => {
  //     console.log(err);
  //   });
  // compare_size가 NaN인 데이터들만 뽑아온다
  data_ids = [
    // "2cf4b17c-e600-4515-8352-e43361d58fb7",
    // "1d0839ad-7fe5-46d8-b74b-c5228bab4af0",
    // "b847f150-5b6b-4eb9-9021-4e59a68569a8",
    // "199854c1-02f9-4199-8ac8-9d914af852cb",
    // "434d8939-c708-4cbb-922b-17c6f857a400",
    // "8faddb01-ee46-4754-b6d1-4fe4c665f230",
    // "de752c8e-08d0-4fe7-a6bb-bd95cd9c2b26",
    // "d5686cb3-226f-4842-a1de-61751f434217",
    // "f3aa61c7-6952-4152-87f4-c0227bff741b",
    // "73d1cbb8-304f-47db-821f-3b661df4f06e",
    // "42664c83-1c41-4c4c-bc21-99bf124d83ed",
    // "8c595240-df86-4497-a25e-360ca013320c",
    // "a0d44da8-4d8a-4775-b42f-2e96f47e140d",
    // "bd94afaa-f426-4bd4-a2d8-55c4f848d10f",
    // // "0f725183-13a3-4533-873f-a63bac2f5b5b",
    // // "01917b2e-92ed-4a31-a611-e0e633dcfc07",
    // // "cefe5f1e-59a2-4512-9d16-bf45a20b66aa",
    // // "12090bc4-1000-471a-89f3-f22168e91813",
    // // "23c5d42f-bf1b-4bc4-a16f-96b7a43aafc6",
    // // "a9aa33a3-d379-41c3-bd33-f98aeed3756b",
    // // "99a6d297-2434-4da5-80f9-573aef319cf6",
    // // "c534f9a6-47e1-4f09-aaa4-e6493b5f6bcc",
    // // "0c6ec2de-b27b-4c7f-a705-6b2070d90a40",
    // // "ccf9ad3b-cd88-474c-814e-6fd41526d396",
    // "7687463c-87d2-4af2-bbe6-65638e3403f2",
    // "f276c964-9b9a-4cfe-97a5-78bd10f2290b",
    // "4fcb5f6d-2709-4f07-8951-d14452776b91",
    // "c15fcba4-9e15-4930-b11d-c08b9568db53",
    // // "cd14a5e8-0e80-4821-844c-55dd92644bf8",
    // // "30337f40-877f-4b8b-84bb-aa4c7b96e4ed",
    // // "2f7acb92-1c1c-49a5-852e-794e9269d7c2",
    // // "c70838f0-583c-4fe9-a882-3549a2384dc0",
    // // "22860693-6832-465b-ab2c-722377ee32ad",
    // "e3d5c010-17c1-4dbb-ad20-97465bb1f508",
    // "d56aae03-7f72-4db6-b03a-aaf8cdac5fc6",
    "550de449-cbb2-462a-b069-c730e7499401"
  ];
  const data_promises = await data_ids.map(async data_id => {
    const data_query_sql = `select * from data where id = $1`;
    const result = await db
      .query(data_query_sql, [data_id])
      .then(res => res.rows[0])
      .catch(err => {
        console.log(err);
      });

    return new Promise(resolve => resolve(result));
  });

  datas = await Promise.all(data_promises);

  // 가져온 데이터에서 10초마다 2개씩 update하는 요청을 보낸다
  update_2_per_10_sec = setInterval(() => {
    console.log("data_index: ", data_index);
    updateCompareSize([
      datas[data_index]
      //  datas[data_index + 1]
    ]);
    data_index += 2;
  }, 20000);

  return res.json({
    result: "업데이트가 시작되었습니다."
  });
  // return res.send(datas);
});

module.exports = router;
