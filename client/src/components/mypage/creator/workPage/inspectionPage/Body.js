import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";
import Button from "@material-ui/core/Button";
import CropImage from "./CropImage";
import "react-image-crop/dist/ReactCrop.css";
import introJS from "intro.js";
import "intro.js/introjs.css";

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

  color: black !important;
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

  padding-right: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  jusify-content: flex-end;
  align-items: flex-end;
  @media (max-width: 500px) {
  }
`;

const StyledButton = styled(Button)`
  height: 60px;
  @media (max-width: 1024px) {
    height: 46px;
  }
  @media (max-width: 500px) {
    font-size: 12px;
    height: 36px;
  }
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 48vh;
`;

const LeftMainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  align-items: center;
  justify-content: flex-start;
`;

const RightDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  align-items: flex-start;
  padding: 40px 20px;

  min-width: 440px;
  height: 100%;
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

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 5px solid lightgrey;

  @media (max-width: 500px) {
    border: none;
  }
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
      nowCropImgId: 0,
      is_crops_correct: [],
      step: 3,
      timer: undefined,
      // width: 0,
      // height: 0,
      crop_images: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    introJS().start();
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
    const url = `/api/mypage/creator/task/inspection?project_id=${this.props.project_id}`;

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
                loading: false,
                // 데이터를 가져온 이후로 5분이 넘어가면 timeOut 함수를 호출한다
                timer: setTimeout(() => {
                  this.timeOut();
                }, 300000)
              })
            )
          );
        }
      });
  }

  /**
   * @dev 원본 이미지를 그린 다음 그 위에 크롭 영역을 그려준다
   */
  async drawCrop() {
    console.log(this.state.data.payload.meta.crop_image);
    const crop_items = this.state.data.payload.meta.crop_image.map(function(
      crop
    ) {
      let id = crop.shape_attributes ? crop.shape_attributes.id : crop.id;

      return <CropImage key={id} crop={crop} />;
    });

    await this.setState({
      crop_images: crop_items
    });
  }

  // 검수 완료 버튼
  handleClick = async e => {
    const crop_images = document.getElementsByClassName("crop_images");
    let crop_items = Array.from(crop_images);
    console.log(crop_items);

    // 하나라도 unchecked 상태이 crop이 존재한다면 이를 확인하라고 알린다
    let check_result = true;
    crop_items.some(el => {
      // attributes는 0:id, 1: class, 2: status
      if (el.attributes[2].value === "unchecked") {
        alert("확인하지 않은 영역이 있습니다.");
        check_result = false;
      }
      return el.attributes[2].value === "unchecked";
    });
    // unchecked 영역 존재시 빠져나간다
    if (!check_result) {
      return;
    }

    // timer 종료
    clearTimeout(this.state.timer);

    // 모든 영역이 확인되었다면 각각을 id 순서대로 반영해준다
    let crop_image = this.state.data.payload.meta.crop_image;
    console.log("crop_image: ", crop_image);
    const new_crop_image_promises = await crop_items.map(el => {
      const id = Number(el.attributes[0].value);
      const status = el.dataset.status;
      const crop = crop_image.filter(
        crop => crop.shape_attributes.id === id
      )[0];
      if (status === "true") {
        crop.correct.push(1);
      } else crop.correct.push(0);

      return new Promise(resolve => resolve(crop));
    });
    const new_crop_image = await Promise.all(new_crop_image_promises);
    console.log(new_crop_image);

    const url = "/api/mypage/creator/task/inspection";
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        new_crop_image: new_crop_image,
        data_id: this.state.data.id
      })
    };

    await this.sendData(url, option);
    await this.fetchData();
  };

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

  timeOut() {
    alert("검수 시간이 만료되었습니다. 다시 시작해 주세요.");
    window.location.reload();
  }

  render() {
    const { data, loading, crop_images } = this.state;
    const info = this.props.info;

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
            <ButtonContainer id="export-button-container">
              <StyledButton
                variant="contained"
                color="primary"
                onClick={this.handleClick}
                data-intro="완료 버튼을 누르면 검수한 데이터를 제출합니다."
                data-step="3"
                data-disable-interaction="true"
                data-position="left"
                disabled={this.state.loading}
              >
                완료
              </StyledButton>
            </ButtonContainer>
            {/* <RightTitle>DEADLINE</RightTitle>
            <RightTitleDate>
              {info
                ? `${days} DAYS : ${hours} HOURS : ${minutes} MINUTES`
                : "UNLIMITED"}
            </RightTitleDate> */}
          </RightTitleContainer>
        </EntireTitleContainer>
        <MainContainer>
          {/* Main Container 의 왼쪽 영역 */}
          <LeftMainContainer>
            {/* 크롭할 이미지 영역 */}
            <ImageContainer
              data-intro="검수할 이미지가 화면에 나타나게 됩니다"
              data-step="1"
              data-disable-interaction="true"
            >
              {!loading ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%"
                  }}
                >
                  <img
                    id="image"
                    src={data.payload.orig_image}
                    alt=""
                    onLoad={this.drawCrop.bind(this)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill"
                    }}
                  />
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
          <RightDescriptionContainer
            data-intro="가이드를 읽고 검수를 진행하시면 됩니다"
            data-step="2"
            data-disable-interaction="true"
          >
            <DescriptionBoxContainer>
              <DescriptionBox>
                - <span style={{ fontWeight: "bold" }}>어두운 네모 박스</span>가
                사물에 적절히 위치하고 있는지 확인해 주세요.
              </DescriptionBox>
              <DescriptionBox>
                - 사물이 네모 박스를 벗어나 있거나, 네모 박스가 너무 크다면 해당
                박스를 클릭하여{" "}
                <span style={{ color: "red" }}>빨간 테두리</span>로 표시해
                주세요.
              </DescriptionBox>
              <DescriptionBox>
                - 네모 박스가 사물을 잘 둘러싸고 있다면 해당 박스를 클릭하여{" "}
                <span style={{ color: "green" }}>초록 테두리</span>로 표시해
                주세요.
              </DescriptionBox>
            </DescriptionBoxContainer>
          </RightDescriptionContainer>
        </MainContainer>
        <StepButtonContainer></StepButtonContainer>
      </BodyContainer>
    );
  }
}

export default Body;
