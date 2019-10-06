import React, { Component } from "react";
import ReactCrop from "react-image-crop"; // Cropper Import
import CropInfoList from "./CropInfoList.js"; // 크롭 리스트를 출력함
import PrintTotalCrop from "./PrintTotalCrop"; // 크롭 리스트를 한 캔버스에 그려줌
import styled from "styled-components";
import introJS from "intro.js";
import "intro.js/introjs.css";
import "react-image-crop/dist/ReactCrop.css";
import "./Body.css";
import { setTimeout } from "timers";

const BodyContainer = styled.div`
  width: 100%;
  height: 64vh;

  display: ${props => (props.display ? props.display : "flex")};
  flex-direction: column;
  justify-content: flex-start;
  align-items: cneter;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 10px;

  @media (max-width: 500px) {
    flex-direction: column;
    padding-bottom: 0px;
  }
`;

const LeftMainContainer = styled.div`
  width: 90%;

  display: flex;
  flex-direction: column;
  flex-basis: auto;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const RightDescriptionContainer = styled.div`
  min-width: 64px;
  height: 48vh;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  
  color: white; !important;
  background-color: black;

  @media(max-width: 500px){
    height: 32px;
    width: 100%;

    flex-direction: row;
    align-items: center;
  }
`;

const ButtonContainer = styled.div`
  width: 50px;
  height: 50px;
  margin: 5px;

  background-color: black;
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transition: 0.3s;

  border-radius: 5px;
  cursor: pointer;

  :hover {
    background-color: white;
    color: black;
  }
  @media (max-width: 500px) {
    width: 28px;
    height: 28px;
    margin-left: 8px;
  }
`;

const Icon = styled.i`
  transform: scale(1.4, 1.4);

  @media (max-width: 500px) {
    transform: scale(1.3, 1.3);
  }
`;

const IconTitle = styled.div`
  font-family: Avenir;

  @media (max-width: 810px) {
    display: none;
  }
`;

// const DescriptionBoxContainer = styled.div`
//   width: 100%;

//   display: flex;
//   flex-direction: column;
//   justify-content: space-around;
// `;

// const DescriptionBox = styled.div`
//   font-family: SpoqaHanSans;
//   font-size: 16px;
//   padding: 14px;
// `;

const StyledSpan = styled.span`
  width: 48px;
  height: 24px;

  :before {
    width: 16px !important;
    height: 16px !important;
  }
`;

// const BoundButton = styled.button`
//   width: 70px;
//   height: 70px;
//   background-color: white;
//   color: black;
//   border-radius: 100%;
//   transition: 0.3s;
//   text-align: center;
//   margin: 10px 10px 20px 10px;

//   :hover {
//     color: white;
//     background-color: black;
//   }
// `;

// const ShowButton = styled(BoundButton)`
//   color: black;
//   background-color: white;

//   :hover {
//     color: white;
//     background-color: black;
//   }
// `;

