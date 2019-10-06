import React, { Component } from "react";
import styled from "styled-components";
import Label from "./Label";

const Container = styled.div`
  border: 1px solid grey;
  border: ${props =>
    props["data-status"] === "unchecked"
      ? "1px solid grey"
      : props["data-status"] === "true"
        ? "2px solid lime"
        : "2px solid red"}
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  z-index: 1;
`;

class CropImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelComponent: undefined,
      status: "unchecked"
    };
  }

  handleMouseEnter = e => {
    this.setState({
      labelComponent: <Label crop={this.props.crop} />
    });
  };

  handleMouseLeave = e => {
    this.setState({
      labelComponent: undefined
    });
  };

  toggleStatus = async () => {
    const status = this.state.status;
    const newStatus =
      status === "unchecked" ? "true" : status === "true" ? "false" : "true";
    return new Promise(resolve => {
      resolve(
        this.setState({
          status: newStatus
        })
      );
    });
  };

  render() {
    const { id, x, y, width, height, label } = this.props.crop.shape_attributes
      ? this.props.crop.shape_attributes
      : this.props.crop;
    const { status, labelComponent } = this.state;

    return (
      <Container
        id={id}
        className="crop_images"
        name={label}
        data-status={status}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        onClick={this.toggleStatus.bind(this)}
        x={x}
        y={y}
        width={width}
        height={height}
      >
        {labelComponent}
      </Container>
    );
  }
}

export default CropImage;
