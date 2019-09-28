import React, { Component } from "react";

class Inspect1By1 extends Component {
  constructor(props) {
    super(props);

    this.clickO = this.clickO.bind(this);
    this.clickX = this.clickX.bind(this);
    this.handleEndInspect = this.handleEndInspect.bind(this);
  }

  handleEndInspect() {
    this.props.handleEndInspect();
  }

  clickO() {
    this.props.clickO();
  }

  clickX() {
    this.props.clickX();
  }

  render() {
    if (this.props.ammountCropImage === this.props.id) {
      return <div onClick={this.handleEndInspect}>검수 끝내기</div>;
    }
    return (
      <div>
        <div onClick={this.clickO}>O</div>
        <div onClick={this.clickX}>X</div>
        ammount Crop Image {this.props.ammountCropImage} / {this.props.id}
      </div>
    );
  }
}

export default Inspect1By1;
