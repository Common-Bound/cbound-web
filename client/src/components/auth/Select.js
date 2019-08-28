import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import background from "../../images/BackGround.png";
import Header from "../main/Header";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: black;
`;

const SelectContainer = styled.div`
  position: relative;
  top: 64px;
  width: 100%;
  height: 600px;
  text-align: center;
  background-image: url(${background});

  background-size: 100% 100%;
`;

const SelectMain = styled.div`
  display: flex;
  jusify-content: center;

  padding-top: 10%;
`;

const SelectMenu = styled.div`
  display: flex;
  justify-content: space-around;
  width: 80%;
  margin: 0 auto;
`;

const RightCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LeftCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const SubTitle = styled.div`
  font-size: 80px;
  line-height: 80px;
  font-weight: bold;
  font-family: SpoqaHanSans;
  color: ${props => (props.color ? props.color : "white")};
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
`;

const LeftDescription = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
`;

const RightDescription = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  text-align: left;
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
            <SelectMenu>
              <LeftCard>
                <SubTitle>Data</SubTitle>
                <SubTitle color={"#389eff"}>Requester</SubTitle>
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
                <SubTitle>Data</SubTitle>
                <SubTitle color={"#00d8ff"}>Generator</SubTitle>
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
            </SelectMenu>
          </SelectMain>
        </SelectContainer>
      </Container>
    );
  }
}

export default Select;
