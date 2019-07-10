import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordCheck: "",
      passwordError: "",
      result: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit = async e => {
    e.preventDefault();

    console.log(
      this.state.email,
      this.state.password,
      this.state.passwordCheck
    );

    (await this.state.password) !== this.state.passwordCheck
      ? this.setState({ PasswordError: true })
      : this.setState({ PasswordError: false });

    if (this.state.PasswordError) {
      return alert("비밀번호가 서로 다릅니다");
    } else {
      const url = this.props.match.path; // /auth/signup
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.result === true) {
            alert("회원가입에 성공하였습니다");
            return this.setState({ result: true });
          }
          return this.setState({ result: false });
        })
        .catch(error => {
          return alert("이미 존재하는 아이디 입니다"); // 임시
        });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const {
      email,
      password,
      passwordCheck,
      passwordError,
      result
    } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <input
            required
            value={email}
            name="email"
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <input
            type="password"
            required
            value={password}
            name="password"
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <input
            type="password"
            required
            value={passwordCheck}
            name="passwordCheck"
            onChange={this.handleChange}
          />
          {passwordError && (
            <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div>
          )}
        </div>
        <div>
          <input type="submit" value="가입" />
        </div>
        <div>{result === true ? <Redirect to="/auth/signin" /> : ""}</div>
      </form>
    );
  }
}

export default AuthForm;
