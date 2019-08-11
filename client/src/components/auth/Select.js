import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SelectContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
`;

const SelectMenu = styled.div`
  display: flex;
  justify-content: space-around;
  width: 60%;
  margin: 0 auto;
`;

const SelectCard = styled.div`
  width: 250px;
  height: 280px;
  border: 1px solid red;
`;

const SelectTitle = styled.div`
  font-size: 2rem;
`;

class Select extends Component {
  render() {
    return (
      <SelectContainer>
        <SelectTitle>Common Bound</SelectTitle>
        <SelectMenu>
          <Link to="/">
            <SelectCard>데이터 요청자 로그인</SelectCard>
          </Link>
          <Link to="/auth/signin">
            <SelectCard>데이터 생산자 로그인</SelectCard>
          </Link>
        </SelectMenu>
      </SelectContainer>
    );
  }
}

export default Select;
