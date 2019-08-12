import React, { Component } from "react";
import styled from "styled-components";

import background from "../../images/BackGround.png";

const BodyContainer = styled.div`
  position: relative;
  top: 100px;
  display: flex;

  align-items: center;

  background-image: url(${background});
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;

  background-attachment: fixed;
  background-size: auto 100%;
  background-position: center;
`;

class Body extends Component {
  render() {
    return <BodyContainer />;
  }
}

export default Body;
