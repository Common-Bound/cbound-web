import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  position: fixed;
  justify-content: space-between;
  align-items: center;
  top: 0px;
  width: 100%;
  height: 60px;
  background-color: black;
`;

const Logo = styled.div`
  width: 30px;
  height: 30px;
  margin: 10px 40px;
  background-color: white;
  border-radius: 100%;
`;

const Title = styled.div`
  color: white;
`;

const LoginButton = styled.div`
  background-color: lightblue;
  width: 70px;
  height: 26px;
  margin: 10px 40px;
  border-radius: 40px;
  text-align: center;
`;

class Header extends Component {
  render() {
    return (
      <HeaderContainer>
        <Logo />
        <Title>Common Bound</Title>
        <Link to='/signin/select'><LoginButton>로그인</LoginButton></Link>
      </HeaderContainer>
    );
  }
}

export default Header;