import React, { Component } from "react";
import styled from "styled-components";
import Header from "./main/Header";
//import background from "../images/BackGround.webp";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: black;
`;

const MainContainer = styled.div`
  position: relative;
  top: 64px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-image: url("https://task-data-bucket.s3.ap-northeast-2.amazonaws.com/BackGround.webp");
  background-repeat: no-repeat;
  width: 100%;
  height: 600px;

  background-size: 100% 100%;
  background-position: center;

  @media (max-width: 500px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const Title = styled.div`
  padding: 10px;
  font-size: 64px;
  text-align: center;
  color: white;
  word-break: keep-all;

  @media (max-width: 810px) {
    font-size: 46px;
  }

  @media (max-width: 500px) {
    margin-top: 80px;
    font-size: 32px;
  }
`;

class notFound extends Component {
  render() {
    return (
      <Container>
        <Header page="main" />
        <MainContainer>
          <Title>요청하신 페이지를 찾을 수 없습니다</Title>
        </MainContainer>
      </Container>
    );
  }
}

export default notFound;
