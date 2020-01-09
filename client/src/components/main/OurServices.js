import React, { Component } from "react";
import styled from "styled-components";
import road from "../../assets/img/homepage/road.png";
import transcribe from "../../assets/img/homepage/transcribe.png";
import audio from "../../assets/img/homepage/audio.jpg";
import survey from "../../assets/img/homepage/survey.jpg";

const OurServicesContainer = styled.div`
  width: 100%;
  height: 600px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled.div`
  width: 60%;
  padding-bottom: 40px;

  display: flex;
  align-items: center;
  justify-content: space-around;
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
  justify-content: space-around;
`;

const Card = styled.div`
  width: 23%;
  height: 360px;

  border-radius: 2%;
  background-color: black;
  border: 1px solid black;
  transition: 0.5s;

  :hover {
    border: 1px solid white;
  }
`;

const Image = styled.div`
  width: 100%;
  height: 50%;

  border-radius: 3% 3% 0% 0%;
  background-image: url(${props => props.src});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: 1px solid black;
`;

const Description = styled.div`
  width: 100%;
  height: 50%;

  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 20px;
`;

const DescriptionTitle = styled.div`
  padding-bottom: 10px;
  font-family: Avenir;
  font-size: 18px;
  font-weight: bold;
  line-height: 26px;
  color: white;
`;

const DescriptionSubTitle = styled.div`
  font-family: SpoqaHanSans;
  font-size: 14px;
  color: grey !important;
  word-break: keep-all;
`;

class OurServices extends Component {
  render() {
    return (
      <OurServicesContainer>
        <TitleContainer data-aos="fade-up">
          <Line></Line>
          <Title>Our Services</Title>
          <Line></Line>
        </TitleContainer>
        <CardContainer
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          <Card>
            <Image src={road}></Image>
            <Description>
              <DescriptionTitle>
                Computer Vision{" "}
                <span style={{ color: "#f76707", fontSize: "14px" }}>New</span>
              </DescriptionTitle>
              <DescriptionSubTitle>
                사물에 바운딩 박스를 그리고 해당 사물이 무엇인지 라벨링하는
                작업을 수행할 수 있습니다
              </DescriptionSubTitle>
            </Description>
          </Card>
          <Card>
            <Image src={transcribe}></Image>
            <Description>
              <DescriptionTitle>
                Transcribe Text{" "}
                <span style={{ color: "#f76707", fontSize: "14px" }}>New</span>
              </DescriptionTitle>
              <DescriptionSubTitle>
                텍스트 영역에 바운딩 박스를 그리고 의미하는 뜻이 무엇인지
                라벨링하는 작업을 수행할 수 있습니다
              </DescriptionSubTitle>
            </Description>
          </Card>
          <Card>
            <Image src={audio}></Image>
            <Description>
              <DescriptionTitle>
                Natural Language Processing{" "}
                <span style={{ color: "grey", fontSize: "14px" }}>Coming</span>
              </DescriptionTitle>
              <DescriptionSubTitle>
                사람의 음성을 텍스트로 변환하는 작업을 수행할 수
                있습니다(준비중)
              </DescriptionSubTitle>
            </Description>
          </Card>
          <Card>
            <Image src={survey}></Image>
            <Description>
              <DescriptionTitle>
                Survey{" "}
                <span style={{ color: "grey", fontSize: "14px" }}>Coming</span>
              </DescriptionTitle>
              <DescriptionSubTitle>
                간단한 설문조사를 실시하는 작업을 수행할 수 있습니다(준비중)
              </DescriptionSubTitle>
            </Description>
          </Card>
        </CardContainer>
      </OurServicesContainer>
    );
  }
}

export default OurServices;
