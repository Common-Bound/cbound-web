import React, { Component } from "react";
import styled from "styled-components";
import deleteImg from "../../../../images/close_button.webp";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const CropItemContainer = styled.div`
  min-width: 140px;
  max-width: 140px;
  min-height: 100px;
  max-height: 100px;
  border: 1px solid lightgrey;

  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    min-width: 100px;
    max-width: 100px;
    min-height: 80px;
    max-height: 80px;
  }
  @media (max-width: 500px) {
    min-width: 100px;
    max-width: 100px;
    min-height: 64px;
    max-height: 64px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 70%;
  position: relative;
  text-align: center;

  padding: 0px !important;
  margin: 0px !important;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  src: ${props => props.img};
  max-width: 100%;
  max-height: 100% !important;

  padding: 0px !important;
  margin: 0px !important;
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
  background-color: ${props => (props.value ? "lightblue" : "lightgrey")};
  width: 100%;
  height: 30%;

  padding: 0px !important;
  margin: 0px !important;

  text-align: center;

  border-width: 0px;
  border-style: none;

  @media (max-width: 500px) {
    line-height: 0px;
    font-size: 12px;
  }
`;

const objectRecognitionEndpoint = `/api/mypage/creator/task/normal/object/recognition`;
const textRecognitionEndpoint = `/api/mypage/creator/task/normal/text/recognition`;
class CropItem extends Component {
  state = {
    imgSrc: "", // 지금 Crop 된 영역이 Base64 인코딩된 값
    editing: false,
    label: undefined,
    useAI: true
  };

  // label 값을 넣을 때마다 서버로 재전송 하는 것을 방지

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.useAI !== this.props.useAI ||
      nextProps.crop.shape_attributes.height !==
        this.props.crop.shape_attributes.height ||
      nextProps.crop.shape_attributes.x !==
        this.props.crop.shape_attributes.x ||
      nextProps.crop.shape_attributes.y !==
        this.props.crop.shape_attributes.y ||
      nextProps.crop.shape_attributes.width !==
        this.props.crop.shape_attributes.width
    ) {
      return true;
    }
    if (
      nextProps.crop !== this.props.crop &&
      nextProps.crop.region_attributes.label ===
        this.props.crop.region_attributes.label
    ) {
      return false;
    } else return true;
  }

  // 서버(sendTo)로 body에 bodyData를 넣어서 Fetch 할 때 호출됨
  sendData = async (bodyData, sendTo) => {
    //console.log(sendTo);
    this.setState({
      loading: true
    });

    await fetch(sendTo, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: bodyData
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("Data received");
        console.log(data);
        console.log("label: ", data.data.label[0]);
        if (sendTo === objectRecognitionEndpoint) {
          if (this.props.classes.includes(data.data.label[0])) {
            return this.setState({
              label: data.data.label[0]
            });
          }
          return this.setState({
            label: "etc"
          });
        }
        // 경로별 받은 데이터를 다르게 핸들링함
        else if (sendTo === textRecognitionEndpoint) {
          return this.setState({
            label: data.data.label[0]
          });
        }
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
  handleLabelChange = async e => {
    e.preventDefault();
    e.stopPropagation();
    await this.setState({
      label: e.target.value
    });
    this.changeLabel();
  };

  // 라벨값을 부모 컴포넌트로부터 바꿔준다.
  changeLabel = e => {
    //console.log(this.state.label);
    this.props.changeLabel(
      this.props.crop.shape_attributes.id,
      this.state.label
    );
  };

  // 캔버스에 크롭된 영역을 그려주고 캔버스를 Base64 인코딩함
  getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    // 이미 리사이징 된 거라 다시 리사이즈 할 필요 없음
    // const scaleX = image.naturalWidth / image.width;
    // const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.shape_attributes.width;
    canvas.height = crop.shape_attributes.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.shape_attributes.x,
      crop.shape_attributes.y,
      crop.shape_attributes.width,
      crop.shape_attributes.height,
      0,
      0,
      crop.shape_attributes.width,
      crop.shape_attributes.height
    );
    return new Promise(resolve => {
      resolve(canvas.toDataURL());
    });
  }

  // 부모 컴포넌트 Body.js 의 handleOnCropRemove 를 호출
  handleRemove = e => {
    e.stopPropagation();

    this.props.onRemove(this.props.crop.shape_attributes.id);
  };

  // 부모 컴포넌트 Body.js 의 handleOnCropModify 를 호출
  handleChange = e => {
    e.stopPropagation();

    this.props.onChange(this.props.crop.shape_attributes.id);
  };

  // 처음 컴포넌트가 첫 렌더링을 마쳤을 때 실행됨
  async componentDidMount() {
    //console.log("DIDMONT");

    const { image, crop } = this.props;

    await this.setState({ imgSrc: await this.getCroppedImg(image, crop) });
    //console.log("crop!" + crop.x);

    const bodyData = JSON.stringify({
      crop_image: this.state.imgSrc,
      id: this.props.crop.shape_attributes.id,
      label: this.props.crop.region_attributes.label
    });

    if (this.props.useAI) {
      this.setState({
        editing: true
      });
      await this.sendData(
        bodyData,
        this.props.classes.length > 0
          ? objectRecognitionEndpoint
          : textRecognitionEndpoint
      );
    }
  }

  // 크롭 변경 대상이고 새로 변경할 영역이 들어왔다면 imgSrc 를 바꿔줌
  async componentDidUpdate(prevProps) {
    if (prevProps.crop !== this.props.crop) {
      const { image, crop } = this.props;
      if (
        crop.shape_attributes.x !== prevProps.crop.shape_attributes.x ||
        crop.shape_attributes.y !== prevProps.crop.shape_attributes.y ||
        crop.shape_attributes.width !== prevProps.crop.shape_attributes.width ||
        crop.shape_attributes.height !== prevProps.crop.shape_attributes.height
      ) {
        await this.setState({
          imgSrc: await this.getCroppedImg(image, crop)
        });
      }
      const bodyData = JSON.stringify({
        crop_image: this.state.imgSrc,
        id: this.props.crop.shape_attributes.id
      });
      //console.log(this.props.crop.label, this.state.label);

      if (
        this.props.useAI &&
        (this.props.crop.region_attributes.label !== this.state.label ||
          this.state.label === "")
      ) {
        // console.log("UPDATE");
        this.setState({
          editing: true
        });
        await this.sendData(
          bodyData,
          this.props.classes.length > 0
            ? objectRecognitionEndpoint
            : textRecognitionEndpoint
        );
      }
    }
  }

  render() {
    const classes = this.props.classes;

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
                width: `100%`,
                height: `100%`,
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
        {classes.length > 0 ? (
          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.label}
              onChange={this.handleLabelChange}
            >
              {classes.map((el, index) => (
                <MenuItem key={index} value={el}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <BlueInput
            type="text"
            id={this.props.crop.shape_attributes.id}
            value={this.state.label}
            onChange={this.handleLabelChange}
          />
        )}
      </CropItemContainer>
    );
  }
}

export default CropItem;
