import React, { Component } from 'react';
import styled from 'styled-components';

const Main = styled.div`
  display: flex;
`;

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      imgSrc: null
    }
    this.imageRef = React.createRef();
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
    console.log('fetchData');
    this.setState({
      loading: true
    })
    const url = '/mypage/task/inspection'
    console.log(url);
    await fetch(url)
      .then(res => res.json())
      .then(result => {
        if (result.message) {
          return alert(result.message);
        }
        else {
          const data = result.result;
          console.log(data);

          return new Promise(resolve =>
            resolve(this.setState({
              data: data,
              loading: false
            })
            )
          );
        }
      });
  }

  async drawImage(e) {
    console.log('drawImage');
    console.log(e);
    const canvas = document.getElementById('canvas');
    const image = document.getElementById('image');
    console.log(image);

    const ctx = canvas.getContext('2d');

    //const image = new Image(); // Using optional size for image
    // Load an image of intrinsic size 300x227 in CSS pixels
    //image.src = this.state.data.payload.orig_image;
    let scale = 1;
    if (image.naturalWidth > 720) {
      scale = image.naturalWidth / 720;
    }

    // Use the intrinsic size of image in CSS pixels for the canvas element
    canvas.width = image.width / scale;
    canvas.height = image.height / scale;

    // Will draw the image as 300x227, ignoring the custom size of 60x45
    // given in the constructor
    ctx.drawImage(image, 0, 0);

    // To use the custom size we'll have to specify the scale parameters 
    // using the element's width and height properties - lets draw one 
    // on top in the corner:
    ctx.drawImage(image, 0, 0, image.width / scale, image.height / scale);

    return new Promise((resolve) => {
      console.log('drawImage end');
      return resolve(this.drawCrop());
    })
  }

  async drawCrop() {
    console.log('drawCrop');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    console.log(this.state.data.payload.meta.crop_image);
    this.state.data.payload.meta.crop_image.forEach(function (crop) {
      const x = crop.x;
      const y = crop.y;
      const width = crop.width;
      const height = crop.height;

      ctx.strokeStyle = "yellow";
      ctx.rect(x, y, width, height);

      if (crop.label) {
        ctx.fillStyle = 'yellow'
        ctx.fillRect(x, y - 16, crop.label.length * 10, 16);

        ctx.fillStyle = 'black';
        ctx.font = '16px serif';

        ctx.fillText(crop.label, x, y);
      }

      ctx.stroke();

    });
    console.log('drawCrop end');
  }

  handleClick = e => {
    const url = '/mypage/task/inspection';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: this.state.data })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  }


  render() {
    const { data, loading } = this.state;

    if (loading) {
      return (
        <div>
          검수 작업 가져오는 중...
        </div>
      )
    }
    else return (
      <div>
        <header>
          <p>데이터 생산 시각: {data.created_at}</p>
          <p>프로젝트 ID: {data.project_id}</p>
          <p>데이터 생산자 ID: {data.creator_id}</p>
          <p>스케줄링 상태: {data.schedule_state}</p>
        </header>
        <Main>
          <canvas id="canvas">
            <div style={{ display: 'none' }} >
              <img id="image" src={data.payload.orig_image} alt="" onLoad={this.drawImage.bind(this)} />
            </div>
          </canvas>
        </Main>

        {true ? '' : <button onClick={this.handleClick.bind(this)}>작업 완료(상태 'queued'로 변경)</button>}
      </div>
    );
  }
}

export default Body;