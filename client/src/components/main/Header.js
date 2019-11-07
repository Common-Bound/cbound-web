import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

//import logo from "../../images/logo_2.webp";
//import name from "../../images/COMMONBOUND.webp";

const HeaderContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #000000;
  width: 100%;
  height: 7vh;

  z-index: 1;

  transition: 0.5s;

  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const Logo = styled(Link)`
  margin-left: 10%;
  background-image: url(${props => props.img});
  width: 48px;
  height: 48px;
  background-size: cover;

  @media (max-width: 500px) {
    display: none;
  }
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

const LoginButton = styled(Link)`
  margin-right: 7%;
  width: 100px;
  height: 32px;
  border-radius: 20px;
  border: 1px solid white;

  font-size: 18px;
  text-align: center;
  color: white;

  transition: 0.5s;

  :hover {
    background-color: white;
    color: black;
  }

  @media (max-width: 500px) {
    display: none;
  }
`;

const ProfileButton = styled.div`
  position: relative;
  margin-right: 10%;

  font-size: 18px;
  text-align: center;

  transition: 0.5s;

  text-decoration: none !important;

  @media (max-width: 500px) {
    position: absolute;
    top: 1vh;
    right: 1vh;

    margin-right: 0;
  }
`;

const Identicon = styled.svg`
  width: 48px;
  height: 48px;

  background-color: white;

  @media (max-width: 500px) {
    display: none;
  }
`;

const MobileIdenticon = styled.svg`
  width: 96px;
  height: 96px;

  background-color: white;
`;

const DropDown = styled.div`
  position: absolute;
  top: 48px;
  right: 0;
  width: 200px;

  display: ${props => (props.show ? "flex" : "none")};
  flex-direction: column;

  background-color: #f1f1f1;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;

  transition: 0.5s;

  @media (max-width: 500px) {
    display: none;
  }
`;

const DropDownContent = styled.div`
  width: 100%;
  color: black;
  padding: 12px 16px;
  text-decoration: none;

  :hover {
    background-color: #ddd;
  }
`;

const MobileProfileButtonContainer = styled.div`
  width: 36px;
  height: 4vh;
  display: none;

  @media (max-width: 500px) {
    display: block;
  }
`;

const MobileProfileButton = styled.div`
  width: 28px;
  height: 2px;
  background-color: white;
  margin: 1vh 0;
`;

const MobileMenuBackground = styled.div`
  position: absolute;
  display: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 2 !important;

  background-color: rgba(0, 0, 0, 0.7);
  @media (max-width: 500px) {
    display: ${props => (props.show ? "block" : "none")};
  }
`;

const MobileMenuContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  display: flex;
  flex-direction: column;

  width: 70%;
  height: 100vh;

  opacity: 1;
  z-index: 3 !important;
`;

const MobileInfoContainer = styled.div`
  width: 100%;
  height: 30vh;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  background-color: black;
  color: white;
`;

const MobileButtonContainer = styled.div`
  width: 100%;
  height: 70vh;

  background-color: white;
  color: black;
`;

const MobileButton = styled.div`
  padding: 20px;

  text-decoration: none;

  :hover {
    background-color: #ddd;
  }
`;

const XButton = styled.div`
  position: absolute;
  top: 1vh;
  right: 1vh;
  text-align: center;

  color: white;

  width: 36px;
  height: 36px;
`;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropDown: false
    };
  }

  handleClick = () => {
    this.setState({
      showDropDown: !this.state.showDropDown
    });
  };

  render() {
    const { user_id, email, point } = this.props;
    const { showDropDown } = this.state;
    return (
      <HeaderContainer>
        <Logo
          to="/"
          img={
            "https://task-data-bucket.s3.ap-northeast-2.amazonaws.com/logo_2.webp"
          }
        />
        <Title
          to="/"
          img={
            "https://task-data-bucket.s3.ap-northeast-2.amazonaws.com/COMMONBOUND.webp"
          }
        />
        {this.props.page === "main" ? (
          <LoginButton to="/signin/select">Sign In</LoginButton>
        ) : (
          <ProfileButton>
            <MobileProfileButtonContainer onClick={this.handleClick.bind(this)}>
              <MobileProfileButton></MobileProfileButton>
              <MobileProfileButton></MobileProfileButton>
              <MobileProfileButton></MobileProfileButton>
            </MobileProfileButtonContainer>
            <Identicon
              onClick={this.handleClick.bind(this)}
              data-jdenticon-value={user_id}
            ></Identicon>
            <DropDown show={showDropDown}>
              <DropDownContent>프로필</DropDownContent>
              <DropDownContent>{point} P</DropDownContent>
              <DropDownContent>개인정보 변경</DropDownContent>
            </DropDown>
          </ProfileButton>
        )}
        <MobileMenuBackground show={showDropDown}>
          <MobileMenuContainer className="animated slideInRight fast">
            <XButton onClick={this.handleClick.bind(this)}>&#10005;</XButton>
            <MobileInfoContainer>
              <MobileIdenticon data-jdenticon-value={user_id}></MobileIdenticon>
              {email}
            </MobileInfoContainer>
            <MobileButtonContainer>
              <MobileButton>프로필</MobileButton>
              <MobileButton>{point} P</MobileButton>
              <MobileButton>개인정보 변경</MobileButton>
            </MobileButtonContainer>
          </MobileMenuContainer>
        </MobileMenuBackground>
      </HeaderContainer>
    );
  }
}

export default Header;
