const assert = require("assert");
const db = require("../../db/index");
const bcrypt = require("bcrypt-nodejs");
const uuid = require("uuid/v4");

describe("# 생산자 로그인 테스트", function() {
  it("로그인 테스트", function(done) {
    // 테스트용 계정(email: 1, password: 1)로 로드인 시도
    const email = 1;
    const pw = 1;
    bcrypt.hash(pw, null, null, function(err, hash) {
      const sql = `SELECT * FROM data_creator WHERE email='${email}' and password='${hash}'`;
      db.query(sql, [], function(err, results) {
        // db 에러시 실패
        if (err) {
          done(err);
        }
        // 사용자가 존재하지 않으면 실패. 반드시 로그인 성공해야함
        else if (results.rows.length < 1) {
          done(false);
        }
        // 사용자가 존재하면 성공
        else {
          done();
        }
      });
    });
  });

  it("비밀번호 오류 테스트", function(done) {
    // 테스트용 계정 (email: 1)로 비밀번호를 다르게해서 로그인 시도
    const email = 1;
    const pw = uuid();
    bcrypt.hash(pw, null, null, function(err, hash) {
      const sql = `SELECT * FROM data_creator WHERE email='${email}' and password='${hash}'`;
      db.query(sql, [], function(err, results) {
        // db 에러시 실패
        if (err) {
          done(err);
        }
        // 사용자가 존재하면 실패. 비밀번호 오류 반환해야 성공
        else if (results.rows.length > 0) {
          done(false);
        }
        // 사용자 존재하지 않으면 성공
        else {
          done();
        }
      });
    });
  });

  it("존재하지 않는 생산자 로그인 테스트", function(done) {
    // 랜덤하게 생성된 uuid ID/PW 로 로그인 시도
    const email = uuid();
    const sql = `SELECT * FROM data_creator WHERE email='${email}'`;
    db.query(sql, [], function(err, results) {
      // db 에러시 실패
      if (err) {
        done(err);
      }
      // 사용자가 존재하면 실패. 반드시 존재하지 않는 사용자 이여야 함
      else if (results.rows.length > 0) {
        done(false);
      }
      // 사용자가 존재하지 않으면 성공
      else {
        done();
      }
    });
  });
});
