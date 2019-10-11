import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./Header.css";

//import logo from "../../images/logo_2.webp";
//import name from "../../images/COMMONBOUND.webp";

const HeaderContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #000000;
  width: 100%;
  height: 8vh;

  z-index: 1;

  transition: 0.5s;

  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const Logo = styled(Link)`
  margin-left: 10%;
  background-image: url(${props => props.img});
  width: 48px;
  height: 48px;
  background-size: cover;

  @media (max-width: 500px) {
    margin: 0;
    width: 36px;
    height: 36px;
  }
`;

const Title = styled(Link)`
  background-image: url(${props => props.img});
  width: 260px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;

  @media (max-width: 500px) {
    display: none;
  }
`;

const LoginButton = styled(Link)`
  margin-right: 7%;
  width: 100px;
  height: 32px;
  border-radius: 20px;
  border: 1px solid white;

  font-size: 18px;
  text-align: center;
  color: white;

  transition: 0.5s;

  :hover {
    background-color: white;
    color: black;
  }

  @media (max-width: 500px) {
    display: none;
  }
`;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined
    };
  }

  fetchData = async () => {
    const url = `/api${this.props.location}/point`;
    console.log(this.props);

    const result = await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);

        return new Promise(resolve => resolve(data.result));
      })
      .catch(err => {
        console.log(err);
      });

    await this.setState(
      {
        data: result
      },
      console.log(this.state.data)
    );
  };

  componentWillMount = async () => {
    await this.fetchData();
  };

  render() {
    return (
      <HeaderContainer>
        <Logo
          to="/"
          img={
            "https://task-data-bucket.s3.ap-northeast-2.amazonaws.com/logo_2.webp"
          }
        />
        <Title
          to="/"
          img={
            "https://task-data-bucket.s3.ap-northeast-2.amazonaws.com/COMMONBOUND.webp"
          }
        />
        {this.props.page === "main" ? (
          <LoginButton to="/signin/select">Sign In</LoginButton>
        ) : (
          <div class="dropdown">
            <button class="dropbtn"></button>
            <div class="dropdown-content">
              <a href="#">프로필</a>
              <a href="#">포인트</a>
              <a href="#">개인정보 변경</a>
            </div>
            {this.state.data}
          </div>
        )}
      </HeaderContainer>
    );
  }
}

export default Header;