const ImageContainer = styled.div`
  width: 100%;
  height: 48vh;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  border: ${props => (props.show ? "5px solid lightgrey" : "none")};

  @media (max-width: 500px) {
  }
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

const CropListContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

class Body extends Component {
  // Body Component 생성
  constructor(props) {
    super(props);

    this.state = {
      __nextkey: 0, // Crop.id 생성을 위한 임시 변수
      // orig_image: "", // Base64로 인코딩된 값을 가져 화면에 출력할 때 사용됨
      // orig_image_file: null, // 현재 작업하고 있는 이미지를 FormData로 패킹해 서버로 보낼 때 사용됨
      crop_image: [], // 지금까지 크롭한 영역들의 정보 리스트 (x, y, width, height)
      crop: {}, // ReactCrop 에 사용되는 값으로 크롭 영역이 변경될 때 함께 변경됨. (현재 크롭 영역에 대한 정보를 가지고 있음)
      label: "", // 작업한 영역에 대해 레이블링 할 때 사용되는 입력창의 변경 사항에 대해 저장함
      imageRef: null, // 크롭 컨테이너에 이미지가 로드 되었을 때 이미지 값을 저장함
      changeMode: false, // 현재 크롭된 이미지를 추가해야 할지 수정해야 할지 결정하는 Flag
      preId: "", // ChangeMode 가 true 라면 변경할 이미지의 id
      showEdit: true, // 한 개의 크롭 영역을 변경할 수 있는 이미지를 줄지 크롭된 영역 리스트를 캔버스에 그려줄 지
      useAI: true, // AI를 사용할지 말지 스위치 할 때 변경할 값
      loading: false,
      time_counter: [], // 각 크롭 영역을 지정하는데 걸리는 시간
      timer: 0
      // step: 0 // 현재 STEP 수
    };

    this.ImageContainerRef = React.createRef();
    this.handleSendAll = this.handleSendAll.bind(this);
    this.handleOnCropModify = this.handleOnCropModify.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.handleCropMouseUp = this.handleCropMouseUp.bind(this);
    this.handleStartTimer = this.handleStartTimer.bind(this);
  }

  async componentDidMount() {
    setTimeout(() => {
      this.props.index === 0 ? introJS().start() : console.log("");
    }, 500);
    if (this.state.useAI) {
      const formData = new FormData();
      formData.append(
        "orig_image",
        await this.getBase64(this.props.orig_image_file)
      );
      console.log(this.props.orig_image_file);

      await this.sendData(formData, `/api/mypage/creator/task/normal`);
    }
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
        console.log(data);

        // 경로별 받은 데이터를 다르게 핸들링함
        if (sendTo === "/api/mypage/creator/task/normal") {
          var counter = 0; // Crop.id 생성을 위한 임시 변수

          this.setState({
            crop_image: data.data.meta[0]["crop_image"].map(crop => {
              // 서버에서 인식한 크롭 영역들을 미리 crop_image에 넣어줌
              // const scaleX =
              //   this.state.imageRef.naturalWidth / this.state.imageRef.width;
              // const scaleY =
              //   this.state.imageRef.naturalHeight / this.state.imageRef.height;
              //console.log("scaleX: " + scaleX);
              //console.log("scaleY: " + scaleY);
              return {
                shape_attributes: {
                  id: counter++,
                  x: crop.x,
                  y: crop.y,
                  width: crop.width,
                  height: crop.height
                },
                region_attributes: {
                  label: crop.label
                }
              };
            }),
            __nextkey: counter
          });

          var tempTimeCounterArray = [];
          for (var i = 0; i < counter; i++) {
            var temp = { index: i, time: 0 };
            tempTimeCounterArray.push(temp);
          }

          this.setState({
            time_counter: tempTimeCounterArray,
            timer: new Date().getTime()
          });
        } else if (sendTo.startsWith("http://")) {
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
        console.log(ex);
      });

    await this.setState({
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
    // console.log(image); DOM 요소
    console.log("image.width: ", image.width);
    console.log("image.naturalWidth: ", image.naturalWidth);
    console.log("image.height: ", image.height);
    console.log("image.naturalHeight: ", image.naturalHeight);

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
    const scaleX = this.state.imageRef.naturalWidth / this.state.imageRef.width;
    const scaleY =
      this.state.imageRef.naturalHeight / this.state.imageRef.height;

    console.log("cropData: ", cropData);
    console.log("scaleX: ", scaleX);
    console.log("scaleY: ", scaleY);
    const resizedCropData = {
      x: cropData.x * scaleX,
      y: cropData.y * scaleY,
      width: cropData.width * scaleX,
      height: cropData.height * scaleY,
      label: cropData.label
    };
    console.log("resizedCropData: ", resizedCropData);
    const image = new Image();

    image.src = this.props.orig_image_file;

    // state의 changeMode 를 보고 크롭된 영역을 추가/수정함
    if (
      this.props.orig_image_file &&
      this.state.showEdit &&
      this.state.crop.height
    ) {
      //console.log("Complete");
      if (this.state.changeMode) {
        // 수정
        this.setState({
          crop_image: await this.state.crop_image.map(crop => {
            if (crop.shape_attributes.id === this.state.preId) {
              return {
                shape_attributes: {
                  id: this.state.preId,
                  x: cropData.x * scaleX,
                  y: cropData.y * scaleY,
                  width: cropData.width * scaleX,
                  height: cropData.height * scaleY
                },
                region_attributes: {
                  label: this.state.label
                }
              };
            } else return crop;
          }),
          label: "",
          crop: {},
          changeMode: false,
          time_counter: this.state.time_counter.map(el => {
            if (this.state.preId === el.index) {
              return {
                index: this.state.preId,
                time: el.time + new Date().getTime() - this.state.timer
              };
            } else return el;
          })
        });
      } else {
        // 추가
        this.setState(
          {
            crop_image: this.state.crop_image.concat({
              shape_attributes: {
                id: this.state.__nextkey++,
                x: cropData.x * scaleX,
                y: cropData.y * scaleY,
                width: cropData.width * scaleX,
                height: cropData.height * scaleY
              },
              region_attributes: {
                label: this.state.label
              }
            }),
            label: "",
            crop: {},
            time_counter: this.state.time_counter.concat({
              index: this.state.__nextkey - 1,
              time: new Date().getTime() - this.state.timer
            })
          },
          () => {
            //console.log(this.state.time_counter);
          }
        );
        //console.log(this.state.crop_image[0].imgSrc);
      }
    }
  };

  // 작업한 내용 전부를 서버로 전송함
  handleSendAll = async () => {
    console.log(this.state.crop_image);
    const bodyData = new FormData();
    let new_crop_image = Array.from(this.state.crop_image);

    bodyData.append("orig_image", this.props.orig_image_file);

    // 이미지 좌표를 원래 이미지 사이즈에 맞게 리사이즈 한 후 저장해야 한다
    // 만약
    // if (this.state.imageRef.naturalWidth > 640) {
    //   new_crop_image = await this.resizeCropLocation(
    //     this.state.imageRef.naturalWidth,
    //     this.state.crop_image
    //   );
    // }

    bodyData.append(
      "meta",
      await JSON.stringify({ crop_image: new_crop_image })
    );
    bodyData.append("project_id", this.props.project_id);

    await this.sendData(bodyData, "/api/mypage/creator/task/normal/complete"); // 서버로 전송( /mypage/task/complete)

    return new Promise(resolve => resolve(true));
  };

  // 크롭 좌표를 리사이징 한다
  async resizeCropLocation(naturalWidth, crop_image) {
    const scale = naturalWidth / 640;
    console.log("scale: " + scale);

    let new_crop_image = await crop_image.map(async crop => {
      const s = crop.shape_attributes;

      const id = s.id;
      const new_x = s.x * scale;
      const new_y = s.y * scale;
      const new_width = s.width * scale;
      const new_height = s.height * scale;

      const new_shape_attributes = {
        id: id,
        x: Number.parseFloat(new_x).toFixed(0),
        y: Number.parseFloat(new_y).toFixed(0),
        width: Number.parseFloat(new_width).toFixed(0),
        height: Number.parseFloat(new_height).toFixed(0)
      };

      let tmp = {};
      Object.assign(tmp, crop);
      tmp.shape_attributes = new_shape_attributes;

      return new Promise(resolve => {
        resolve(tmp);
      });
    });

    new_crop_image = await Promise.all(new_crop_image);

    return new Promise(resolve => resolve(new_crop_image));
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
      return crop.shape_attributes.id === id;
    });
    console.log("preCrop: ", preCrop);
    // 화면에 보여지려면 다시 작게 스케일링 해주어야 한다.
    const scaleX = this.state.imageRef.naturalWidth / this.state.imageRef.width;
    const scaleY =
      this.state.imageRef.naturalHeight / this.state.imageRef.height;

    this.setState({
      crop: {
        x: preCrop.shape_attributes.x / scaleX,
        y: preCrop.shape_attributes.y / scaleY,
        width: preCrop.shape_attributes.width / scaleX,
        height: preCrop.shape_attributes.height / scaleY,
        unit: "px",
        label: preCrop.region_attributes.label
      },
      label: preCrop.region_attributes.label,
      changeMode: true,
      preId: id,
      timer: new Date().getTime()
    });
  };

  // crop.id 가 id인 크롭 데이터를 삭제함
  handleOnCropRemove = id => {
    if (this.state.showEdit) {
      //console.log(id);

      const { crop_image } = this.state;

      this.setState({
        changeMode: false,
        crop_image: crop_image.filter(crop => crop.shape_attributes.id !== id),
        time_counter: this.state.time_counter.filter(el => el.index !== id)
      });
    }
  };

  // 라벨값이 서버로부터 전송되었을 때 crop_image 의 라벨값을 채워준다.
  handleChangeLabel = (id, label) => {
    const preCrop = this.state.crop_image.find(crop => {
      return crop.shape_attributes.id === id;
    });

    //console.log(label);

    this.setState({
      crop_image: this.state.crop_image.map(crop => {
        if (crop.shape_attributes.id === preCrop.shape_attributes.id) {
          return {
            shape_attributes: {
              id: id,
              x: crop.shape_attributes.x,
              y: crop.shape_attributes.y,
              width: crop.shape_attributes.width,
              height: crop.shape_attributes.height
            },
            region_attributes: {
              label: label
            }
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
        x > crop.shape_attributes.x &&
        x < crop.shape_attributes.x + crop.shape_attributes.width &&
        y > crop.shape_attributes.y &&
        y < crop.shape_attributes.y + crop.shape_attributes.height
      ) {
        targetId = crop.shape_attributes.id;
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
  async handleCropMouseUp(e) {
    var button = document.createElement("Button");
    button.style.position = "fixed";
    button.style.left = e.clientX - 35 + "px";
    button.style.top = e.clientY - 35 + "px";
    button.style.width = "70px";
    button.style.height = "70px";
    button.style.backgroundColor = "white";
    button.style.color = "black";
    button.style.borderRadius = "100%";
    button.style.transition = "0.3s";
    button.style.textAlign = "center";

    button.onclick = () => {
      this.handleOnCropComplete();
      document.body.removeChild(button);
    };

    button.onmouseout = () => {
      document.body.removeChild(button);
    };
    button.innerHTML = "BOUND";

    document.body.appendChild(button);

    setTimeout(function() {
      try {
        document.body.removeChild(button);
      } catch {
        //console.log('timeout')
      }
    }, 5000);
  }

  getCropImageData() {
    return this.state.crop_image;
  }

  getCropTimeData() {
    return this.state.time_counter;
  }

  handleStartTimer() {
    this.setState({
      timer: new Date().getTime()
    });
  }

  render() {
    return (
      <BodyContainer display={this.props.display} className={this.props.class}>
        {/* 최 상단에 위취한 정보를 보여주는 컨테이너 */}
        {/* 이미지 업로드 창과 이미지, 설명을 보여주는 메인 컨테이너 */}
        <MainContainer>
          {/* Main Container 의 왼쪽 영역 */}
          <LeftMainContainer>
            {/* 크롭할 이미지 영역 */}
            <ImageContainer
              ref={this.ImageContainerRef}
              id="image_container"
              show={this.props.orig_image_file}
              onMouseDown={this.handleStartTimer}
              onMouseUp={this.handleCropMouseUp}
              onTouchEnd={this.handleCropMouseUp}
              data-intro={
                this.props.index === 0
                  ? "이미지에서 추출할 영역을 드래그하여 지정하세요."
                  : undefined
              }
              data-step="1"
              data-disable-interaction="true"
            >
              <ReactCrop
                src={this.props.orig_image_base64}
                crop={this.state.crop}
                onChange={this.handleOnCropChange}
                onImageLoaded={this.handleImageLoaded}
                style={{
                  display: this.state.showEdit ? "" : "none",
                  width: "100%"
                }}
                imageStyle={{
                  width: "100%",
                  height: "48vh",
                  objectFit: "fill"
                }}
              />

              {this.state.imageRef ? (
                <PrintTotalCrop
                  crops={this.state.crop_image}
                  image={this.state.imageRef}
                  onClick={this.handleClickImage}
                  showEdit={this.state.showEdit}
                />
              ) : null}

              {this.state.loading && this.state.imageRef ? (
                <LoadingContainer
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translateX(-50%) translateY(-50%)",
                    width: `${
                      document.getElementById("image_container").style.width
                    }px`,
                    height: `${
                      document.getElementById("image_container").style.width
                    }px`,
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
                  <p style={{ color: "white" }} />
                </LoadingContainer>
              ) : null}
            </ImageContainer>
          </LeftMainContainer>
          {/* Main Container 의 오른쪽 영역 */}
          <RightDescriptionContainer>
            {/* <DescriptionBoxContainer>
              <DescriptionBox>
                텍스트 감지 AI 어시스턴트
                <label className="switch">
                  <input
                    type="checkbox"
                    name="useAI"
                    onChange={this.handleChange}
                    checked={this.state.useAI}
                  />
                  <StyledSpan className="slider round" />
                </label>
              </DescriptionBox>
            </DescriptionBoxContainer>
            <DescriptionBoxContainer>
              <DescriptionBox>
                - 이미지에서 추출할 영역을 드래그하여 지정하세요.
              </DescriptionBox>
              <DescriptionBox>
                - 썸네일 아래의 <span style={{ color: "blue" }}>블루박스</span>
                에 라벨 값을 입력하고{" "}
                <span style={{ fontWeight: "bold" }}>ENTER</span>키를 누르세요.{" "}
                <span style={{ fontWeight: "bold" }}>SHOW</span> 버튼을 눌러
                라벨링 된 이미지를 확인하세요.
              </DescriptionBox>
              <DescriptionBox>
                - 바구니에 추가된 썸네일을 클릭하여 해당 영역을 수정하고,
                불필요한 영역은 오른쪽 위의{" "}
                <span style={{ fontWeight: "bold" }}>X</span> 버튼을 눌러
                삭제하세요.
              </DescriptionBox>
            </DescriptionBoxContainer>
            <ButtonContainer>
              <BoundButton
                type="button"
                onClick={this.handleOnCropComplete}
                id="store"
                data-intro={
                  this.props.index === 0
                    ? "영역을 추가하려면 BOUND 버튼을 누르세요."
                    : undefined
                }
                data-step="2"
                data-disable-interaction="true"
              >
                BOUND
              </BoundButton>
              {this.state.showEdit && this.props.orig_image_file ? (
                <ShowButton
                  type="button"
                  onClick={() => {
                    this.setState({
                      crop: {},
                      showEdit: false
                    });
                  }}
                  data-intro={
                    this.props.index === 0
                      ? "라벨링 된 이미지를 확인하려면 SHOW 버튼을 누르세요."
                      : undefined
                  }
                  data-step="3"
                  data-disable-interaction="true"
                >
                  SHOW
                </ShowButton>
              ) : null}
            </ButtonContainer> */}
            <ButtonContainer>
              <Icon className="fas fa-robot"></Icon>
              <input
                type="checkbox"
                name="useAI"
                onChange={this.handleChange}
                checked={this.state.useAI}
              />

              <IconTitle>AI</IconTitle>
            </ButtonContainer>
            <ButtonContainer
              onClick={() => {
                this.setState({
                  crop: {},
                  showEdit: false
                });
              }}
              data-intro={
                this.props.index === 0
                  ? "라벨링 된 이미지를 확인하려면 SHOW 버튼을 누르세요."
                  : undefined
              }
              data-step="3"
              data-disable-interaction="true"
            >
              <Icon className="far fa-eye"></Icon>
              <IconTitle>SHOW</IconTitle>
            </ButtonContainer>
          </RightDescriptionContainer>
        </MainContainer>
        {/* 크롭된 이미지가 보여지는 영역 */}
        <CropListContainer>
          <CropInfoList
            useAI={this.state.useAI}
            crops={this.state.crop_image}
            image={this.state.imageRef}
            onChange={this.handleOnCropModify}
            onRemove={this.handleOnCropRemove}
            changeLabel={this.handleChangeLabel}
          />
        </CropListContainer>
      </BodyContainer>
    );
  }
}

export default Body;
