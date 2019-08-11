import React, { Component } from "react";
import styled from "styled-components";

const Main = styled.div`
  position: relative;
`;

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      correct: [],
      needCropAll: false,
      nowCropImgId: 0
    };
    this.handleClick = this.handleClick.bind(this);
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
    console.log("fetchData");
    this.setState({
      loading: true
    });
    const url = "/mypage/task/inspection";
    console.log(url);
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
    console.log(image);

    const ctx = canvas.getContext("2d");

    let scale = 1;
    // 이미지의 가로 길이가 720이 넘으면, 720으로 나눈 비율을 계산한다
    if (image.naturalWidth > 720) {
      scale = image.naturalWidth / 720;
    }

    // 계샨된 비율만큼 나눠줘서 캔버스 영역의 가로 길이를 720 으로 맞춰준다
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
    const ctx = canvas.getContext("2d");

    console.log(this.state.data.payload.meta.crop_image);
    this.state.data.payload.meta.crop_image.forEach(function(crop) {
      const x = crop.x;
      const y = crop.y;
      const width = crop.width;
      const height = crop.height;

      // 사각형 그려주기

      const rect = document.createElement("div");
      document.getElementById("main").appendChild(rect);

      rect.setAttribute(
        "style",
        `
        border: 1px dotted red;
        background-color: rgba(0, 0, 0, 0.2);
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: ${width}px;
        height: ${height}px;
      `
      );
      rect.setAttribute("name", crop.label);
      rect.onmouseenter = function() {
        console.log(this.getAttribute("name"));
      };

      // 사각형 바운딩 박스 그려준다
      ctx.strokeStyle = "yellow";
      ctx.rect(x, y, width, height);
      ctx.stroke();

      // 라벨이 존재하면 그려준다
      if (crop.label) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y - 16, crop.label.length * 10, 16);

        ctx.fillStyle = "black";
        ctx.font = "16px serif";
        ctx.fillText(crop.label, x, y);
      }
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

  render() {
    const { data, loading } = this.state;

    if (this.state.needCropAll) {
      return <div>검수할 크롭 이미지가 나올 영역</div>;
    } else {
      if (loading) {
        return <div>검수 작업 가져오는 중...</div>;
      } else {
        return (
          <div>
            <header>
              <p>데이터 생산 시각: {data.created_at}</p>
              <p>프로젝트 ID: {data.project_id}</p>
              <p>데이터 생산자 ID: {data.creator_id}</p>
              <p>스케줄링 상태: {data.schedule_state}</p>
            </header>
            <Main id="main">
              <canvas id="canvas">
                <div style={{ display: "none" }}>
                  <img
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
                연관성이 없는 사진
              </button>
              <button onClick={this.handleReset.bind(this)} name="reset">
                모든 작업 초기화(스케줄 상태 + 검수 내역 삭제)
              </button>
            </Main>
          </div>
        );
      }
    }
  }
}

export default Body;
