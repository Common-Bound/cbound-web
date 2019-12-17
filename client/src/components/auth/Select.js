import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
//import background from "../../images/BackGround.webp";
import Header from "../main/Header";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: black;
`;

const SelectContainer = styled.div`
  position: relative;
  top: 7vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 600px;
  text-align: center;
  background-image: url("https://task-data-bucket-copied.s3.ap-northeast-2.amazonaws.com/BackGround.webp");
  background-color: black;

  background-size: 100% 100%;

  @media (max-width: 500px) {
    justify-content: flex-start;
  }
`;

const SelectMain = styled.div`
  display: flex;
  justify-content: space-around;
  align-content: center;

  width: 80%;
  margin: 0 auto;
  padding-top: 120px;

  @media (max-width: 810px) {
    padding-top: 80px;
    flex-direction: column;
  }
  @media (max-width: 500px) {
    padding-top: 60px;
  }
`;

const LeftCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 1200px) {
    margin-rigth: 80px;
    align-items: flex-start;
  }
  @media (max-width: 810px) {
    padding: 0 20px;
    margin-bottom: 40px;
  }
  @media (max-width: 500px) {
    align-items: center;
    padding: 0 10px;
  }
`;

const RightCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 1200px) {
    margin-left: 80px;
  }
  @media (max-width: 810px) {
    padding: 0 20px;
    margin: 0;
    align-items: flex-start;
  }
  @media (max-width: 500px) {
    align-items: center;
    padding: 0 10px;
  }
`;

const MainTitle = styled.div`
  font-size: 80px;
  line-height: 80px;
  font-weight: bold;
  font-family: SpoqaHanSans;
  color: ${props => (props.color ? props.color : "white")};

  @media (max-width: 1200px) {
    font-size: 56px;
    line-height: 56px;
  }
  @media (max-width: 500px) {
    font-size: 46px;
    line-height: 46px;
  }
`;

const Button = styled.div`
  width: 240px;
  height: 60px;

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 40px 0px;
  border-radius: 100px;
  border: 1px solid white;

  color: white;
  transition: 0.5s;
  text-decoration: none !important;

  :hover {
    background-color: white;
    color: black;
  }

  @media (max-width: 1200px) {
    width: 240px;
  }

  @media (max-width: 810px) {
    margin: 30px 0px;
  }
  @media (max-width: 500px) {
    heigth: 40px;
  }
`;

const LeftDescription = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
  word-break: keep-all;

  @media (max-width: 1200px) {
    text-align: left;
  }

  @media (max-width: 810px) {
    display: none;
  }
`;

const RightDescription = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  text-align: left;
  word-break: keep-all;

  @media (max-width: 810px) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none !important;
  color: white;
`;

class Select extends Component {
  render() {
    return (
      <Container>
        <SelectContainer>
          <Header page="main" />
          <SelectMain className="animated fadeInUp ">
            <LeftCard>
              <MainTitle>Data</MainTitle>
              <MainTitle color={"#389eff"}>Requester</MainTitle>
              <StyledLink to="/auth/requester/signin">
                <Button className="animated fadeInUp  delay-1s">
                  데이터 요청자(기업)
                </Button>
              </StyledLink>
              <LeftDescription className="animated fadeInUp  delay-1s">
                이미지 판별이 필요한 사업을 운영하는
              </LeftDescription>
              <LeftDescription className="animated fadeInUp  delay-1s">
                사람이 하는 일을 자동으로 효율적으로 해결하고 싶은 기업
              </LeftDescription>
            </LeftCard>

            <RightCard>
              <MainTitle>Data</MainTitle>
              <MainTitle color={"#00d8ff"}>Generator</MainTitle>
              <StyledLink to="/auth/creator/signin">
                <Button className="animated fadeInUp  delay-1s">
                  데이터 생산자(개인)
                </Button>
              </StyledLink>
              <RightDescription className="animated fadeInUp  delay-1s">
                일상을 관찰하는 것에 흥미가 있는
              </RightDescription>
              <RightDescription className="animated fadeInUp  delay-1s">
                사진을 찍고, 올리면서 보상을 받기를 원하는 모든 사람
              </RightDescription>
            </RightCard>
          </SelectMain>
        </SelectContainer>
      </Container>
    );
  }
}

export default Select;
