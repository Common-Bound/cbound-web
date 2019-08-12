import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SelectContainer = styled.div`
  width: 100%;
  height: 100vh;
  text-align: center;
  background-color: lightgrey;
`;

const SelectMain = styled.div`
  display: flex;
  align-items: center;
  background-color: grey;
`;

const SelectMenu = styled.div`
  display: flex;
  justify-content: space-around;
  width: 60%;
  margin: 0 auto;
  background-color: black;
`;

const SelectCard = styled.div`
  width: 250px;
  height: 280px;
  border: 1px solid red;
  background-color: white;
`;

const SelectTitle = styled.div`
  padding 10vh;
  font-size: 2rem;
`;

class Select extends Component {
  render() {
    return (
      <SelectContainer>
        <SelectTitle>Common Bound</SelectTitle>
        <SelectMain>
          <SelectMenu>
            <Link to="/">
              <SelectCard>데이터 요청자 로그인</SelectCard>
            </Link>
            <Link to="/auth/signin">
              <SelectCard>데이터 생산자 로그인</SelectCard>
            </Link>
          </SelectMenu>
        </SelectMain>
      </SelectContainer>
    );
  }
}

export default Select;
