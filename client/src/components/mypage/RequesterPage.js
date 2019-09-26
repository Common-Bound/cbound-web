import React from "react";

import { Route, Link } from "react-router-dom";
// node.js library that concatenates classes (strings)

import RequesterProjectsPage from "./RequesterProjectsPage";
import CreateProjectPage from "./CreateProjectPage";
import InsightPage from "../workPage/InsightPage";

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

// const AllProjectButton = styled(StyledLink)`
//   color: ${props =>
//     props.pathname === "/mypage/creator"
//       ? "white"
//       : "rgba(255, 255, 255, 0.3)"};
// `;

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
`;

const Section = styled.div`
  position: relative;
  padding-left: 200px;
  padding-top: 64px;
`;

class RequesterPage extends React.Component {
  render() {
    return (
      <>
        <LeftBanner>
          <MyProjectButton
            to={`${this.props.match.url}`}
            pathname={this.props.location.pathname}
          >
            <Icon className="fas fa-list" />
            <IconTitle>My Projects</IconTitle>
          </MyProjectButton>
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
      </>
    );
  }
}

export default RequesterPage;
