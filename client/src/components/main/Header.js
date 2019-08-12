import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import logo from "../../images/좌측상단_로고.png";
import name from "../../images/COMMONBOUND.png";
import signIn from "../../images/Sign_In_Off.png";

const HeaderContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;

  align-items: center;

  background-color: #000000;
  width: 100%;
  height: 100px;
`;

const Logo = styled.div`
  padding: 0px 24px;

  width: 67px;
  height: 67px;
`;

const Title = styled.div`
  width: 347px;
  height: 40px;
`;

const LoginButton = styled.div`
  margin: 20px;

  width: 127px;
  height: 41px;
`;

class Header extends Component {
  render() {
    return (
      <HeaderContainer>
        <Logo>
          <img src={logo} alt="" />
        </Logo>
        <Title>
          <img src={name} alt="" />
        </Title>
        <Link to="/signin/select">
          <LoginButton>
            <img src={signIn} alt="" />
          </LoginButton>
        </Link>
      </HeaderContainer>
    );
  }
}

export default Header;
