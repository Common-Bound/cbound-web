import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: black;
  color: white;
  font-size: 20px;
  font-family: Helvetica;
  position: absolute;
  top: -30px;
  left: 0px;
  width: ${props => props.label.length * 14}px;
  height: 30px;
  z-index: 2;
`;

class Label extends Component {
  render() {
    const { id, label } = this.props.crop;
    console.log(label);
    return (
      <Container id={id} label={label}>
        {label}
      </Container>
    );
  }
}

export default Label;
