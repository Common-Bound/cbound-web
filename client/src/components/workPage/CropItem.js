import React, { Component } from "react";

class CropItem extends Component {
  state = {
    imgSrc: "", // 지금 Crop 된 영역이 Base64 인코딩된 값
    editing: false // 이 크롭 영역이 변경 대상인지 flag
  };

  // 캔버스에 크롭된 영역을 그려주고 캔버스를 Base64 인코딩함
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

  // 부모 컴포넌트 Body.js 의 handleOnCropRemove 를 호출
  handleRemove = e => {
    e.stopPropagation();

    this.props.onRemove(this.props.crop.id);
  };

  // 부모 컴포넌트 Body.js 의 handleOnCropModify 를 호출
  handleChange = e => {
    e.stopPropagation();

    this.setState({
      editing: true
    });

    this.props.onChange(this.props.crop.id);
  };

  // 처음 컴포넌트가 첫 렌더링을 마쳤을 때 실행됨
  async componentDidMount() {
    const { image, crop } = this.props;

    await this.setState({ imgSrc: await this.getCroppedImg(image, crop) });
  }

  // 크롭 변경 대상이고 새로 변경할 영역이 들어왔다면 imgSrc 를 바꿔줌
  async componentDidUpdate(prevProps) {
    if (this.state.editing && prevProps !== this.props) {
      const { image, crop } = this.props;

      await this.setState({
        imgSrc: await this.getCroppedImg(image, crop),
        editing: false
      });
    }
  }

  render() {
    return (
      <div>
        <img src={this.state.imgSrc} alt="prop" />
        {this.props.crop.label} {this.props.crop.id}
        <input type="button" value="삭제" onClick={this.handleRemove} />
        <input type="button" value="변경" onClick={this.handleChange} />
      </div>
    );
  }
}

export default CropItem;
