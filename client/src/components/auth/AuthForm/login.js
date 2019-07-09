import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      result: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const url = "/auth/signin";
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
        if (data.message) {
          return alert(data.message);
        }
        if (data.result === true) {
          this.props.signIn();
          this.setState({ result: true });
        }
        this.setState({ result: false });
      })
      .catch(error => {
        return alert("아이디 또는 비밀번호를 잘못 입력하셨습니다");
      });
  };

  render() {
    const { name, password, result } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={this.handleChange}
            placeholder="name"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            placeholder="password"
          />
          <button type="submit" onClick={this.handleSubmit}>
            로그인
          </button>
        </form>
        <p>
          아직 회원이 아니신가요?
          <Link to="/auth/signup">
            <button>회원가입</button>
          </Link>
        </p>
        <div>{result === true ? <Redirect to="/" /> : ""}</div>
      </div>
    );
  }
}

export default Login;
