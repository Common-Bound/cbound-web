import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Project from "../card/Project";

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      session: "",
      projects: []
    };
  }

  async componentDidMount() {
    const url = this.props.match.path;
    const result = await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ session: data.result, loading: false });
        return new Promise(resolve => {
          resolve(data.result);
        });
      })
      .catch(err => {
        console.log(err);
      });

    // 만약 세션이 존재한다면 프로젝트 목록을 불러온다
    if (result === true) {
      const url = "/mypage/projects";
      fetch(url)
        .then(res => res.json())
        .then(data => {
          //console.log(data);
          const my_proj = data.result.map(el => {
            return <Project key={el.id} id={el.id} title={el.title} />;
          });
          this.setState({
            projects: my_proj
          });
        });
    }
  }

  render() {
    if (this.state.loading) {
      return <div>로딩 중...</div>;
    }

    if (this.state.session === true) {
      return (
        <div>
          <h1>마이페이지</h1>
          <h2>참여한 프로젝트 목록</h2>
          <ul>{this.state.projects}</ul>
          <Link to="/auth/signout">로그아웃</Link>
        </div>
      );
    }
    if (this.state.session === false) {
      return <Redirect to="/auth/signin" />;
    }
  }
}

export default MyPage;
