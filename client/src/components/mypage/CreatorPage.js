import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import CreatorProjectsPage from "./creator/ongoingProjectsPage/CreatorProjectsPage";
import WorkPage from "./creator/workPage/WorkPage";
import AvailableProjects from "./creator/availableProjectsPage/AvailableProjects";
import styled from "styled-components";

const LeftBanner = styled.div`
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 64px;

  display: flex;
  flex-flow: column;
  align-items: center;

  background: #353535;
  color: white;
  z-index: 1;
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

const TaskButton = styled(StyledLink)`
  color: ${props =>
    props.pathname.includes("/mypage/creator/task")
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
`;

const Section = styled.div`
  position: relative;
  padding-left: 200px;
  padding-top: 64px;
`;

class CreatorPage extends Component {
  render() {
    console.log(this.props.match.url);
    return (
      <div>
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
          <TaskButton
            to={`${this.props.match.url}/task/standalone/none`}
            pathname={this.props.location.pathname}
          >
            <Icon className="fas fa-crop-alt"></Icon>
            <IconTitle>Workspace</IconTitle>
          </TaskButton>
          <StyledLink
            to="/auth/signout"
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
            path={`${this.props.match.url}/task/:project_type/:project_id`}
            component={WorkPage}
          />
        </Section>
      </div>
    );
  }
}

export default CreatorPage;