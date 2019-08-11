import React, { Component } from 'react';
import styled from 'styled-components';

const BodyContainer = styled.div`
  width: 100%;
  margin-top: 60px;
`;

const MainSlide = styled.div`
  background-color: grey;
  height: 580px;
  border: 1px solid red;
`;

const SectionContainer = styled.div`
width: 100%;
padding: 50px;
color: white;
text-align: center;
font-size: 1.6rem;
`;

const OurServiceContainer = styled(SectionContainer)`
  background-color: black;
  border: 1px solid orange;
`;

const OurService = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 380px;
  margin: 0 auto;
  background-color: grey;
  border: 1px solid yellow;
`;

const ServiceCard = styled.div`
  width: 360px;
  height: 300px;
  border: 1px solid green;
  color: black;
  background-color: white;
  border-radius: 10px;
`;

const UsecaseContainer = styled(SectionContainer)`
  background-color: black;
  border: 1px solid orange;
`;

const Usecase = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 380px;
  margin: 0 auto;
  background-color: grey;
  border: 1px solid yellow;
`;

const UsecaseCard = styled.div`
  width: 280px;
  height: 300px;
  border: 1px solid green;
  color: black;
  background-color: white;
  border-radius: 10px;
`;

const AchievementContainer = styled(SectionContainer)`
  background-color: lightgrey;
  border: 1px solid orange;
`;

const ContactContainer = styled(SectionContainer)`
  background-color: white;
  border: 1px solid orange;
  color: black;
`;

const FooterContainer = styled(SectionContainer)`
  background-color: black;
  border: 1px solid orange;
  color: white;
`;

class Body extends Component {
  render() {
    return (
      <BodyContainer>
        <MainSlide className="main-slide">
          메인 슬라이드
        </MainSlide>
        <OurServiceContainer>
          Our Service
          <OurService>
            <ServiceCard>우리는 이런 서비스 입니다 1</ServiceCard>
            <ServiceCard>우리는 이런 서비스 입니다 2</ServiceCard>
            <ServiceCard>우리는 이런 서비스 입니다 3</ServiceCard>
          </OurService>
        </OurServiceContainer>
        <UsecaseContainer>
          Use cases
          <Usecase>
            <UsecaseCard>Usecase 1</UsecaseCard>
            <UsecaseCard>Usecase 2</UsecaseCard>
            <UsecaseCard>Usecase 3</UsecaseCard>
            <UsecaseCard>Usecase 4</UsecaseCard>
          </Usecase>
        </UsecaseContainer>
        <AchievementContainer>Achievement</AchievementContainer>
        <ContactContainer>Contact</ContactContainer>
        <FooterContainer>Footer</FooterContainer>
      </BodyContainer>
    );
  }
}

export default Body;