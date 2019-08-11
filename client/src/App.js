import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from 'styled-components';
import "./App.css";
import SignUp from "./components/auth/SignUp";
import MyPage from "./components/mypage/MyPage";
import SignIn from "./components/auth/SignIn";
import SignOut from "./components/auth/SignOut";
import ProjectsPage from "./components/projectsPage/ProjectsPage";
import Main from './components/main/Main';
import Select from "./components/auth/Select";

const AppContainer = styled.div`
  width: 100%;
  heigth: 100vh;
`;

class App extends React.Component {
  render() {
    return (
      <AppContainer>
        <Router>
          <Route path="/" exact component={Main} />
          <Route path="/mypage" component={MyPage} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/signin/select" component={Select} />
          <Route path="/auth/signup" component={SignUp} />
          <Route path="/auth/signin" component={SignIn} />
          <Route path="/auth/signout" component={SignOut} />
        </Router>
      </AppContainer>
    );
  }
}

export default App;
