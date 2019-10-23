import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
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
        <Switch>
          <Route
            path={`${this.props.match.url}/creator`}
            render={props => <CreatorPage {...props} page="mypage" />}
          />
          <Route
            path={`${this.props.match.url}/requester`}
            render={props => <RequesterPage {...props} page="mypage" />}
          />
          <Route component={notFound} />
        </Switch>
      </Container>
    );
  }
}

export default MyPage;
