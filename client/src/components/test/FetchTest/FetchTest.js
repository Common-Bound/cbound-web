import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

class FetchTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: ""
    };
    const url = "/mypage/main";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ data: data.result, loading: false });
      })
      .catch(err => {
        console.log(err);
      });
  }
  async componentDidMount() {
    /*const url = "https://api.randomuser.me/";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ person: data.results[0], loading: false });*/
  }

  render() {
    if (this.state.loading) {
      return <div>로딩 중...</div>;
    }

    if (this.state.data === true) {
      console.log("로그인 성공");
      return (
        /*<div>
          <div>{this.state.person.name.title}</div>
          <div>{this.state.person.name.first}</div>
          <div>{this.state.person.name.last}</div>
          <img src={this.state.person.picture.large} />
        </div>*/
        <div>
          <h1>마이페이지</h1>
          <Link to="/auth/signout">로그아웃</Link>
        </div>
      );
    }
    if (this.state.data === false) {
      console.log("로그인 실패");
      return <Redirect to="/auth/signin" />;
    }
  }
}

export default FetchTest;
