import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import SignUp from "./components/auth/SignUp";
import MyPage from "./components/mypage/MyPage";
import SignIn from "./components/auth/SignIn";
import SignOut from "./components/auth/SignOut";
import WorkPage from "./components/workPage/WorkPage";
import ProjectsPage from "./components/projectsPage/ProjectsPage";
import TestForm from "./TestForm";
import Select from "./components/auth/Select";

function Main() {
  return (
    <div>
      <h1>Welcome to DALA!</h1>
      <header>
        <Link to="/signin/select">로그인</Link>
      </header>
    </div>
  );
}

function Header() {
  return (
    <header>
      <Link to="/mypage">마이페이지</Link>
      <Link to="/projects">프로젝트 목록</Link>
    </header>
  );
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Route path="/" exact component={Main} />
          <Route path="/mypage" component={MyPage} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/signin/select" component={Select} />
          <Route path="/auth/signup" component={SignUp} />
          <Route path="/auth/signin" component={SignIn} />
          <Route path="/auth/signout" component={SignOut} />
        </Router>
      </div>
    );
  }
}

export default App;
