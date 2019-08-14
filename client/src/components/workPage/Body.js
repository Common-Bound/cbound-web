import React, { Component } from "react";
import ReactCrop from "react-image-crop"; // Cropper Import
import CropInfoList from "./CropInfoList.js"; // 크롭 리스트를 출력함
import PrintTotalCrop from "./PrintTotalCrop"; // 크롭 리스트를 한 캔버스에 그려줌
import Dropzone from "react-dropzone";
import styled from "styled-components";
import moment from "moment";

import "react-image-crop/dist/ReactCrop.css";
import "./Body.css";

const BodyContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  height: 95vh;
  border: 1px solid blue;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: cneter;
`;

const EntireTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border: 1px solid black;
`;

const LeftTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
`;

const LeftTitleDate = styled.div`
  font-family: Avenir;
  text-align: left;
  color: #8d8d8d;
  font-size: 16px;
`;

const LeftTitle = styled.div`
  font-family: SpoqaHanSans;
  text-align: left;
  font-weight: bold;
  font-size: 32px;
`;

const RightTitleContainer = styled.div`
  font-family: Avenir;
  display: flex;
  flex-direction: column;
  border: 1px solid black;

  padding: 10px;
`;

const RightTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  text-align: right;
`;

const RightTitleDate = styled.div`
  font-size: 16px;
  text-align: right;
  color: #8d8d8d;
`;

const ImageContainer = styled.div`
  max-width: 720px;
  position: relative;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.7);
`;

class Body extends Component {
  // Body Component 생성
  constructor(props) {
    super(props);

    this.state = {
      __nextkey: 0, // Crop.id 생성을 위한 임시 변수
      orig_image: "", // Base64로 인코딩된 값을 가져 화면에 출력할 때 사용됨
      orig_image_file: null, // 현재 작업하고 있는 이미지를 FormData로 패킹해 서버로 보낼 때 사용됨
      crop_image: [], // 지금까지 크롭한 영역들의 정보 리스트 (x, y, width, height)
      crop: {}, // ReactCrop 에 사용되는 값으로 크롭 영역이 변경될 때 함께 변경됨. (현재 크롭 영역에 대한 정보를 가지고 있음)
      label: "", // 작업한 영역에 대해 레이블링 할 때 사용되는 입력창의 변경 사항에 대해 저장함
      imageRef: null, // 크롭 컨테이너에 이미지가 로드 되었을 때 이미지 값을 저장함
      changeMode: false, // 현재 크롭된 이미지를 추가해야 할지 수정해야 할지 결정하는 Flag
      preId: "", // ChangeMode 가 true 라면 변경할 이미지의 id
      showEdit: true, // 한 개의 크롭 영역을 변경할 수 있는 이미지를 줄지 크롭된 영역 리스트를 이미지에 그려줄 지
      useAI: false, // AI를 사용할지 말지 스위치 할 때 변경할 값
      loading: false
    };

    this.handleSendAll = this.handleSendAll.bind(this);
    this.handleOnCropModify = this.handleOnCropModify.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.handleCropMouseUp = this.handleCropMouseUp.bind(this);
  }

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
        if (sendTo === "/mypage/task/normal") {
          var counter = 0; // Crop.id 생성을 위한 임시 변수

          this.setState({
            crop_image: data.data.meta["crop_image"].map(crop => {
              // 서버에서 인식한 크롭 영역들을 미리 crop_image에 넣어줌
              const scaleX =
                this.state.imageRef.naturalWidth / this.state.imageRef.width;
              const scaleY =
                this.state.imageRef.naturalHeight / this.state.imageRef.height;
              //console.log("scaleX: " + scaleX);
              //console.log("scaleY: " + scaleY);

              return {
                id: counter++,
                x: crop.x / scaleX,
                y: crop.y / scaleY,
                width: crop.width / scaleX,
                height: crop.height / scaleY,
                label: crop.label
              };
            }),
            __nextkey: counter
          });
        } else if (sendTo.startsWith("https://")) {
          this.setState({
            label: data.label
          });
          this.handleOnCropComplete();
        }

