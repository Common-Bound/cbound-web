import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Header from "../main/Header";
import CreatorBody from "./CreatorBody";
import RequesterBody from "./RequesterBody";
import notFound from "../notFound";

const Container = styled.div`
  width: 100%;
`;

class MyPage extends Component {
  render() {
    console.log(this.props.match.url);
    return (
      <Container>
        <PieChart></PieChart>
        <Header page="mypage" />
        <Switch>
          <Route
            path={`${this.props.match.url}/creator`}
            render={props => <CreatorBody {...props} />}
          />
          <Route
            path={`${this.props.match.url}/requester`}
            render={props => <RequesterBody {...props} />}
          />
          <Route component={notFound} />
        </Switch>
      </Container>
    );
  }
}

export default MyPage;
