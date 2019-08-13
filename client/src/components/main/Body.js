import React, { Component } from "react";
import styled from "styled-components";

import background from "../../images/BackGround.png";

const BodyContainer = styled.div`
  width: 100%;
`;

const MainSlideContainer = styled.div`
  position: relative;
  top: 64px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-image: url(${background});
  background-repeat: no-repeat;
  width: 100%;
  height: 600px;

  background-size: 100% 100%;
  background-position: center;
`;

const MainSlide = styled.div`
  width: 80%;
  height: 300px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MainTitle = styled.div`
  width: 500px;
  height: 240px;
  padding: 30px;
  margin-left: 60px;

  text-align: right;
  font-family: SpoqaHanSans;
  font-size: 80px;
  font-weight: bold;
  line-height: 80px;
  color: #ffffff;
`;

const SubTitle = styled.div`
  width: 420px;
  height: 180px;
  padding: 30px;
  margin-right: 140px;

  text-align: left;
  font-family: SpoqaHanSans;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
`;

const TestButton = styled.div`
  width: 240px;
  height: 60px;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 40px;
  border-radius: 100px;
  border: 1px solid white;
`;

const TestButtonText = styled.div`
  font-family: SpoqaHanSans;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
`;

const AboutSection = styled.div`
  background-color: black;
  width: 100%;
  height: 600px;
`;

const UsecaseSection = styled.div`
  background-color: black;
  width: 100%;
  height: 600px;
`;

const ContactSection = styled.div`
  background-color: black;
  width: 100%;
  height: 600px;
`;

const Footer = styled.div`
  background-color: black;
  width: 100%;
  height: 600px;
`;

class Body extends Component {
  render() {
    return (
      <BodyContainer>
        <MainSlideContainer>
          <MainSlide className="animated fadeInUp ">
            <MainTitle>
              Ima<span style={{ color: "#389eff" }}>ge</span> Knowled
              <span style={{ color: "#00d8ff" }}>ge</span>
            </MainTitle>
            <SubTitle>
              모든 이미지에는 의미가 있습니다. 일상의 이미지를 우리 모두의
              지식으로 바꾸는 일. 커먼 바운드가 함께 합니다.
            </SubTitle>
          </MainSlide>
          <TestButton className="animated fadeInUp  delay-1s">
            <TestButtonText>체험하기</TestButtonText>
          </TestButton>
        </MainSlideContainer>
        <AboutSection />
        <UsecaseSection />
        <ContactSection />
        <Footer />
      </BodyContainer>
    );
  }
}

export default Body;