        return new Promise(resolve => {
          resolve(true);
        });
      })
      .catch(function(ex) {
        console.log("error occured");
        console.log(ex);
      });

    this.setState({
      loading: false
    });
  };

  // 업로드된 이미지를 출력하기 위해 Base64로 바꿀 때 호출됨
  async getBase64(file) {
    if (file) {
      // File 을 Base64로 바꿔줌
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
  }

  // 이미지가 업로드 되었을 때 호출됨
  onFileSelected = async files => {
    // 이미지가 업로드 되었을 때 기존에 크롭된 영역을 초기화함
    //console.log(files[0]);
    this.setState({
      orig_image_file: files[0],
      __nextkey: 0,
      crop_image: [],
      crop: {},
      label: "",
      imageRef: "",
      changeMode: false,
      preId: "",
      orig_image: null
    });

    await this.getBase64(files[0]).then(
      data =>
        new Promise(resolve => {
          resolve(
            this.setState({
              orig_image: data
            })
          );
        })
    );
    // AI를 사용할 경우에만 이미지 데이터를 서버로 전송해줌
    if (this.state.useAI) {
      const bodyData = new FormData();
      bodyData.append("orig_image", this.state.orig_image);

      this.sendData(bodyData, "/mypage/task/normal"); // 서버로 전송( /mypage/task)
    }
  };

  // 입력창의 value가 바뀔 때 변경사항 적용
  handleChange = e => {
    if (e.target.name === "useAI") {
      this.setState({
        [e.target.name]: !this.state.useAI
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  // 크롭 컨테이너에 이미지가 로드 되었을 때 이미지 값을 저장함
  handleImageLoaded = async image => {
    //console.log(image);
    //console.log(image.width);
    await this.setState({ imageRef: image });
  };

  // 크롭 영역이 변경되었을 때 변경사항 적용
  handleOnCropChange = crop => {
    this.setState({ crop: crop });
  };

  // 레이블링과 크롭을 끝냈을 때 호출
  handleOnCropComplete = async e => {
    //console.log("Complete");
    const cropData = this.state.crop;
    const image = new Image();

    image.src = this.state.orig_image;

    // state의 changeMode 를 보고 크롭된 영역을 추가/수정함
    if (this.state.orig_image && this.state.showEdit && this.state.crop) {
      //console.log("Complete");
      if (this.state.changeMode) {
        // 수정
        this.setState({
          crop_image: await this.state.crop_image.map(crop => {
            if (crop.id === this.state.preId) {
              return {
                id: this.state.preId,
                x: cropData.x,
                y: cropData.y,
                width: cropData.width,
                height: cropData.height,
                label: this.state.label
              };
            } else return crop;
          }),
          label: "",
          crop: {},
          changeMode: false
        });
      } else {
        // 추가
        this.setState({
          crop_image: this.state.crop_image.concat({
            id: this.state.__nextkey++,
            x: cropData.x,
            y: cropData.y,
            width: cropData.width,
            height: cropData.height,
            label: this.state.label
          }),
          label: "",
          crop: {}
        });
        //console.log(this.state.crop_image[0].imgSrc);
      }
    }
  };

  // 작업한 내용 전부를 서버로 전송함
  handleSendAll() {
    const bodyData = new FormData();

    bodyData.append("orig_image", this.state.orig_image_file);

    // console.log(this.state.orig_image_file);
    bodyData.append(
      "meta",
      JSON.stringify({ crop_image: this.state.crop_image })
    );
    bodyData.append("project_id", this.props.project_id);

    this.sendData(bodyData, "/mypage/task/normal/complete"); // 서버로 전송( /mypage/task/complete)
  }

  // 사용자의 편의를 위해 버튼을 누르지 않아도 (13==enter) 이벤트를 받으면 handleOnCropComplete 를 호출해줌
  handleKeyPress = e => {
    if (e.charCode === 13) {
      e.preventDefault();

      this.handleOnCropComplete();
    }
  };

  // 크롭 영역을 변경할 수 있게 현재 crop 정보를 crop.id가 id인 크롭 정보로 바꿔줌
  handleOnCropModify = id => {
    const preCrop = this.state.crop_image.find(crop => {
      return crop.id === id;
    });

    this.setState({
      crop: {
        x: preCrop.x,
        y: preCrop.y,
        width: preCrop.width,
        height: preCrop.height,
        label: preCrop.label,
        unit: "px"
      },
      label: preCrop.label,
      changeMode: true,
      preId: id
    });
  };

  // crop.id 가 id인 크롭 데이터를 삭제함
  handleOnCropRemove = id => {
    if (this.state.showEdit) {
      //console.log(id);

      const { crop_image } = this.state;

      this.setState({
        changeMode: false,
        crop_image: crop_image.filter(crop => crop.id !== id)
      });
    }
  };

  // 라벨값이 서버로부터 전송되었을 때 crop_image 의 라벨값을 채워준다.
  handleChangeLabel = (id, label) => {
    const preCrop = this.state.crop_image.find(crop => {
      return crop.id === id;
    });

    //console.log(label);

    this.setState({
      crop_image: this.state.crop_image.map(crop => {
        if (crop.id === preCrop.id) {
          return {
            id: id,
            x: crop.x,
            y: crop.y,
            width: crop.width,
            height: crop.height,
            label: label
          };
        } else return crop;
      })
    });

    //console.log("label change");
  };

  // 이미지를 눌렀을 때 좌표를 불러옴
  handleClickImage = e => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const crops = this.state.crop_image;
    var targetId = "nothing";
    crops.every(function(crop) {
      if (
        x > crop.x &&
        x < crop.x + crop.width &&
        y > crop.y &&
        y < crop.y + crop.height
      ) {
        targetId = crop.id;
        return false;
      } else return true;
    });

    //console.log(targetId);

    if (targetId !== "nothing") {
      this.handleOnCropModify(targetId);
    }
    this.setState({
      showEdit: true
    });
  };

  // 크롭이 완료되었을 때 이미지화 시켜 서버로 전송시킨다
  async handleCropMouseUp() {
    if (this.state.useAI) {
      //console.log(this.state.crop.height);
      if (this.state.crop.height)
        this.setState(
          {
            label: ""
          },
          () => this.handleOnCropComplete()
        );
    }
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

  render() {
    const workStyle = {
      borderTop: "3px solid lightgrey"
    };
    const info = this.props.info;

    const t1 = moment(info.created_at);
    const t2 = moment(info.due_date);

    const days = moment.duration(t2.diff(t1)).days();
    const hours = moment.duration(t2.diff(t1)).hours();
    const minutes = moment.duration(t2.diff(t1)).minutes();

    return (
      <BodyContainer>
        <EntireTitleContainer>
          <LeftTitleContainer>
            <LeftTitleDate>
              <span style={{ color: "black", fontWeight: "bold" }}>
                MISSION
              </span>
              {` ${moment(info.created_at).format("YYYY-MM-DD")} - ${moment(
                info.due_date
              ).format("YYYY-MM-DD")}`}
            </LeftTitleDate>
            <LeftTitle>{info.title}</LeftTitle>
          </LeftTitleContainer>
          <RightTitleContainer>
            <RightTitle>DEADLINE</RightTitle>
            <RightTitleDate>{`${days} DAYS : ${hours} HOURS : ${minutes} MINUTES`}</RightTitleDate>
          </RightTitleContainer>
        </EntireTitleContainer>
        <hr style={workStyle} />
        AI
        <label className="switch">
          <input
            type="checkbox"
            name="useAI"
            onChange={this.handleChange}
            checked={this.state.useAI}
          />
          <span className="slider round" />
        </label>
        <ImageContainer>
          {this.state.orig_image ? (
            <div onMouseUp={this.handleCropMouseUp}>
              <ReactCrop
                src={this.state.orig_image}
                crop={this.state.crop}
                onChange={this.handleOnCropChange}
                onImageLoaded={this.handleImageLoaded}
                style={{ display: this.state.showEdit ? "" : "none" }}
              />

              {this.state.imageRef ? (
                <PrintTotalCrop
                  crops={this.state.crop_image}
                  image={this.state.imageRef}
                  onClick={this.handleClickImage.bind(this)}
                  showEdit={this.state.showEdit}
                />
              ) : null}
            </div>
          ) : null}
          {this.state.loading && this.state.imageRef ? (
            <LoadingContainer
              style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                width: `${this.state.imageRef.width}px`,
                height: `${this.state.imageRef.height}px`,
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
                <div />\
                <div />
                <div />
              </div>
              <p style={{ color: "white" }} />
            </LoadingContainer>
          ) : null}
        </ImageContainer>
        <br />
        <div>
          <form>
            {/* 파일 올리는 DropZone */}
            <div className="filebox">
              {!this.state.orig_image_file ? (
                <Dropzone onDrop={this.onFileSelected}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div
                          style={{
                            width: "400px",
                            height: "400px",
                            backgroundColor: "lightblue"
                          }}
                        >
                          사진을 올려주세요
                        </div>
                      </div>
                    </section>
                  )}
                </Dropzone>
              ) : (
                ""
              )}
              {this.state.showEdit && this.state.orig_image ? (
                <button
                  type="button"
                  onClick={() => {
                    this.setState({
                      crop: {},
                      showEdit: false
                    });
                  }}
                >
                  전체 보기
                </button>
              ) : null}
            </div>

            <div>
              <input
                type="text"
                onChange={this.handleChange}
                value={this.state.label}
                name="label"
                onKeyPress={this.handleKeyPress}
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.handleOnCropComplete}
                  id="store"
                >
                  저장
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={this.handleSendAll}
                >
                  끝내기
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* 지금까지 작업한 영역들을 리스트로 보여줌 */}
        <CropInfoList
          useAI={this.state.useAI}
          crops={this.state.crop_image}
          image={this.state.imageRef}
          onChange={this.handleOnCropModify}
          onRemove={this.handleOnCropRemove}
          changeLabel={this.handleChangeLabel}
        />
      </BodyContainer>
    );
  }
}

export default Body;
