import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";
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

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 70vh;
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

class InspectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      status: []
      // width: 0,
      // height: 0,
    };
    this.drawCrop = this.drawCrop.bind(this);
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
    const url = `/api/mypage/creator/history/inspection?data_id=${this.props.data_id}`;

    await fetch(url)
      .then(res => res.json())
      .then(result => {
        if (result.message) {
          return alert(result.message);
        } else {
          const data = result.result[0];
          console.log(data);
          console.log(data.payload.meta.crop_image[0].correct[0]);

          return new Promise(resolve =>
            resolve(
              this.setState({
                data: data,
                correct: Array(data.payload.meta.crop_image.length),
                status: data.payload.meta.crop_image.map(el => {
                  return el.correct[0] ? "true" : "false";
                }), // 여기서 정확 어떻게 표시할지 리턴
                loading: false
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
    const status = this.state.status;
    const crop_items = this.state.data.payload.meta.crop_image.map(function(
      crop,
      index
    ) {
      let id = crop.shape_attributes ? crop.shape_attributes.id : crop.id;

      return <CropImage status={status[index]} key={id} crop={crop} />;
    });

    await this.setState({
      crop_images: crop_items
    });
  }
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
            <ButtonContainer id="export-button-container"></ButtonContainer>
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
            <ImageContainer>
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
                "검수한 작업을 가져오는 중..."
              )}
            </ImageContainer>
          </LeftMainContainer>
          {/* Main Container 의 오른쪽 영역 */}
        </MainContainer>
        <StepButtonContainer></StepButtonContainer>
      </BodyContainer>
    );
  }
}

export default InspectionPage;
