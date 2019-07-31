import React, { Component } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import ProjectsPage from '../projectsPage/ProjectsPage';
import WorkPage from '../workPage/WorkPage';
import AvailableProjects from './AvailableProjects';

class MyPage extends Component {
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
      </div >
    );
  }
}

export default MyPage;
