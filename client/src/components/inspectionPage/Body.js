import React, { Component } from "react";
import styled from "styled-components";
import Inspect1By1 from "./Inspect1By1";
import moment from "moment";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";

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
  width: 640px;
  height: ${props => (props.show ? "440px" : "none")};
  max-width: 640px
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

const Main = styled.div`
  position: relative;
`;

const StyledImg = styled.img`
  width: 640px;
  max-width: 640px;
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
      is_crops_correct: []
    };
    this.handleClick = this.handleClick.bind(this);

    this.clickO = this.clickO.bind(this);
    this.clickX = this.clickX.bind(this);
    this.handleEndInspect = this.handleEndInspect.bind(this);
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

    return new Promise(resolve => {
      console.log("drawImage end");
      return resolve(this.drawCrop());
    });
  }

  /**
   * @dev 원본 이미지를 그린 다음 그 위에 크롭 영역을 그려준다
   */
  async drawCrop() {
    const canvas = document.getElementById("canvas");
    const image = document.getElementById("image");
    const ctx = canvas.getContext("2d");

    console.log(image.naturalWidth, canvas.width);

    console.log(this.state.data.payload.meta.crop_image);
    this.state.data.payload.meta.crop_image.forEach(function(crop) {
      const id = crop.id;
      const x = crop.x;
      const y = crop.y;
      const width = crop.width;
      const height = crop.height;
      const crop_label = crop.label;

      // 사각형 그려주기
      const rect = document.createElement("div");
      document.getElementById("main").appendChild(rect);

      rect.setAttribute("id", `crop_image_${id}`);
      rect.setAttribute("class", "crop_images");
      rect.setAttribute("name", crop_label);
      rect.setAttribute("status", false);

      rect.setAttribute(
        "style",
        `
        border: 1px solid grey;
        background-color: rgba(0, 0, 0, 0.3);
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: ${width}px;
        height: ${height}px;
        
      `
      );

      // 마우스 enter 이벤트 추가
      rect.onmouseenter = function() {
        // label 생성
        const label = document.createElement("div");
        label.setAttribute("id", `crop_image_label_${id}`);
        label.setAttribute(
          "style",
          `
        background-color: yellow;
        font-size: 20px;
        font-family: Helvetica;
        position: absolute;
        top: -30px;
        left: 0px;
        width: ${crop_label.length * 14}px;
        height: 30px;
        z-index: 1;
        `
        );
        label.innerHTML = crop_label;

        document.getElementById(`crop_image_${id}`).appendChild(label);
      };

      // 마우스 leave 이벤트 추가
      rect.onmouseleave = function() {
        const label = document.getElementById(`crop_image_label_${id}`);
        document.getElementById(`crop_image_${id}`).removeChild(label);
      };

      // 마우스 click 이벤트 추가
      rect.onclick = function() {
        function toggleStatus() {
          const status = document
            .getElementById(`crop_image_${id}`)
            .getAttribute("status");
          const newStatus = status === "false" ? "true" : "false";
          document
            .getElementById(`crop_image_${id}`)
            .setAttribute("status", newStatus);
        }

        toggleStatus();
        const status = document
          .getElementById(`crop_image_${id}`)
          .getAttribute("status");

        if (status === "true") {
          rect.style.border = "2px solid lime";
        } else {
          rect.style.border = "2px solid red";
        }
      };
    });
  }

  // 검수 완료 버튼
  handleClick = async e => {
    let new_crop_image = [];
    // ok 라고 응답하면 모든 crop_image의 각 correct 배열에 1(OK)를 추가한다
    if (e.target.name !== "nok") {
      if (e.target.name === "notAssociated") {
        new_crop_image = this.state.data.payload.meta.crop_image.map(el => {
          el.correct.push(0);
          return el;
        });
      } else if (e.target.name === "ok") {
        new_crop_image = this.state.data.payload.meta.crop_image.map(el => {
          el.correct.push(1);
          return el;
        });
      }

      const url = "/mypage/task/inspection";
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
    } else {
      // 하나하나 봐가면서 Crop OX 해야함
      this.setState({
        needCropAll: true
      });
    }
  };

  handleReset = async e => {
    const url = "/mypage/task/inspection";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reset: true })
    })
      .then(res => res.json())
      .then(data => {
        return new Promise(resolve => resolve(console.log(data)));
      });
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

  clickO() {
    this.setState(
      {
        nowCropImgId: this.state.nowCropImgId + 1,
        is_crops_correct: this.state.is_crops_correct.concat(1)
      },
      () => {
        console.log(this.state.is_crops_correct);
      }
    );
  }

  clickX() {
    this.setState({
      nowCropImgId: this.state.nowCropImgId + 1,
      is_crops_correct: this.state.is_crops_correct.concat(0)
    });
  }

  async handleEndInspect() {
    let new_crop_image = [];
    let cnt = 0;

    new_crop_image = this.state.data.payload.meta.crop_image.map(el => {
      el.correct.push(this.state.is_crops_correct[cnt++]);
      return el;
    });

    const url = "/mypage/task/inspection";
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

    console.log(new_crop_image);
    await this.sendData(url, option);
    await this.fetchData();
  }

  render() {
    const { data, loading } = this.state;

    const t1 = moment();
    const t2 = moment(data ? data.due_date : Infinity);

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
      if (loading) {
        return <div>검수 작업 가져오는 중...</div>;
      } else {
        return (
          <BodyContainer>
            <EntireTitleContainer>
              <LeftTitleContainer>
                <LeftTitleDate>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    MISSION
                  </span>
                  {` ${moment(data.created_at).format("YYYY-MM-DD")} - ${moment(
                    data.due_date
                  ).format("YYYY-MM-DD")}`}
                </LeftTitleDate>
              </LeftTitleContainer>
              <RightTitleContainer>
                <RightTitle>DEADLINE</RightTitle>
                <RightTitleDate>{`${days} DAYS : ${hours} HOURS : ${minutes} MINUTES`}</RightTitleDate>
              </RightTitleContainer>
            </EntireTitleContainer>
            <header>
              <p>데이터 생산 시각: {data.created_at}</p>
              <p>프로젝트 ID: {data.project_id}</p>
              <p>데이터 생산자 ID: {data.creator_id}</p>
              <p>스케줄링 상태: {data.schedule_state}</p>
            </header>
            <Main id="main">
              <canvas id="canvas">
                <div style={{ display: "none" }}>
                  <StyledImg
                    id="image"
                    src={data.payload.orig_image}
                    alt=""
                    onLoad={this.drawImage.bind(this)}
                  />
                </div>
              </canvas>
              <p>문제가 없는 사진인가요?</p>
              {true ? (
                <button onClick={this.handleClick} name="ok">
                  예(다음 작업 가져오기)
                </button>
              ) : (
                ""
              )}
              <button onClick={this.handleClick} name="nok">
                아니오(어떤 크롭이 잘못된지 표시하기)
              </button>
              <button onClick={this.handleClick} name="notAssociated">
                프로젝트와 관련없는 사진입니다
              </button>
              <button onClick={this.handleReset.bind(this)} name="reset">
                모든 작업 초기화(스케줄 상태 + 검수 내역 삭제)
              </button>
            </Main>
          </BodyContainer>
        );
      }
    }
  }
}

export default Body;
