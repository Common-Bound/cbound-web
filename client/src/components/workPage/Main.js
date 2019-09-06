import React, { Component } from "react";
import styled from "styled-components";
import ReactCrop from "react-image-crop"; // Cropper Import
import CropInfoList from "./CropInfoList.js"; // 크롭 리스트를 출력함
import PrintTotalCrop from "./PrintTotalCrop"; // 크롭 리스트를 한 캔버스에 그려줌
import Dropzone from "react-dropzone";
import moment from "moment";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Body from "./Body";

const FileList = styled.div`
  width: 640px;
  height: 64px;

  display: flex;

  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;

  overflow: scroll;

  border: 1px solid lightgrey;
`;

const FileThumbnail = styled.div`
  width: 50px;
  min-height: 50px;
  margin: 0px 5px;

  border: 1px solid lightgrey;

  background-image: url(${props => props.base64});
  background-size: 100% 100%;
`;

const BodyContainer = styled.div`
  width: 80%;
  margin: 0 auto;

  display: ${props => (props.display ? props.display : "flex")};
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
  background-color: #f0f0f0 !important;
`;

const RightDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  align-items: flex-start;
  padding: 20px 20px 0px 20px;

  width: 440px;
  height: 520px;
  background-color: #f0f0f0;
`;

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BoundButton = styled.button`
  width: 80px;
  height: 80px;
  background-color: black;
  color: white;
  border-radius: 100%;
  transition: 0.3s;
  text-align: center;
  margin: 10px 10px 20px 10px;

  :hover {
    color: black;
    background-color: white;
  }
`;

const ShowButton = styled(BoundButton)`
  color: black;
  background-color: white;

  :hover {
    color: white;
    background-color: black;
  }
`;

const ImageContainer = styled.div`
  width: 650px;
  max-width: 650px
  min-height: 440px;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  border: ${props => (props.show ? "5px solid lightgrey" : "none")};
`;

const DropZoneBox = styled.div`
  width: 640px;
  height: 440px;
  background-color: white;
  border: 5px solid lightgrey;
                          
  border-radius: 20px;
  font-family: Avenir;
  font-size: 25px
  font-weight: bold;
  text-align: center;
  line-height: 370px;
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
  display: flex;
  justify-content: space-between;
`;

const StepButtonContainer = styled.div`
  display: flex;
  padding-right: 10px;
