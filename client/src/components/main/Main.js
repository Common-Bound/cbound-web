import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import Body from "./Body";

const MainContainer = styled.div`
  width: 100%;
`;

class Main extends Component {
  render() {
    return (
      <MainContainer>
        <Header page="main" />
        <Body />
      </MainContainer>
    );
  }
}

export default Main;
