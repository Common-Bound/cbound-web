const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const db = require("../../../db/index");
const uuid = require("uuid/v4");
const moment = require("moment");
const router = express.Router();
const logger = require("../../../config/logger");

// path: ~/auth/creator/signup
passport.use(
  "signup-local-creator",
  new LocalStrategy(
    {
      // local 전략을 세움
      usernameField: "email",
      passwordField: "password",
      session: true, // 세션에 저장 여부
      passReqToCallback: false
    },
    (email, password, done) => {
      // logger.info(email, password);
      // 먼저 주어진 email 과 일치하는 유저를 찾는다
      // 이 떄, email은 유일한 식별자라고 가정한다
      db.query(
        "SELECT * FROM data_creator WHERE email=$1",
        [email],
        (err, results) => {
          if (err) {
            logger.error("Error when selecting user on login", err);
            return done(err);
          }
          // 주어진 email과 일치하는 유저가 존재한다면,
          // 즉, 반환되는 rows 가 적어도 하나 존재한다면(0보다 크다면)
          if (results.rows.length > 0) {
            logger.info(results.rows);
            // 이미 존재하는 email 이므로 회원가입 실패
            logger.info("이미 존재하는 아이디 입니다");
            return done(null, false, {
              message: "이미 존재하는 아이디 입니다"
            });
          }
          // 주어진 email과 일치하는 유저가 존재하지 않는다면 회원가입 가능
          else {
            logger.info("존재하지 않는 아이디 이므로 회원가입 가능합니다");
            // uuid 생성하여 id 필드 부여
            const uid = uuid();
            bcrypt.hash(password, null, null, function(err, hash) {
              // id, email, password, name, phone_number, gender, date_of_birth, created_at, rank, point, account
              db.query(
                "insert into data_creator values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
                [
                  uid,
                  email,
                  hash,
                  null,
                  null,
                  null,
                  null,
                  moment().toISOString(),
                  "beginner",
                  0,
                  null
                ],
                function(err, rows) {
                  if (err) {
                    logger.info("Error when hashing password", err);
                    return done(err);
                  }
                  return done(null, rows);
                }
              );
            });
          }
        }
      );
    }
  )
);

// 로그인이 성공 시 실행되는 done(null, user) 에서 user 객체를 전달받아
// user.id를 세션(req.session.passport.user)에 저장한다
passport.serializeUser((user, done) => {
  done(null, user);
});

// 서버로 들어오는 요청마다 serailizeUser에 저장된 세션 정보를 DB 데이터와 비교
// 해당하는 유저 정보가 있으면 done의 두 번째 인자를 req.user에 저장한다
// 요청을 처리할 때도 유저 정보를 req.user를 통해서 전달한다
// 이때 첫 번째 매개변수 user는 serializeUser의 user 값이다
passport.deserializeUser((user, done) => {
  done(null, user);
});

// 회원가입 요청 핸들링 라우트
router.post("/", (req, res, next) => {
  passport.authenticate("signup-local-creator", (err, user, info) => {
    // passport 인증 도중 에러 발생시 콘솔에 찍어준다
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }
    // 인증 실패 메시지를 담은 info 메시지가 존재한다면 해당 메시지를 클라이언트로 전달한다
    if (info !== undefined) {
      logger.info(info.message);
      return res.status(401).json(info);
    }
    // 위 두 상황을 모두 통과하면 로그인 성공
    else {
      logger.info("회원가입 성공!");
      return res.json({ result: true });
    }
  })(req, res, next);
});

module.exports = router;
