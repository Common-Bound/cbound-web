import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
//import background from "../../images/BackGround.webp";
import About from "./About";
import OurServices from "./OurServices";
import Footer from "./Footer";

const BodyContainer = styled.div`
  width: 100%;
  position: relative;
  top: 7vh;

  display: flex;
  flex-direction: column;
`;

const MainSlideContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-image: url("https://task-data-bucket-copied.s3.ap-northeast-2.amazonaws.com/BackGround.webp");
  background-repeat: no-repeat;
  width: 100%;
  height: 600px;

  background-position: center;

  @media (max-width: 500px) {
    justify-content: flex-start;
  }
`;

const MainSlide = styled.div`
  width: 80%;
  padding: 40px;
  margin: 0 auto;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 500px) {
    margin-top: 80px;
    padding: 0px;
  }
`;

const MainTitle = styled.div`
  width: 500px;
  padding: 30px;

  text-align: right;
  font-family: SpoqaHanSans;
  font-size: 80px;
  font-weight: bold;
  line-height: 80px;
  color: #ffffff;

  @media (max-width: 500px) {
    font-size: 46px;
    text-align: center;
    line-height: 46px;
    padding: 0px 0px 30px 0px;
  }
`;

const SubTitle = styled.div`
  width: 500px;
  padding: 30px;

  text-align: left;
  font-family: SpoqaHanSans;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  word-break: keep-all;

  @media (max-width: 500px) {
    width: 100%;
    text-align: center;
    font-family: SpoqaHanSans;
    font-size: 18px;
    font-weight: normal;
    line-height: 24px;
    padding: 0px;
  }
`;

const TestButton = styled(Link)`
  width: 240px;
  height: 60px;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 40px;
  border-radius: 100px;
  border: 1px solid white;

  color: white;
  transition: 0.5s;
  text-decoration: none !important;

  :hover {
    background-color: white;
    color: black;
  }
`;

const TestButtonText = styled.div`
  font-family: SpoqaHanSans;
  font-size: 20px;
  font-weight: bold;
`;

const AboutSection = styled.div`
  background-color: black;
  width: 100%;
`;

const OurServicesSection = styled.div`
  background-color: black;
  width: 100%;
`;

// const ContactSection = styled.div`
//   background-color: black;
//   width: 100%;
//   height: 600px;
// `;

const FooterSection = styled.div`
  background-color: black;
  width: 100%;
  height: 200px;
`;

class Body extends Component {
  render() {
    return (
      <BodyContainer>
        <MainSlideContainer>
          <MainSlide data-aos="fade-up" data-aos-duration="1000">
            <MainTitle>
              Ima<span style={{ color: "#389eff" }}>ge</span> Knowled
              <span style={{ color: "#00d8ff" }}>ge</span>
            </MainTitle>
            <SubTitle>
              모든 이미지에는 의미가 있습니다.
              <br /> 일상의 이미지를 우리 모두의 지식으로 바꾸는 일.
              <br /> 커먼 바운드가 함께 합니다.
            </SubTitle>
          </MainSlide>
          <TestButton
            data-aos="fade-up"
            data-aos-delay="1000"
            data-aos-duration="1000"
            to="/signin/select"
          >
            <TestButtonText>체험하기</TestButtonText>
          </TestButton>
        </MainSlideContainer>
        <AboutSection>
          <About />
        </AboutSection>
        <OurServicesSection>
          <OurServices />
        </OurServicesSection>
        <FooterSection>
          <Footer />
        </FooterSection>
      </BodyContainer>
    );
  }
}

export default Body;
