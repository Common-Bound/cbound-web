import React, { Component } from "react";
import styled from "styled-components";
import Inspect1By1 from "./Inspect1By1";
import moment from "moment";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import CropImage from "./CropImage";

import "react-image-crop/dist/ReactCrop.css";

const BodyContainer = styled.div`
  width: 80%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: cneter;
`;

const EntireTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0px 10px 10px;
`;

const LeftTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const LeftMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  align-items: center;
  justify-content: flex-start;
`;

const StepperContainer = styled.div`
  width: 100%;
`;

const StepperRoot = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const StyledStepper = styled(Stepper)`
  height: 20px;
  padding: 20px 0px 20px 0px !important;
`;

const RightDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  align-items: flex-start;
  padding: 40px 20px 0px 20px;

  width: 440px;
  background-color: #f0f0f0;
`;
``;
const DescriptionBoxContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const DescriptionBox = styled.div`
  font-family: SpoqaHanSans;
  font-size: 16px;
  padding: 10px;
`;

const ImageContainer = styled.div`
  width: 640px;
  max-width: 640px
  min-height: 440px;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid lightgrey;
`;

const CropImageContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`;

const StepButtonContainer = styled.div`
  display: flex;
  padding-right: 10px;
`;

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      correct: [],
      needCropAll: false,
      nowCropImgId: 0,
      is_crops_correct: [],
      step: 3,
      width: 0,
      height: 0,
      crop_images: []
    };
    this.handleClick = this.handleClick.bind(this);

    // this.clickO = this.clickO.bind(this);
    // this.clickX = this.clickX.bind(this);
    // this.handleEndInspect = this.handleEndInspect.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  async componentDidMount() {
    await this.fetchData();
  }

  /**
   * @dev 검수 작업을 위해 현재 queued된 데이터를 가져온다
   *      이때, 자신이 참여하지 않았고 시간순서로 제일 앞선
   *      첫 번째 데이터를 가져온다
   */
  async fetchData() {
    this.setState({
      loading: true
    });
    const url = `/mypage/creator/task/inspection?project_id=${this.props.project_id}`;

    await fetch(url)
      .then(res => res.json())
      .then(result => {
        if (result.message) {
          return alert(result.message);
        } else {
          const data = result.result;
          console.log(data);

          return new Promise(resolve =>
            resolve(
              this.setState({
                data: data,
                correct: Array(data.payload.meta.crop_image.length),
                loading: false
              })
            )
          );
        }
      });
  }

  /**
   * @dev 가져온 data의 payload 부분을 참조하여 원본 이미지를
   *      canvas 위에 그려준다
   */
  async drawImage() {
    const canvas = document.getElementById("canvas");
    const image = document.getElementById("image");
    const ctx = canvas.getContext("2d");

    let scale = 1;
    // 이미지의 가로 길이가 640이 넘으면, 640으로 나눈 비율을 계산한다
    if (image.naturalWidth > 640) {
      scale = image.naturalWidth / 640;
    }

    // 계샨된 비율만큼 나눠줘서 캔버스 영역의 가로 길이를 640 으로 맞춰준다
    // 또한 세로 길이도 이와 같은 비율로 조정해준다
    canvas.width = image.width / scale;
    canvas.height = image.height / scale;

    // 이미지의 크기도 조절해서 그려준다
    ctx.drawImage(image, 0, 0, image.width / scale, image.height / scale);

    await this.setState({
      width: canvas.width,
      height: canvas.height
    });

    return new Promise(resolve => {
      console.log("drawImage end");
      return resolve(this.drawCrop());
    });
  }

  /**
   * @dev 원본 이미지를 그린 다음 그 위에 크롭 영역을 그려준다
   */
  drawCrop() {
    console.log(this.state.data.payload.meta.crop_image);
    const new_crop_images = this.state.data.payload.meta.crop_image.map(
      function(crop) {
        const id = crop.id;

        return <CropImage key={id} crop={crop} />;
      }
    );

    this.setState({
      crop_images: new_crop_images
    });
  }

  // 검수 완료 버튼
  handleClick = async e => {
    const crop_images = document.getElementsByClassName("crop_images");
    let new_crop_images = Array.from(crop_images);
    console.log(new_crop_images);

    // 하나라도 unchecked 상태이 crop이 존재한다면 이를 확인하라고 알린다
    let check_result = true;
    new_crop_images.some(el => {
      // attributes는 0:id, 1: class, 2: name, 3: status, 4: style
      if (el.attributes[3].value === "unchecked") {
        alert("확인하지 않은 영역이 있습니다.");
        check_result = false;
      }
      return el.attributes[3].value === "unchecked";
    });
    // unchecked 영역 존재시 빠져나간다
    if (!check_result) {
      return;
    }

    // 모든 영역이 확인되었다면 각각을 id 순서대로 반영해준다
    let crop_image = this.state.data.payload.meta.crop_image;
    new_crop_images.forEach(el => {
      const id = Number(el.attributes[0].value);
      const status = el.dataset.status;
      if (status === "true") {
        crop_image[id].correct.push(1);
      } else crop_image[id].correct.push(0);
    });

    console.log(crop_image);

    const url = "/mypage/creator/task/inspection";
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        new_crop_image: crop_image,
        data_id: this.state.data.id
      })
    };

    await this.sendData(url, option);
    await this.fetchData();
  };

  // handleReset = async e => {
  //   const url = "/mypage/task/inspection";
  //   await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ reset: true })
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       return new Promise(resolve => resolve(console.log(data)));
  //     });
  // };

  /**
   * @dev 서버 url로 데이터(option) 전송
   */
  sendData = async (url, option) => {
    await fetch(url, option)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          return alert(data.message);
        } else
          return new Promise(resolve => {
            return resolve(console.log(data));
          });
      })
      .catch(err => console.log(err));
  };

  handleNext() {
    //setActiveStep(prevActiveStep => prevActiveStep + 1);
    this.setState({
      step: this.state.step + 1
    });
  }

  handleBack() {
    //setActiveStep(prevActiveStep => prevActiveStep - 1);
    this.setState({
      step: this.state.step - 1
    });
  }

  handleReset() {
    this.setState({
      step: 0
    });
  }
  render() {
    const { data, loading, width, height, crop_images } = this.state;
    const info = this.props.info;

    const t1 = moment();
    const t2 = moment(info.due_date);

    const days = moment.duration(t2.diff(t1)).days();
    const hours = moment.duration(t2.diff(t1)).hours();
    const minutes = moment.duration(t2.diff(t1)).minutes();

    const steps = ["STEP 1", "STEP 2", "STEP 3"];

    if (this.state.needCropAll) {
      return (
        <Inspect1By1
          clickO={this.clickO}
          clickX={this.clickX}
          handleEndInspect={this.handleEndInspect}
          id={this.state.nowCropImgId}
          data={data.payload.orig_image}
          ammountCropImage={this.state.correct.length}
          crop_image={data.payload.meta.crop_image}
        />
      );
    } else {
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
          <MainContainer>
            {/* Main Container 의 왼쪽 영역 */}
            <LeftMainContainer>
              <StepperContainer>
                <StepperRoot>
                  <StyledStepper activeStep={this.state.step}>
                    {steps.map(label => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </StyledStepper>
                </StepperRoot>
              </StepperContainer>
              {/* 크롭할 이미지 영역 */}
              <ImageContainer>
                {!loading ? (
                  <div
                    style={{
                      position: "relative",
                      width: this.state.data ? `${width}px` : "0px",
                      height: this.state.data ? `${height}px` : "0px"
                    }}
                  >
                    <canvas id="canvas" style={{ position: "absolute" }}>
                      <div style={{ display: "none" }}>
                        <img
                          id="image"
                          src={data.payload.orig_image}
                          alt=""
                          onLoad={this.drawImage.bind(this)}
                        />
                      </div>
                    </canvas>
                    <CropImageContainer id="crop_image_container">
                      {crop_images}
                    </CropImageContainer>
                  </div>
                ) : (
                  "검수 할 작업을 가져오는 중..."
                )}
              </ImageContainer>
            </LeftMainContainer>
            {/* Main Container 의 오른쪽 영역 */}
            <RightDescriptionContainer>
              {this.state.step === 0 ? (
                <DescriptionBoxContainer>
                  <DescriptionBox>
                    1. 좌측 [+] 영역을 클릭하여 이미지를 업로드 해 주세요 (단,
                    이미지 선명하지 않거나 해상도가 낮으면 업로드 되지 않습니다)
                  </DescriptionBox>
                  <DescriptionBox>
                    2. 이미지가 정상적으로 업로드 되어 바운드 되면, AI가
                    자동으로 글자라고 인식하여 이미지들을 아래 썸네일로
                    보여줍니다.
                  </DescriptionBox>
                  <DescriptionBox>
                    3. 썸네일 이미지가 정상적으로 로드 되었다면, 하단 우측의
                    노란색 [NEXT] 버튼을 눌러 다음 단계로 이동하세요.
                  </DescriptionBox>
                </DescriptionBoxContainer>
              ) : this.state.step === 1 ? (
                <DescriptionBoxContainer>
                  <DescriptionBox>
                    4. SHOW 버튼을 누르면, 좌측 이미지에서 AI가 자동으로 인식한
                    영역들이 보여집니다. 인식되지 않은 영역에서 글자로 생각되는
                    부분이 있다면 그 영역을 드래그하여 추가하세요. (영역을
                    드래그하면 영역 이동 가능)
                  </DescriptionBox>
                  <DescriptionBox>
                    5. 선택 후, 아래의 BOUND 버튼 혹은 엔터를 누르면 AI가 추가로
                    글자를 학습합니다. AI가 활성화 상태면 자동으로 글자를
                    학습합니다.
                  </DescriptionBox>
                  <DescriptionBox>
                    6. 완료 후 NEXT버튼을 눌러 다음의 마지막 단계(STEP3)로
                    이동하세요.
                  </DescriptionBox>
                </DescriptionBoxContainer>
              ) : (
                <DescriptionBoxContainer>
                  <DescriptionBox>
                    8. AI가 글자를 제대로 인식했는지 각 썸네일 아래 블루박스를
                    확인해주세요.
                  </DescriptionBox>
                  <DescriptionBox>
                    9. AI가 글자를 잘못 인식했거나, 바운드 영역이 잘못 선택되어
                    있다면 아래 바운드 썸네일을 클릭하여 영역을 수정하거나,
                    블루박스 내용을 수정하여 AI를 학습시켜주세요.
                  </DescriptionBox>
                  <DescriptionBox>
                    * AI의 정확도를 개선한 분에겐 추가 포인트를 드립니다.
                    (기여도 확인 시, 검증 후 개당 +10포인트 추가 지급)
                  </DescriptionBox>
                </DescriptionBoxContainer>
              )}
            </RightDescriptionContainer>
          </MainContainer>
          <StepButtonContainer>
            <Button disabled={this.state.step === 0} onClick={this.handleBack}>
              Back
            </Button>
            <Button
              disabled={this.state.step > steps.length - 1}
              variant="contained"
              color="primary"
              onClick={this.handleNext}
            >
              {this.state.step === steps.length - 1 ? "Finish" : "Next"}
            </Button>
            {this.state.step === steps.length ? (
              <div>
                <Button onClick={this.handleClick}>완료하기</Button>
              </div>
            ) : (
              ""
            )}
          </StepButtonContainer>
        </BodyContainer>
      );
    }
  }
}

export default Body;