`;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orig_image_files: undefined,
      orig_image_base64: undefined,
      bodies: undefined,
      crop_image: [], // 지금까지 크롭한 영역들의 정보 리스트 (x, y, width, height)
      crop: {}, // ReactCrop 에 사용되는 값으로 크롭 영역이 변경될 때 함께 변경됨. (현재 크롭 영역에 대한 정보를 가지고 있음)
      label: "", // 작업한 영역에 대해 레이블링 할 때 사용되는 입력창의 변경 사항에 대해 저장함
      imageRef: null, // 크롭 컨테이너에 이미지가 로드 되었을 때 이미지 값을 저장함
      changeMode: false, // 현재 크롭된 이미지를 추가해야 할지 수정해야 할지 결정하는 Flag
      preId: "", // ChangeMode 가 true 라면 변경할 이미지의 id
      showEdit: true, // 한 개의 크롭 영역을 변경할 수 있는 이미지를 줄지 크롭된 영역 리스트를 이미지에 그려줄 지
      useAI: true, // AI를 사용할지 말지 스위치 할 때 변경할 값
      loading: false,
      step: 0 // 현재 STEP 수
    };
  }

  // 업로드된 이미지를 출력하기 위해 Base64로 바꿀 때 호출됨
  async getBase64(files) {
    const base64s = await files.map(file => {
      // File 을 Base64로 바꿔줌
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    });

    const result = await Promise.all(base64s);

    return new Promise(resolve => resolve(result));
  }

  // 이미지가 업로드 되었을 때 호출됨
  onFileSelected = async files => {
    console.log(files);
    // 이미지가 업로드 되었을 때 기존에 크롭된 영역을 초기화함
    //console.log(files[0]);
    await this.setState({
      orig_image_files: files
      // __nextkey: 0,
      // crop_image: [],
      // crop: {},
      // label: "",
      // imageRef: "",
      // changeMode: false,
      // preId: "",
      // orig_image: null
    });

    await this.getBase64(files).then(
      base64s =>
        new Promise(resolve => {
          resolve(
            this.setState({
              orig_image_base64: base64s
            })
          );
        })
    );

    // AI를 사용할 경우에만 이미지 데이터를 서버로 전송해줌
    // if (this.state.useAI) {
    //   const bodyData = new FormData();
    //   bodyData.append("orig_image", this.state.orig_image);

    //   this.sendData(bodyData, "/mypage/creator/task/normal"); // 서버로 전송( /mypage/task)
    // }

    const bodies = await this.state.orig_image_files.map((file, index) => {
      return new Promise(resolve => {
        resolve(
          <Body
            info={this.props.info}
            project_type={this.props.project_type}
            project_id={this.props.project_id}
            display="none"
            index={index}
            orig_image_file={file}
            orig_image_base64={this.state.orig_image_base64[index]}
          />
        );
      });
    });

    const newBodies = await Promise.all(bodies);
    await this.setState({
      bodies: newBodies
    });

    console.log(this.state);
  };

  render() {
    const info = this.props.info;

    const t1 = moment();
    const t2 = moment(info.due_date);

    const days = moment.duration(t2.diff(t1)).days();
    const hours = moment.duration(t2.diff(t1)).hours();
    const minutes = moment.duration(t2.diff(t1)).minutes();

    const steps = ["STEP 1", "STEP 2", "STEP 3"];
    return (
      <BodyContainer display={this.props.display}>
        {/* 최 상단에 위취한 정보를 보여주는 컨테이너 */}
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
        {/* 이미지 업로드 창과 이미지, 설명을 보여주는 메인 컨테이너 */}
        <MainContainer>
          {/* Main Container 의 왼쪽 영역 */}
          <LeftMainContainer>
            {/* 파일 썸네일 영역 */}
            {!this.state.orig_image_base64 ? (
              <FileList>
                <FileThumbnail />
                <FileThumbnail />
                <FileThumbnail />
              </FileList>
            ) : (
              <FileList>
                {this.state.orig_image_base64.map(base64 => {
                  return <FileThumbnail base64={base64} />;
                })}
              </FileList>
            )}
            {this.state.bodies}
            {/* 파일 올리는 DropZone */}
            {!this.state.orig_image_file ? (
              <Dropzone onDrop={this.onFileSelected}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <DropZoneBox>[+] UPLOAD IMAGE</DropZoneBox>
                    </div>
                  </section>
                )}
              </Dropzone>
            ) : (
              ""
            )}
            {/* 크롭할 이미지 영역 */}
            {this.state.orig_image ? (
              <ImageContainer id="image_container" show={this.state.orig_image}>
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
            ) : null}
          </LeftMainContainer>
          {/* Main Container 의 오른쪽 영역 */}
          <RightDescriptionContainer>
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
            텍스트 감지 AI 어시스턴트
            <label className="switch">
              <input
                type="checkbox"
                name="useAI"
                onChange={this.handleChange}
                checked={this.state.useAI}
              />
              <span className="slider round" />
            </label>
            {this.state.step === 0 ? (
              <DescriptionBoxContainer>
                <DescriptionBox>
                  1. 좌측 [+] 영역을 클릭하여 이미지를 업로드 해 주세요 (단,
                  이미지 선명하지 않거나 해상도가 낮으면 업로드 되지 않습니다)
                </DescriptionBox>
                <DescriptionBox>
                  2. 이미지가 정상적으로 업로드 되어 바운드 되면, AI가 자동으로
                  글자라고 인식하여 이미지들을 아래 썸네일로 보여줍니다.
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
                  * AI의 정확도를 개선한 분에겐 추가 포인트를 드립니다. (기여도
                  확인 시, 검증 후 개당 +10포인트 추가 지급)
                </DescriptionBox>
              </DescriptionBoxContainer>
            )}
            <ButtonContainer>
              <BoundButton
                type="button"
                onClick={this.handleOnCropComplete}
                id="store"
              >
                BOUND
              </BoundButton>
              {this.state.showEdit && this.state.orig_image ? (
                <ShowButton
                  type="button"
                  onClick={() => {
                    this.setState({
                      crop: {},
                      showEdit: false
                    });
                  }}
                >
                  SHOW
                </ShowButton>
              ) : null}
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
          <StepButtonContainer>
            <Button disabled={this.state.step === 0} onClick={this.handleBack}>
              Back
            </Button>
            <Button
              disabled={
                this.state.orig_image === "" ||
                this.state.loading === true ||
                this.state.step > steps.length - 1
              }
              variant="contained"
              color="primary"
              onClick={this.handleNext}
            >
              {this.state.step === steps.length - 1 ? "Finish" : "Next"}
            </Button>
            {this.state.step === steps.length ? (
              <div>
                <Button onClick={this.handleSendAll}>완료하기</Button>
              </div>
            ) : (
              ""
            )}
          </StepButtonContainer>
        </CropListContainer>
      </BodyContainer>
    );
  }
}

export default Main;
