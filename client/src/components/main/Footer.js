import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const FooterContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const TitleContainer = styled.div`
  width: 100%;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Link)`
  background-image: url(${props => props.img});
  width: 260px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;

  @media (max-width: 500px) {
    margin: 0;
    width: 200px;
    height: 22px;
  }
`;

const StyledLinks = styled.a`
  color: lightgrey;
  font-family: Avenir;
  text-decoration: none;

  :hover {
    color: lightgrey;
  }
`;

const Navigation = styled.div`
  width: 30%;

  display: flex;
  justify-content: space-around;
`;

const IconContainer = styled.div`
  width: 30%;

  display: flex;
  justify-content: space-around;
`;

class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        <TitleContainer>
          <Title
            to="/"
            img={
              "https://task-data-bucket-copied.s3.ap-northeast-2.amazonaws.com/COMMONBOUND.webp"
            }
          />
        </TitleContainer>
        <Navigation>
          <StyledLinks href="#about">About Us</StyledLinks>
          <StyledLinks href="#services">Our Services</StyledLinks>
          <StyledLinks href="#">Contact</StyledLinks>
        </Navigation>
        <IconContainer>
          <StyledLinks
            style={{ color: "grey", textDecoration: "none" }}
            href="https://play.google.com/store/apps/details?id=com.wCommonBound_9688117"
          >
            <i className="fab fa-google-play"></i>
          </StyledLinks>
        </IconContainer>
      </FooterContainer>
    );
  }
}

export default Footer;
