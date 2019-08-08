import React, { Component } from 'react';

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * @dev 검수 작업을 위해 현재 queued된 데이터를 가져온다
   *      이때, 자신이 참여하지 않았고 시간순서로 제일 앞선
   *      첫 번째 데이터를 가져온다
   */
  async fetchData() {
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
        <p>데이터 생산 시각: {data.created_at}</p>
        <p>프로젝트 ID: {data.project_id}</p>
        <p>데이터 생산자 ID: {data.creator_id}</p>
        <p>스케줄링 상태: {data.schedule_state}</p>
        <img src={data.payload.orig_image} alt='' />
        <button onClick={this.handleClick.bind(this)}>작업 완료(상태 'queued'로 변경)</button>
      </div>
    );
  }
}

export default Body;