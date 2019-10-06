import React, { Component } from "react";
import styled from "styled-components";

const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 300px;
  margin: 0px 30px 30px 0px;
  text-align: center;

  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    max-width: 240px;
  }

  @media (max-width: 500px) {
    max-width: 100%;
    margin: 0px 0px 30px 0px;
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    flex-direction: row;
    height: 120px;
  }
`;

const SubContainer = styled.div`
  width: 100%;
  padding: 10px;
  overflow: scroll;

  @media (max-width: 500px) {
    width: 60%;
    padding: 4px;
  }
`;

const ButtonContainer = styled.div``;

const Image = styled.div`
  width: 100%;
  height: 200px;

  animation: pulse 1s infinite ease-in-out;
  @keyframes pulse {
    0% {
      background-color: rgba(165, 165, 165, 0.1);
    }
    50% {
      background-color: rgba(165, 165, 165, 0.3);
    }
    100% {
      background-color: rgba(165, 165, 165, 0.1);
    }
  }

  @media (max-width: 1024px) {
    height: 160px;
  }
  @media (max-width: 500px) {
    width: 40%;
    height: 100%;
  }
`;

const Title = styled.div`
  padding: 12px;
  margin: 12px;

  animation: pulse 1s infinite ease-in-out;
  @keyframes pulse {
    0% {
      background-color: rgba(165, 165, 165, 0.1);
    }
    50% {
      background-color: rgba(165, 165, 165, 0.3);
    }
    100% {
      background-color: rgba(165, 165, 165, 0.1);
    }
  }

  @media (max-width: 1024px) {
    padding: 10px;
    margin: 10px;
  }
  @media (max-width: 500px) {
    padding: 8px;
    margin: 8px;
  }
`;

const Description = styled.div`
  padding: 30px;
  margin: 0 12px;

  animation: pulse 1s infinite ease-in-out;
  @keyframes pulse {
    0% {
      background-color: rgba(165, 165, 165, 0.1);
    }
    50% {
      background-color: rgba(165, 165, 165, 0.3);
    }
    100% {
      background-color: rgba(165, 165, 165, 0.1);
    }
  }

  @media (max-width: 1024px) {
    padding: 24px;
    margin: 0 10px;
  }
  @media (max-width: 500px) {
    padding: 20px;
    margin: 0 8px;
  }
`;

const Button = styled.div`
  width: 100%;
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;

  animation: pulse 1s infinite ease-in-out;
  @keyframes pulse {
    0% {
      background-color: rgba(165, 165, 165, 0.1);
    }
    50% {
      background-color: rgba(165, 165, 165, 0.3);
    }
    100% {
      background-color: rgba(165, 165, 165, 0.1);
    }
  }

  :hover {
    opacity: 0.7;
  }
`;

class LoadingPlaceholder extends Component {
  render() {
    return (
      <Card>
        <MainContainer>
          <Image></Image>
          <SubContainer>
            <Title></Title>
            <Description></Description>
          </SubContainer>
        </MainContainer>
        <ButtonContainer>
          <Button></Button>
        </ButtonContainer>
      </Card>
    );
  }
}

export default LoadingPlaceholder;
