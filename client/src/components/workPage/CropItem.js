import React, { Component } from "react";
import endpoint from "../../RecognitionEndpoint";
import styled from "styled-components";
import deleteImg from "../../images/close_button.png";

const CropItemContainer = styled.div`
  max-width: 140px;
`;

const ImageContainer = styled.div`
  width: 140px;
  height: 100px;
  position: relative;
  text-align: center;
  border: 1px solid lightgrey;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  src: ${props => props.img};
  max-width: 140px;
  max-height: 100px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeleteButton = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  width: 20px;
  height: 20px;

  background-image: url(${props => props.img});
  backgrondd-size: cover;
  background-repeat: no-repeat;
  z-index: 1;
`;

const BlueInput = styled.input`
  background-color: lightblue;
  width: 140px;
  text-align: center;
`;

class CropItem extends Component {
  state = {
    imgSrc: "", // 지금 Crop 된 영역이 Base64 인코딩된 값
    editing: false,
    label: "",
    useAI: true
  };

  // label 값을 넣을 때마다 서버로 재전송 하는 것을 방지

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.useAI !== this.props.crop.useAI ||
      nextProps.crop.height !== this.props.crop.height ||
      nextProps.crop.x !== this.props.crop.x ||
      nextProps.crop.y !== this.props.crop.y ||
      nextProps.crop.width !== this.props.crop.width
    ) {
      return true;
    }
    if (
      nextProps.crop !== this.props.crop &&
      nextProps.crop.label === this.props.crop.label
    ) {
      console.log("a");

      return false;
    } else return true;
  }

  // 서버(sendTo)로 body에 bodyData를 넣어서 Fetch 할 때 호출됨
  sendData = async (bodyData, sendTo) => {
    console.log(sendTo);
    this.setState({
      loading: true
    });

    await fetch(sendTo, {
      method: "post",
      body: bodyData
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("Data received");
        console.log(data);

        // 경로별 받은 데이터를 다르게 핸들링함
        this.setState({
          label: data.label
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

  // 라벨값을 바꿈
  handleLabelChange = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      label: e.target.value
    });
  };

  // 라벨값을 부모 컴포넌트로부터 바꿔준다.
  changeLabel = e => {
    //console.log(this.state.label);
    this.props.changeLabel(this.props.crop.id, this.state.label);
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

    this.props.onChange(this.props.crop.id);
  };

  // 처음 컴포넌트가 첫 렌더링을 마쳤을 때 실행됨
  async componentDidMount() {
    //console.log("DIDMONT");

    const { image, crop } = this.props;

    await this.setState({ imgSrc: await this.getCroppedImg(image, crop) });
    //console.log("crop!" + crop.x);

    const bodyData = JSON.stringify({
      crop_image: this.state.imgSrc,
      id: this.props.crop.id
    });
    console.log(this.props.useAI);
    if (this.props.useAI) {
      this.setState({
        editing: true
      });
      await this.sendData(bodyData, `${endpoint.url}/ocr/recognition/`);
    }
  }

  // 크롭 변경 대상이고 새로 변경할 영역이 들어왔다면 imgSrc 를 바꿔줌
  async componentDidUpdate(prevProps) {
    if (prevProps.crop !== this.props.crop) {
      const { image, crop } = this.props;

      if (
        crop.x !== prevProps.crop.x ||
        crop.y !== prevProps.crop.y ||
        crop.width !== prevProps.crop.width ||
        crop.height !== prevProps.crop.height
      ) {
        await this.setState({
          imgSrc: await this.getCroppedImg(image, crop)
        });
      }
      const bodyData = JSON.stringify({
        crop_image: this.state.imgSrc,
        id: this.props.crop.id
      });
      //console.log(this.props.crop.label, this.state.label);

      if (this.props.useAI && this.props.crop.label !== this.state.label) {
        // console.log("UPDATE");
        this.setState({
          editing: true
        });
        await this.sendData(bodyData, `${endpoint.url}/ocr/recognition/`);
      }
    }
  }

  handleKeyPress = e => {
    if (e.charCode === 13) {
      e.preventDefault();

      this.changeLabel();
    }
  };

  render() {
    return (
      <CropItemContainer>
        <ImageContainer onClick={this.handleChange}>
          <Image src={this.state.imgSrc} />

          {/* 로딩바 */}
          {this.state.editing ? (
            <LoadingContainer
              style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                width: `140px`,
                height: `100px`,
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
            </LoadingContainer>
          ) : null}
          <DeleteButton
            img={deleteImg}
            value="삭제"
            onClick={this.handleRemove}
          />
        </ImageContainer>
        <BlueInput
          type="text"
          value={this.state.label}
          onChange={this.handleLabelChange}
          onKeyPress={this.handleKeyPress}
        />
      </CropItemContainer>
    );
  }
}

export default CropItem;
