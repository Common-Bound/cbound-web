const db = require("../../db/index");
const bcrypt = require("bcrypt-nodejs");
const uuid = require("uuid/v4");

describe("# 생산자 회원가입 테스트", function() {
  it("회원가입 테스트", function(done) {
    // 테스트 아이디와 비밀번호로 회원가입을 시도하고, 해당 계정을 삭제하는 것을 시도
    const id = uuid();
    const email = `example${Math.floor(Math.random() * 100000)}@gmail.com`;
    const pw = Math.floor(Math.random() * 100000);
    bcrypt.hash(pw, null, null, (err, hash) => {
      const sql = `insert into data_creator values ($1, $2, $3)`;
      db.query(sql, [id, email, hash], (err, results) => {
        // db 에러시 실패
        if (err) {
          done(err);
        }
        // 회원 가입 성공하면 다시 테스트 계정을 삭제한다
        else {
          const sql = `delete from data_creator where id='${id}'`;
          db.query(sql, [], (err, results) => {
            // db 에러시 실패
            if (err) {
              done(err);
            }
            // 삭제까지 성공하면 테스트 성공
            else {
              done();
            }
          });
        }
      });
    });
  });

  it("존재하는 아이디로 회원가입 테스트", function(done) {
    // 기존에 존재하는 테스트 계정(email: 1, pw: 1)으로 회원가입 시도
    const id = uuid();
    const email = 1;
    const pw = 1;
    bcrypt.hash(pw, null, null, (err, hash) => {
      const sql = `insert into data_creator values($1, $2, $3)`;
      db.query(sql, [id, email, pw], (err, results) => {
        // db 에러시 테스트 성공(이미 존재하는 계정인데 insert 시도하므로)
        if (err) {
          done();
        }
        // 이미 존재하는 계정인데 회원가입이 되면 실패!
        else {
          done(false);
        }
      });
    });
  });
});
