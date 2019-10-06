import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import logo from "../../images/logo_2.webp";
import name from "../../images/COMMONBOUND.webp";

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

const ProfileButton = styled.div`
  margin-right: 10%;
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

  @media (max-width: 500px) {
    display: none;
  }
`;

class Header extends Component {
  render() {
    return (
      <HeaderContainer>
        <Logo to="/" img={logo} />
        <Title to="/" img={name} />
        {this.props.page === "main" ? (
          <LoginButton to="/signin/select">Sign In</LoginButton>
        ) : (
          <ProfileButton />
        )}
      </HeaderContainer>
    );
  }
}

export default Header;
