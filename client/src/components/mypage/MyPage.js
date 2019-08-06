import React, { Component } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import ProjectsPage from "../projectsPage/ProjectsPage";
import WorkPage from "../workPage/WorkPage";
import AvailableProjects from "./AvailableProjects";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  border: 1px solid red;
`;

const LeftBanner = styled.div`
  width: 60px;
  display: flex;
  flex-direction: column;
  border: 1px solid white;
  background-color: lightblue;
  align-content: center;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 60px;
  margin-top: 20px;
`;

class MyPage extends Component {
  render() {
    return (
      <Container>
        <LeftBanner>
          <Icon>
            <Link to={`${this.props.match.url}`}>
              <i className="fas fa-search-dollar" />
            </Link>
          </Icon>
          <Icon>
            <Link to={`${this.props.match.url}/projects`}>
              <i className="fas fa-list" />
            </Link>
          </Icon>
          <Icon>
            <Link to="/auth/signout">
              <i className="fas fa-sign-in-alt" />
            </Link>
          </Icon>
        </LeftBanner>
        <Route
          exact
          path={`${this.props.match.url}`}
          component={AvailableProjects}
        />
        <Route
          path={`${this.props.match.url}/projects`}
          component={ProjectsPage}
        />
        <Route
          path={`${this.props.match.url}/task/:project_id`}
          component={WorkPage}
        />
      </Container>
    );
  }
}

export default MyPage;
