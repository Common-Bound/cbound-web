import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import styled from "styled-components";
import background from "../../images/BackGround.png";
import Header from "../main/Header";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: black;
`;

const SignInContainer = styled.div`
  position: relative;
  top: 64px;
  width: 100%;
  height: 600px;
  text-align: center;
  background-image: url(${background});
  background-size: 100% 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignInMain = styled.div`
  width: 80%;
  margin: 0 auto;

  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`;

const LeftCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const RightCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SubTitle = styled.div`
  font-size: 80px;
  font-weight: bold;
  font-family: SpoqaHanSans;
  color: ${props => (props.color ? props.color : "white")};

  margin-bottom: 40px;
`;

const LeftDescription = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
`;

const StyledForm = styled.form`
  background-color: rgba(255, 255, 255, 0.9);

  width: 400px;
  height: 200px;
  padding: 20px;
  margin-top: 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;

  outline: none;
  border-top: none;
  border-left: none;
  border-right: none;
  background-color: rgba(255, 255, 255, 0);
  border-bottom-color: ${props => (props.value ? "black" : "grey")};
  transition: 0.5s;

  :focus {
    border-bottom-color: black;
  }
  :active {
    border-bottom-color: black;
  }
  -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0) inset;
  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  :-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 80%;
  margin-top: 10px;
`;

const Button = styled.div`
  width: 80px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 100px;
  border: 1px solid black;

  color: black;
  transition: 0.5s;
  text-decoration: none !important;
  cursor: pointer;

  :hover {
    background-color: black;
    color: white;
  }
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

    const url = this.props.match.url; // /:user_type/auth/signin
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
      <Container>
        <Header page="main" />
        <SignInContainer>
          <SignInMain className="animated fadeInUp ">
            <LeftCard>
              <SubTitle>
                Sign <span style={{ color: "#00d8ff" }}>In</span>
              </SubTitle>
              <LeftDescription>
                일상을 관찰하는 것에 흥미가 있는
              </LeftDescription>
              <LeftDescription>
                사진을 찍고, 올리면서 보상을 받기를 원하는 모든 사람
              </LeftDescription>
            </LeftCard>
            <RightCard>
              <StyledForm onSubmit={this.handleSubmit}>
                <StyledInput
                  type="text"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  placeholder="이메일"
                />
                <StyledInput
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  placeholder="비밀번호"
                />
                <StyledButtonContainer>
                  <Button onClick={this.handleSubmit}>로그인</Button>
                  <button type="submit" style={{ display: "none" }} />
                  <Link
                    to={`/auth/${this.props.match.params.user_type}/signup`}
                  >
                    아직 회원이 아니신가요?
                  </Link>
                </StyledButtonContainer>
              </StyledForm>
              <div>{result === true ? <Redirect to="/mypage" /> : ""}</div>
            </RightCard>
          </SignInMain>
        </SignInContainer>
      </Container>
    );
  }
}

export default SignIn;
