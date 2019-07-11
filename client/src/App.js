import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import SignUp from "./components/auth/SignUp";
import MyPage from "./components/mypage/MyPage";
import SignIn from "./components/auth/SignIn";
import SignOut from "./components/auth/SignOut";
import ProjectRequest from "./components/request/ProjectRequest";
import Projects from "./components/projects/Projects";

function Main() {
  return <h1>Welcome to DALA!</h1>;
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <header>
          <Link to="/mypage">마이페이지</Link>
          <Link to="/projects">프로젝트 목록</Link>
        </header>

        <body>
          <div>
            <ProjectRequest />
          </div>
        </body>
        <Route path="/" exact component={Main} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/projects" component={Projects} />
        <Route path="/auth/signup" component={SignUp} />
        <Route path="/auth/signin" component={SignIn} />
        <Route path="/auth/signout" component={SignOut} />
      </Router>
    );
  }
}

export default App;
