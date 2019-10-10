import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

class PrintTotalCrop extends Component {
  state = {
    imgSrc: "" // 모든 크롭을 그려준 이미지가 Base64로 인코딩된 값
  };

  // crop 정보가 바뀔 때마다 컴포넌트가 업데이트 되는 것을 방지
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.crops !== nextProps.crops ||
      this.props.showEdit !== nextProps.showEdit
    );
  }

  // canvas에 crop 영역을 ctx.rect 로 그려줌
  getTotalCroppedImg(canvas) {
    return new Promise(resolve => {
      resolve(canvas.toDataURL());
    });
  }

  // 처음 컴포넌트가 첫 렌더링을 마쳤을 때 실행됨
  async componentDidMount() {
    await this.startWork();
  }

  // 크롭 변경 대상이고 새로 변경할 영역이 들어왔다면 imgSrc 를 바꿔줌
  async componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      await this.startWork();
    }
  }
  // Mount 될 때 && 컴포넌트 업데이트 될 때 중복된 내용 함수화
  async startWork() {
    const canvas = document.createElement("canvas");
    const { crops, image } = this.props;
    console.log(image);
    //console.log("crops: ", crops);

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    console.log("scaleX: ", scaleX);
    console.log("scaleY: ", scaleY);

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      0,
      0,
      image.width * scaleX,
      image.height * scaleY,
      0,
      0,
      image.width,
      image.height
    );

    const promises = await crops.map(function(crop) {
      //console.log("crop: ", crop);
      const x = crop.shape_attributes.x / scaleX;
      const y = crop.shape_attributes.y / scaleY;
      const width = crop.shape_attributes.width / scaleX;
      const height = crop.shape_attributes.height / scaleY;

      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.rect(x, y, width, height);

      if (crop.region_attributes.label) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y - 18, crop.region_attributes.label.length * 10, 18);

        ctx.fillStyle = "black";
        ctx.font = "16px Helvetica";
        ctx.fillText(crop.region_attributes.label, x, y - 2);
      }

      ctx.stroke();
      return new Promise(resolve => resolve(true));
    });

    await Promise.all(promises);

    await this.setState(
      {
        imgSrc: await this.getTotalCroppedImg(canvas)
      } /*,
      () => {
        console.log(this.state.imgSrc);
      }*/
    );
  }

  render() {
    return (
      <Container>
        <img
          src={this.state.imgSrc}
          alt="crop"
          style={{
            display: this.props.showEdit ? "none" : ""
          }}
          onClick={this.props.onClick}
        />
      </Container>
    );
  }
}

export default PrintTotalCrop;
