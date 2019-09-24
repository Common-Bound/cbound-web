import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Header from "../main/Header";
import CreatorPage from "./CreatorPage";
import RequesterPage from "./RequesterPage";
import notFound from "../notFound";

const Container = styled.div`
  width: 100%;
`;

class MyPage extends Component {
  render() {
    console.log(this.props.match.url);
    return (
      <Container>
        <Header page="mypage" />
        <Switch>
          <Route
            path={`${this.props.match.url}/creator`}
            render={props => <CreatorPage {...props} />}
          />
          <Route
            path={`${this.props.match.url}/requester`}
            render={props => <RequesterPage {...props} />}
          />
          <Route component={notFound} />
        </Switch>
      </Container>
    );
  }
}

export default MyPage;
