import React, { useState } from "react";

const AuthForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [gender, setGender] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [genderError, setGenderError] = useState(false);

  const onSubmit = e => {
    e.preventDefault();

    if (password !== passwordCheck) {
      return setPasswordError(true);
    }

    /*if (!gender) {
      return setGenderError(true);
    }*/

    console.log({
      id,
      password,
      passwordCheck,
      gender
    });

    const url = "/users";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        password: password,
        passwordCheck: passwordCheck
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  };
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <input name="user-id" required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <input name="user-password" type="password" required />
      </div>
      <div>
        <label htmlFor="user-password-check">비밀번호체크</label>
        <br />
        <input name="user-password-check" type="password" required />
        {passwordError && (
          <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div>
        )}
      </div>
      <div>
        <input type="checkbox" name="user-gender-m" />남{" "}
        <input type="checkbox" name="user-gender-fm" />녀
        {genderError && <div style={{ color: "red" }}>성별 입력 필수</div>}
      </div>
      <div>
        <input type="submit" value="가입" />
      </div>
    </form>
  );
};

export default AuthForm;
