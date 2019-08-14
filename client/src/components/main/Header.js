import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import logo from "../../images/logo_2.png";
import name from "../../images/COMMONBOUND.png";

const HeaderContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #000000;
  width: 100%;
  height: 64px;

  z-index: 1;
`;

const Logo = styled.img`
  margin-left: 24px;
  background-image: url(${props => props.img});
  width: 48px;
  height: 48px;
  background-size: cover;
`;

const Title = styled.div`
  background-image: url(${props => props.img});
  width: 260px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
`;

const LoginButton = styled.div`
  margin-right: 24px;
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
`;

const ProfileButton = styled.div`
  margin-right: 24px;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  border: 1px solid white;

  font-size: 18px;
  text-align: center;
  color: white;

  transition: 0.5s;

  text-decoration: none !important;
  :hover {
    background-color: white;
    color: black;
  }
`;

class Header extends Component {
  render() {
    return (
      <HeaderContainer>
        <Link to="/">
          <Logo img={logo} />
        </Link>
        <Link to="/">
          <Title img={name} />
        </Link>
        {this.props.page === "main" ? (
          <Link to="/signin/select">
            <LoginButton>SingIn</LoginButton>
          </Link>
        ) : (
          <ProfileButton />
        )}
      </HeaderContainer>
    );
  }
}

export default Header;
