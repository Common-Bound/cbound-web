const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const db = require("../../db/index");
const router = express.Router();

// path: ~/auth/signup
passport.use(
  "signup-local",
  new LocalStrategy(
    {
      // local 전략을 세움
      usernameField: "name",
      passwordField: "password",
      session: true, // 세션에 저장 여부
      passReqToCallback: false
    },
    (name, password, done) => {
      console.log(name, password);
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
            // 이미 존재하는 name 이므로 회원가입 실패
            console.log("이미 존재하는 아이디 입니다");
            return done(null, false);
          }
          // 주어진 name과 일치하는 유저가 존재하지 않는다면 회원가입 가능
          else {
            console.log("존재하지 않는 아이디 이므로 회원가입 가능합니다");
            bcrypt.hash(password, null, null, function(err, hash) {
              db.query(
                "insert into test_user values ($1, $2)",
                [name, hash],
                function(err, rows) {
                  if (err) {
                    console.log(err);
                    return done(null, false);
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

// 로그인 요청 핸들링 라우트
router.post("/", passport.authenticate("signup-local"), (req, res) => {
  console.log("회원가입 성공!");
  const { user } = req;

  res.json({ result: true });
});

module.exports = router;
