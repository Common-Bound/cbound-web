import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
//import background from "../../images/BackGround.webp";

const BodyContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const MainSlideContainer = styled.div`
  position: relative;
  top: 8vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-image: url("https://task-data-bucket.s3.ap-northeast-2.amazonaws.com/BackGround.webp");
  background-repeat: no-repeat;
  width: 100%;
  height: 600px;

  background-size: 100% 100%;
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
  componentDidMount() {
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.innerHTML =
      "(function() {var w = window;if (w.ChannelIO) {return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');}var d = window.document;var ch = function() {ch.c(arguments);};ch.q = [];ch.c = function(args) {ch.q.push(args);};w.ChannelIO = ch;function l() {if (w.ChannelIOInitialized) {return;}w.ChannelIOInitialized = true;var s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';s.charset = 'UTF-8';var x = document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);}if (document.readyState === 'complete') {l();} else if (window.attachEvent) {window.attachEvent('onload', l);} else {window.addEventListener('DOMContentLoaded', l, false);window.addEventListener('load', l, false);}})();ChannelIO('boot', {'pluginKey': '26b47c7e-4fa5-43a4-9b22-dbd0a29ce25b'});";
    document.body.appendChild(s);
  }
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
              모든 이미지에는 의미가 있습니다.
              <br /> 일상의 이미지를 우리 모두의 지식으로 바꾸는 일.
              <br /> 커먼 바운드가 함께 합니다.
            </SubTitle>
          </MainSlide>
          <TestButton
            className="animated fadeInUp  delay-1s"
            to="/signin/select"
          >
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
