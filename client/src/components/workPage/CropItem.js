import React, { Component } from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  max-width: 200px;
  position: relative;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

class CropItem extends Component {
  state = {
    imgSrc: "", // 지금 Crop 된 영역이 Base64 인코딩된 값
    editing: false,
    label: ""
  };

  // label 값을 넣을 때마다 서버로 재전송 하는 것을 방지

  /*shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.crop !== this.props.crop &&
      nextProps.crop.label === this.props.crop.label
    )
      return false;
    else return true;
  }*/

  // 서버(sendTo)로 body에 bodyData를 넣어서 Fetch 할 때 호출됨
  sendData = async (bodyData, sendTo) => {
    this.setState({
      loading: true
    });

    await fetch(sendTo, {
      method: "post",
      body: bodyData
    })
      .then(function(res) {
        return res.json();
      })
      .then(async data => {
        console.log("Data received");
        console.log(data);

        // 경로별 받은 데이터를 다르게 핸들링함

        this.setState({
          label: data.label
        });

        return new Promise(resolve => {
          resolve(true);
        });
      })
      .catch(function(ex) {
        console.log("error occured");
        console.log(ex);
      });

    this.changeLabel();
    this.setState({
      editing: false
    });
  };

  // 라벨값을 부모 컴포넌트로부터 바꿔준다.
  changeLabel() {
    this.props.changeLabel(this.props.crop.id, this.state.label);
  }

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

    this.props.onChange(this.props.crop.id);
  };

  // 처음 컴포넌트가 첫 렌더링을 마쳤을 때 실행됨
  async componentDidMount() {
    console.log("DIDMONT");
    const { image, crop } = this.props;

    await this.setState({ imgSrc: await this.getCroppedImg(image, crop) });

    const bodyData = JSON.stringify({ crop_image: this.state.imgSrc });
    if (this.props.useAI) {
      this.setState({
        editing: true
      });

      await this.sendData(
        bodyData,
        "https://cors-anywhere.herokuapp.com/http://ec2-54-180-87-68.ap-northeast-2.compute.amazonaws.com:8080/ocr/recognition/"
      );
    }
  }

  // 크롭 변경 대상이고 새로 변경할 영역이 들어왔다면 imgSrc 를 바꿔줌
  async componentDidUpdate(prevProps) {
    if (prevProps.crop !== this.props.crop) {
      const { image, crop } = this.props;

      console.log(crop);
      await this.setState({
        imgSrc: await this.getCroppedImg(image, crop)
      });
      const bodyData = JSON.stringify({ crop_image: this.state.imgSrc });
      if (this.props.useAI && this.props.crop.label !== this.state.label) {
        console.log("UPDATE");
        this.setState({
          editing: true
        });
        await this.sendData(
          bodyData,
          "https://cors-anywhere.herokuapp.com/http://ec2-54-180-87-68.ap-northeast-2.compute.amazonaws.com:8080/ocr/recognition/"
        );
      }
    }
  }

  render() {
    return (
      <ImageContainer>
        <img src={this.state.imgSrc} alt="prop" onClick={this.handleChange} />
        <div>
          <input type="button" value="삭제" onClick={this.handleRemove} />
        </div>
        {this.state.editing ? (
          <LoadingContainer
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: `${this.props.crop.width}px`,
              height: `${this.props.crop.height}px`,
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.7)"
            }}
          >
            <div className="lds-grid">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
            <p style={{ color: "white" }}>이미지 분석 중...</p>
          </LoadingContainer>
        ) : null}
      </ImageContainer>
    );
  }
}

export default CropItem;
