import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  top: 64px;
`;

class notFound extends Component {
  render() {
    return <Container>404 NOT FOUND</Container>;
  }
}

export default notFound;
