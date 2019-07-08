import React, { Component } from "react";

class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      passwordCheck: "",
      passwordError: "",
      gender: "",
      genderError: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit = async e => {
    e.preventDefault();

    console.log(this.state.name, this.state.password, this.state.passwordCheck);

    (await this.state.password) !== this.state.passwordCheck
      ? this.setState({ PasswordError: true })
      : this.setState({ PasswordError: false });

    if (this.state.PasswordError) {
      return alert("비밀번호가 서로 다릅니다");
    } else {
      const url = "/auth/signup";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.name,
          password: this.state.password
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="user-name">아이디</label>
          <br />
          <input
            required
            value={this.state.name}
            name="name"
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <input
            type="password"
            required
            value={this.state.password}
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
            value={this.state.passwordCheck}
            name="passwordCheck"
            onChange={this.handleChange}
          />
          {this.state.passwordError && (
            <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div>
          )}
        </div>
        <div>
          <input type="checkbox" name="user-gender-m" />남
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
