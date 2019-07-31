import React, { Component } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import ProjectsPage from '../projectsPage/ProjectsPage';
import WorkPage from '../workPage/WorkPage';
import AvailableProjects from './AvailableProjects';
import Project from "../card/Project";

class MyPage extends Component {

  handleClick = e => {
    const url = this.props.match.path;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.fetchProject();
      });
  };

  render() {
    return (
      <div>
        <h1>마이페이지</h1>
        <header>
          <Link to={`${this.props.match.url}`}>참여 가능한 프로젝트 목록</Link>
          <Link to={`${this.props.match.url}/projects`}>참여한 프로젝트 목록</Link>
          <Link to={`${this.props.match.url}/task`}>작업 페이지</Link>
          <Link to="/auth/signout">로그아웃</Link>
        </header>
        <Route exact path={`${this.props.match.url}`} component={AvailableProjects} />
        <Route path={`${this.props.match.url}/projects`} component={ProjectsPage} />
        <Route path={`${this.props.match.url}/task`} component={WorkPage} />
        <button onClick={this.handleClick.bind(this)}>랜덤 프로젝트 추가</button>
      </div >
    );
  }
}

export default MyPage;
