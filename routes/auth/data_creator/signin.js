const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const db = require("../../../db/index");
const router = express.Router();

// path: ~/auth/creator/signin
passport.use(
  "signin-local-creator",
  new LocalStrategy(
    {
      // local 전략을 세움
      usernameField: "email",
      passwordField: "password",
      session: true, // 세션에 저장 여부
      passReqToCallback: false
    },
    (email, password, done) => {
      // 먼저 주어진 email 과 일치하는 유저를 찾는다
      // 이 떄, email은 유일한 식별자라고 가정한다
      db.query(
        "SELECT * FROM data_creator WHERE email=$1",
        [email],
        (err, results) => {
          if (err) {
            console.error("Error when selecting user on login", err);
            return done(err);
          }
          // 주어진 email과 일치하는 유저가 존재한다면,
          // 즉, 반환되는 rows 가 적어도 하나 존재한다면(0보다 크다면)
          if (results.rows.length > 0) {
            console.log("유저 정보 찾음: ");
            console.log(results.rows[0]);
            const user = results.rows[0]; // 그 row를 user 변수에 저장한다
            // 주어진 password와 db에 저장된 password를 비교한다
            bcrypt.compare(password, user.password, function(err, res) {
              if (err) {
                console.log("Error when comparing password hash", err);
                return done(err);
              }
              // 결과 값이 참이라면, 로그인이 성공한다
              if (res) {
                done(null, user);
              }
              // 결과 값이 거짓이라면, 즉 비밀번호가 서로 다르다면 로그인 실패
              else {
                done(null, false, { message: "비밀번호가 틀렸습니다" });
              }
            });
          }
          // 주어진 name과 일치하는 유저가 존재하지 않는다면 로그인 실패
          else {
            done(null, false, { message: "존재하지 않는 아이디 입니다" });
          }
        }
      );
    }
  )
);

// 로그인이 성공 시 실행되는 done(null, user) 에서 user 객체를 전달받아
// user를 세션(req.session.passport.user)에 저장한다
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

// 로그인 요청 핸들링 라우트
router.post("/", (req, res, next) => {
  passport.authenticate("signin-local-creator", (err, user, info) => {
    // passport 인증 도중 에러 발생시 콘솔에 찍어준다
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    // 인증 실패 메시지를 담은 info 메시지가 존재한다면 해당 메시지를 클라이언트로 전달한다
    if (info !== undefined) {
      console.log(info.message);
      return res.status(401).json(info);
    }
    // 위 두 상황을 모두 통과하면 로그인 성공
    else {
      req.logIn(user, err => {
        if (err) {
          return res.send(err);
        }
        console.log("로그인 성공!");
        return res.json({ result: true });
      });
    }
  })(req, res, next);
});

module.exports = router;
