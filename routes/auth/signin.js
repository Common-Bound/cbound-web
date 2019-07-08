const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const db = require("../../db/index");
const router = express.Router();

// path: ~/auth/signin
passport.use(
  "signin-local",
  new LocalStrategy(
    {
      // local 전략을 세움
      usernameField: "name",
      passwordField: "password",
      session: true, // 세션에 저장 여부
      passReqToCallback: false
    },
    (name, password, done) => {
      // 먼저 주어진 name 과 일치하는 유저를 찾는다
      // 이 떄, name은 유일한 식별자라고 가정한다
      db.query(
        "SELECT * FROM test_user WHERE name=$1",
        [name],
        (err, results) => {
          if (err) {
            console.error("Error when selecting user on login", err);
            return done(err);
          }
          // 주어진 name과 일치하는 유저가 존재한다면,
          // 즉, 반환되는 rows 가 적어도 하나 존재한다면(0보다 크다면)
          if (results.rows.length > 0) {
            console.log("유저 정보 찾음: ");
            console.log(results.rows[0]);
            const user = results.rows[0]; // 그 row를 user 변수에 저장한다
            // 주어진 password와 db에 저장된 password를 비교한다
            console.log(password, user.password);
            bcrypt.compare(password, user.password, function(err, res) {
              console.log(res);
              // 결과 값이 참이라면, 로그인이 성공한다
              if (res) {
                console.log("비밀번호 해쉬 결과 : 로그인 성공");
                done(null, user);
              }
              // 결과 값이 거짓이라면, 즉 비밀번호가 서로 다르다면 로그인 실패
              else {
                console.log("비밀번호 해쉬 결과 : 로그인 실패");
                done(null, false);
              }
            });
          }
          // 주어진 name과 일치하는 유저가 존재하지 않는다면 로그인 실패
          else {
            console.log("주어진 name과 일치하는 유저 없음");
            done(null, false);
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
router.post(
  "/",
  passport.authenticate("signin-local", { failureRedirect: "/auth/signin" }),
  (req, res) => {
    console.log("로그인 성공!");
    const { user } = req;
    console.log(user);

    res.json({ result: true });
  }
);

module.exports = router;
