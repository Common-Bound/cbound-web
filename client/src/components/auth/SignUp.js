import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import background from "../../images/BackGround.png";
import Header from "../main/Header";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: black;
`;

const SignUpContainer = styled.div`
  position: relative;
  top: 64px;

  width: 100%;
  height: 600px;
  text-align: center;
  background-image: url(${background});
  background-color: black;
  background-size: 100% 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 500px) {
    justify-content: flex-start;
  }
`;

const SignUpMain = styled.div`
  width: 80%;
  margin: 0 auto;

  display: flex;
  justify-content: space-around;
  align-items: flex-start;

  @media (max-width: 850px) {
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 500px) {
    width: 100%;
    padding-top: 80px;
  }
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

  @media (max-width: 500px) {
    width: 90%;
  }
`;

const MainTitle = styled.div`
  font-size: 80px;
  font-weight: bold;
  font-family: SpoqaHanSans;
  color: ${props => (props.color ? props.color : "white")};

  margin-bottom: 50px;

  @media (max-width: 850px) {
    font-size: 56px;
    margin-bottom: 24px;
  }
  @media (max-width: 500px) {
    font-size: 46px;
    margin-bottom: 10px;
  }
`;

const LeftDescription = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const StyledForm = styled.form`
  background-color: rgba(255, 255, 255, 0.9);

  width: 400px;
  height: 260px;
  padding: 20px;
  margin-top: 24px;

  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 500px) {
    width: 100%;
  }
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
  width: 100px;
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
class SignUp extends Component {
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
      const url = this.props.match.url; // /:user_type/auth/signup
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
            alert("회원가입에 성공하였습니다");
            return this.setState({ result: true });
          }
          return this.setState({ result: false });
        })
        .catch(error => {
          return alert(error); // 임시
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
      <Container>
        <Header page="main" />
        <SignUpContainer>
          <SignUpMain className="animated fadeInUp ">
            <LeftCard>
              <MainTitle>
                Sign <span style={{ color: "#00d8ff" }}>Up</span>
              </MainTitle>
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
                  required
                  type="text"
                  value={email}
                  name="email"
                  onChange={this.handleChange}
                  placeholder="이메일"
                />
                <StyledInput
                  required
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  placeholder="비밀번호"
                />
                <StyledInput
                  required
                  type="password"
                  name="passwordCheck"
                  value={passwordCheck}
                  onChange={this.handleChange}
                  placeholder="비밀번호 확인"
                />
                {passwordError && (
                  <div style={{ color: "red" }}>
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
                <StyledButtonContainer>
                  <Button onClick={this.handleSubmit}>회원가입</Button>
                  <input
                    type="submit"
                    value="가입"
                    style={{ display: "none" }}
                  />
                </StyledButtonContainer>
              </StyledForm>
              <div>
                {result === true ? (
                  <Redirect
                    to={`/auth/${this.props.match.params.user_type}/signin`}
                  />
                ) : (
                  ""
                )}
              </div>
            </RightCard>
          </SignUpMain>
        </SignUpContainer>
      </Container>
    );
  }
}

export default SignUp;
