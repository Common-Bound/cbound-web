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
  width: ${props => props.label.length * 14 + 160}px;
  height: 30px;
  z-index: 2;
`;

class Label extends Component {
  render() {
    const { id } = this.props.crop.shape_attributes
      ? this.props.crop.shape_attributes
      : this.props.crop;
    const { label, reliability } = this.props.crop.region_attributes
      ? this.props.crop.region_attributes
      : this.props.crop;

    console.log(label);
    return (
      <Container id={id} label={label}>
        {label} 신뢰도 {((1 - reliability.toFixed(2)) * 100).toFixed(0)}%
      </Container>
    );
  }
}

export default Label;
