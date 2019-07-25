import React, { Component } from "react";

class CropItem extends Component {
  state = {
    imgSrc: ""
  };
  getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise(resolve => {
      resolve(canvas.toDataURL());
    });
  }
  handleRemove = e => {
    e.stopPropagation();
    this.props.onRemove(this.props.crop.id);
  };

  async componentDidMount() {
    const { image, crop } = this.props;

    await this.setState({ imgSrc: await this.getCroppedImg(image, crop) });
  }

  render() {
    return (
      <div>
        <img src={this.state.imgSrc} alt="prop" />
        {this.props.crop.label} {this.props.crop.id}
        <input type="button" value="삭제" onClick={this.handleRemove} />
      </div>
    );
  }
}

export default CropItem;
