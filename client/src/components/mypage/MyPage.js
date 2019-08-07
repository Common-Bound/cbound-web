import React, { Component } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import ProjectsPage from "../projectsPage/ProjectsPage";
import WorkPage from "../workPage/WorkPage";
import AvailableProjects from "./AvailableProjects";
import styled from "styled-components";

const Container = styled.div`
  padding: 0;

  margin: 0;

  /*background-image: url(3jpg);*/

  width: 100%;

  height: 100%;

  overflow: hidden;

  background-position: 0 0;

  background-repeat: no-repeat;

  background-attachment: fixed;

  background-size: cover;

  position: relative;

  overflow-y: auto;
`;

const LeftBanner = styled.div`
  width: 70px;

  height: 3000px;

  position: fixed;

  background: #353535;

  color: white;

  overflow: hidden;

  float: left;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 60px;
  margin-top: 20px;
`;

const Section = styled.div`
  margin-top: 0px;

  margin-left: 70px;

  margin-right: 0px;

  margin-bottom: 100px;

  background: white;
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
        <Section>
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
            path={`${this.props.match.url}/task/:project_type/:project_id`}
            component={WorkPage}
          />
        </Section>
      </Container>
    );
  }
}

export default MyPage;
