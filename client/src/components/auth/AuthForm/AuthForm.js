import React, { Component } from "react";

class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      setId: "",
      password: "",
      setPassword: "",
      passwordCheck: "",
      setPasswordCheck: "",
      gender: "",
      setGender: "",
      passwordError: "",
      setPasswordError: "",
      genderError: "",
      setGenderError: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = e => {
    e.preventDefault();

    console.log(this.state.id, this.state.password, this.state.passwordCheck);

    const url = "/users";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: this.state.id,
        password: this.state.password,
        passwordCheck: this.state.passwordCheck
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  };
  render() {
    return (
      <form onSubmit={this.onSubmit}>
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
          {this.state.passwordError && (
            <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div>
          )}
        </div>
        <div>
          <input type="checkbox" name="user-gender-m" />남{" "}
          <input type="checkbox" name="user-gender-fm" />녀
          {this.state.genderError && (
            <div style={{ color: "red" }}>성별 입력 필수</div>
          )}
        </div>
        <div>
          <input type="submit" value="가입" />
        </div>
      </form>
    );
  }
}

export default AuthForm;
