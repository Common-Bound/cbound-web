import React from "react";
import { Redirect, Route, Link } from "react-router-dom";
import RequesterProjectsPage from "./requester/RequesterProjectsPage";
import CreateProjectPage from "./requester/CreateProjectPage";
import InsightPage from "./requester/InsightPage";

import Header from "../main/Header";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const MainContainer = styled.div`
  position: relative;
  top: 8vh;

  width: 100%;

  display: flex;

  @media (max-width: 1024px) {
    flex-direction: column-reverse;
  }
`;

const LeftBanner = styled.div`
  min-width: 240px;
  height: 92vh;

  display: flex;
  flex-direction: column;
  align-items: center;

  background: #353535;
  color: white;

  z-index: 1;

  @media (max-width: 1024px) {
    width: 100%;
    height: 8vh;
    bottom: 0px;

    flex-direction: row;
    justify-content: space-between;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;

  width: 80%;
  margin: 0 auto;
  height: 40px;
  margin-top: 20px;

  text-decoration: none !important;

  color: rgba(255, 255, 255, 0.3);

  :hover {
    color: white;
  }

  @media (max-width: 1024px) {
    margin-top: 0;
    text-align: center;
  }
`;

const MyProjectButton = styled(StyledLink)`
  color: ${props =>
    props.pathname === "/mypage/requester"
      ? "white"
      : "rgba(255, 255, 255, 0.3)"};
`;

const Icon = styled.i`
  transform: scale(1.4, 1.4);
`;

const IconTitle = styled.div`
  width: 100px;
  margin-left: 14px;
  font-family: Avenir;

  @media (max-width: 810px) {
    display: none;
  }
`;

const Section = styled.div`
  width: 100%;
  height: 92vh;

  @media (max-width: 1024px) {
    height: 84vh;
  }
`;

class RequesterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      email: "",
      point: "",
      redirect: false
    };
  }

  componentDidMount = async () => {
    if (this.props.page === "mypage") {
      await this.fetchData();
    }
  };

  fetchData = async () => {
    const url = `/api/mypage/requester/point`;
    console.log(this.props);

    const result = await fetch(url)
      .then(res => res.json())
      .then(async data => {
        console.log("data: ", data);
        if (data.result === false) {
          alert("로그인 해주세요");
          await this.setState({
            redirect: true
          });
        }
        return new Promise(resolve => resolve(data.result));
      })
      .catch(err => {
        console.log(err);
      });

    await this.setState({
      user_id: result.id,
      email: result.email,
      point: result.point
    });
  };

  render() {
    const { user_id, email, point } = this.state;
    return (
      <Container>
        <Header
          location={this.props.location}
          user_id={user_id}
          email={email}
          point={point}
        />
        <MainContainer>
          <LeftBanner>
            <MyProjectButton
              to={`${this.props.match.url}`}
              pathname={this.props.location.pathname}
            >
              <Icon className="fas fa-list" />
              <IconTitle>My Projects</IconTitle>
            </MyProjectButton>
            <StyledLink
              to="/auth/requester/signout"
              pathname={this.props.location.pathname}
            >
              <Icon className="fas fa-sign-in-alt" />
              <IconTitle>Sign Out</IconTitle>
            </StyledLink>
          </LeftBanner>
          <Section>
            <Route
              exact
              path={`${this.props.match.url}`}
              component={RequesterProjectsPage}
            />
            <Route
              path={`${this.props.match.url}/create`}
              component={CreateProjectPage}
            />
            <Route
              path={`${this.props.match.url}/insight/:project_id`}
              component={InsightPage}
            />
          </Section>
        </MainContainer>
        {this.state.redirect ? <Redirect to="/signin/select" /> : undefined}
      </Container>
    );
  }
}

export default RequesterPage;
