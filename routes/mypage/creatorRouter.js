const express = require("express");
const router = express.Router();
const joinRouter = require("./creator/join");
const projectsRouter = require("./creator/projects");
const taskRouter = require("./creator/taskRouter");
const historyRouter = require("./creator/history");

const db = require("../../db/index");
const uuid = require("uuid/v4");
const moment = require("moment");

// path: ~/mypage/creator
router.use("/join", joinRouter);
router.use("/projects", projectsRouter);
router.use("/insight", projectsRouter);
router.use("/task", taskRouter);
router.use("/history", historyRouter);

// 내가 참여 가능한 프로젝트 목록들을 보여준다
router.get("/", (req, res, next) => {
  const sql = "select * from project";
  db.query(sql, [], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    if (result.rows.length > 0) {
      const available_projects = result.rows.filter(row => {
        const now = moment();
        const due_date = moment(row.due_date);
        const millisec_diff = moment

          .duration(due_date.diff(now))
          .asMilliseconds();
        if (millisec_diff > 0) return row;
      });

      if (available_projects.length > 0) {
        return res.json({ result: available_projects });
      } else {
        return res.json({ message: "프로젝트가 존재하지 않습니다" });
      }
    }
  });
});

// 프로젝트 생성 요청 핸들링
router.post("/", (req, res, next) => {
  const normal_id = uuid();
  const inspection_id = uuid();
  const titles = [
    "식당 간판 인식(영어)",
    "영수증 인식(영어)",
    "명함 인식(영어)",
    "건강검진 진단서 인식(영어)",
    "레스토랑 메뉴 인식(영어)"
  ];

  const time = moment();
  console.log(time.toISOString());

  const title_index = Math.floor(Math.random() * 4);
  const reward = Math.floor(Math.random() * 500);
  const created_at = time.toISOString();
  const due_date = time.add("30", "d").toISOString(); // 마감 기한 30일
  console.log("created_at : " + created_at);
  console.log("due_date : " + due_date);

  // project 테이블에 project 를 추가한다
  // project 속성
  // id, ref_project, title, image, simple_desc, detail_desc,
  // due_date, created_at, type, project_type,
  // guideline_url, reward
  db.query(
    "insert into project values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
    [
      normal_id,
      null,
      titles[title_index],
      null,
      "간단한 설명",
      "자세한 설명 입니다",
      due_date,
      created_at,
      "image",
      "normal",
      null,
      reward
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      // 검수 프로젝트 추가
      db.query(
        "insert into project values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
        [
          inspection_id,
          normal_id,
          titles[title_index],
          null,
          "간단한 설명",
          "자세한 설명 입니다",
          due_date,
          created_at,
          "image",
          "inspection",
          null,
          reward
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }
          return res.json({ result: true });
        }
      );
    }
  );
});

module.exports = router;
