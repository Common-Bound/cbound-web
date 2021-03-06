import React, { Component } from "react";
import { Redirect, Route, Link } from "react-router-dom";
import CreatorProjectsPage from "./creator/ongoingProjectsPage/CreatorProjectsPage";
import WorkPage from "./creator/workPage/WorkPage";
import AvailableProjects from "./creator/availableProjectsPage/AvailableProjects";
import CreatorHistoryPage from "./creator/historyPage/CreatorHistoryPage";
import styled from "styled-components";
import Header from "../main/Header";
import HistoryPage from "./creator/historyPage/HistoryPage";

const Container = styled.div`
  width: 100%;
`;

const MainContainer = styled.div`
  position: relative;
  top: 7vh;

  width: 100%;

  display: flex;

  @media (max-width: 1024px) {
    flex-direction: column-reverse;
  }
`;

const LeftBanner = styled.div`
  min-width: 240px;
  height: 93vh;

  display: flex;
  flex-direction: column;
  align-items: center;

  background: #353535;
  color: white;

  z-index: 1;

  @media (max-width: 1024px) {
    position: relative;
    width: 100%;
    height: 7vh;
    bottom: 0px;

    z-index: 0;

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

const AllProjectButton = styled(StyledLink)`
  color: ${props =>
    props.pathname === "/mypage/creator"
      ? "white"
      : "rgba(255, 255, 255, 0.3)"};
`;

const MyProjectButton = styled(StyledLink)`
  color: ${props =>
    props.pathname === "/mypage/creator/projects"
      ? "white"
      : "rgba(255, 255, 255, 0.3)"};
`;

// const TaskButton = styled(StyledLink)`
//   color: ${props =>
//     props.pathname.includes("/mypage/creator/task")
//       ? "white"
//       : "rgba(255, 255, 255, 0.3)"};
// `;

const HistoryButton = styled(StyledLink)`
  color: ${props =>
    props.pathname.includes("/mypage/creator/history")
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
  height: 93vh;

  @media (max-width: 1024px) {
    height: 86vh;
  }
`;

class CreatorPage extends Component {
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
    const url = `/api/mypage/creator/point`;
    console.log(this.props);

    const result = await fetch(url, {
      credentials: "include"
    })
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
    console.log(this.props.match.url);
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
            <AllProjectButton
              to={`${this.props.match.url}`}
              pathname={this.props.location.pathname}
            >
              <Icon className="fas fa-search-dollar" />
              <IconTitle>All Projects</IconTitle>
            </AllProjectButton>
            <MyProjectButton
              to={`${this.props.match.url}/projects`}
              pathname={this.props.location.pathname}
            >
              <Icon className="fas fa-list" />
              <IconTitle>My Projects</IconTitle>
            </MyProjectButton>
            {/* <TaskButton
              to={`${this.props.match.url}/task/standalone/none`}
              pathname={this.props.location.pathname}
            >
              <Icon className="fas fa-crop-alt"></Icon>
              <IconTitle>Workspace</IconTitle>
            </TaskButton> */}
            <HistoryButton
              to={`${this.props.match.url}/history`}
              pathname={this.props.location.pathname}
            >
              <Icon className="fas fa-chart-bar"></Icon>
              <IconTitle>History</IconTitle>
            </HistoryButton>
            <StyledLink
              to="/auth/creator/signout"
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
              component={AvailableProjects}
            />
            <Route
              path={`${this.props.match.url}/projects`}
              component={CreatorProjectsPage}
            />
            <Route
              exact
              path={`${this.props.match.url}/history`}
              component={CreatorHistoryPage}
            />
            <Route
              path={`${this.props.match.url}/task/:project_type/:project_id`}
              component={WorkPage}
            />
            <Route
              path={`${this.props.match.url}/history/:data_type/:data_id`}
              component={HistoryPage}
            />
          </Section>
        </MainContainer>
        {this.state.redirect ? <Redirect to="/signin/select" /> : undefined}
      </Container>
    );
  }
}

export default CreatorPage;
