import React, { Component } from "react";
import styled from "styled-components";
import mobile_phone from "../../assets/img/homepage/mobile-phone3.jpg";
import sound from "../../assets/img/homepage/sound.png";
import worker from "../../assets/img/homepage/worker.jpg";

const AboutContainer = styled.div`
  width: 100%;
  min-height: 600px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled.div`
  width: 60%;
  padding: 40px;

  display: flex;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 500px) {
    width: 80%;
  }
`;

const Line = styled.div`
  width: 30%;
  height: 1px;
  background-color: grey;
`;

const Title = styled.div`
  font-family: Avenir;
  color: #389eff;
`;

const CardContainer = styled.div`
  width: 80%;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Card = styled.div`
  width: 30%;
  min-width: 300px;
  height: 330px;

  margin: 20px 0px;

  border-radius: 2%;
  background-color: white;
  border: 1px solid black;
  transition: 0.5s;

  :hover {
    background-color: black;
    border: 1px solid white;
  }
  :hover div {
    color: white;
  }
`;

const Image = styled.div`
  width: 100%;
  height: 50%;

  border-radius: 2% 2% 0% 0%;
  background-image: url(${props => props.src});
  background-size: 102% 100%;
  background-repeat: no-repeat;
  border: 1px solid black;
`;

const Description = styled.div`
  width: 100%;
  height: 50%;

  padding: 20px;
`;

const DescriptionTitle = styled.div`
  padding-bottom: 10px;
  font-family: SpoqaHanSans;
  font-size: 18px;
  font-weight: bold;
  line-height: 26px;
  color: black;
  transition: 0.3s;
`;

const DescriptionSubTitle = styled.div`
  font-family: SpoqaHanSans;
  font-size: 14px;
  color: grey !important;
  word-break: keep-all;
`;

class About extends Component {
  render() {
    return (
      <AboutContainer id="about">
        <TitleContainer data-aos="fade-up">
          <Line></Line>
          <Title>About Us</Title>
          <Line></Line>
        </TitleContainer>
        <CardContainer
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          <Card>
            <Image src={mobile_phone}></Image>
            <Description>
              <DescriptionTitle>
                일상 속 순간들이 <br />
                인공지능의 지식이됩니다
              </DescriptionTitle>
              <DescriptionSubTitle>
                커먼바운드는 우리 일상 속 순간을 포착하여 그 안의 새로운 의미를
                찾고자 시작되었습니다.
              </DescriptionSubTitle>
            </Description>
          </Card>
          <Card>
            <Image src={sound}></Image>
            <Description>
              <DescriptionTitle>
                간단한 작업으로 <br />
                기술 발전에 기여하세요
              </DescriptionTitle>
              <DescriptionSubTitle>
                간단한 작업을 통해 인공지능 학습 데이터를 만드는 일에 기여하고
                기술의 진보에 앞장서세요.
              </DescriptionSubTitle>
            </Description>
          </Card>
          <Card>
            <Image src={worker}></Image>
            <Description>
              <DescriptionTitle>
                언제나 어디서나 <br />
                이익을 창출하세요
              </DescriptionTitle>
              <DescriptionSubTitle>
                인터넷이 연결된 환경이라면 언제, 어디서나 수익을 올릴 수
                있습니다. 지금 시작하세요.
              </DescriptionSubTitle>
            </Description>
          </Card>
        </CardContainer>
      </AboutContainer>
    );
  }
}

export default About;
