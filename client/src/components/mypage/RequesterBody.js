import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  top: 64px;
`;

class RequesterBody extends Component {
  render() {
    return <Container>hello requester!</Container>;
  }
}

export default RequesterBody;
