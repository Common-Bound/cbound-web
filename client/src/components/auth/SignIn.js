import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import styled from "styled-components";
import Button from "@material-ui/core/Button";

const SingInContainer = styled.div`
  width: 100%;
`;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
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

    const url = this.props.match.path; // /auth/signin
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
        if (data.message) {
          return alert(data.message);
        }
        if (data.result === true) {
          this.setState({ result: true });
        }
        this.setState({ result: false });
      })
      .catch(error => {
        return alert(error);
      });
  };

  render() {
    const { email, password, result } = this.state;
    return (
      <SingInContainer>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="email"
            value={email}
            onChange={this.handleChange}
            placeholder="email"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            placeholder="password"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={this.handleSubmit}
          >
            로그인
          </Button>
        </form>
        <p>
          아직 회원이 아니신가요?
          <Link to="/auth/signup">
            <button>회원가입</button>
          </Link>
        </p>
        <div>{result === true ? <Redirect to="/mypage" /> : ""}</div>
      </SingInContainer>
    );
  }
}

export default SignIn;
