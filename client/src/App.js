import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import SignUp from "./components/auth/SignUp";
import MyPage from "./components/mypage/MyPage";
import SignIn from "./components/auth/SignIn";
import SignOut from "./components/auth/SignOut";
//import Main from "./components/main/Main";
import Select from "./components/auth/Select";
import notFound from "./components/notFound";
import buildTest from "./buildTest";

const AppContainer = styled.div`
  width: 100%;
  heigth: 100vh;
`;

class App extends React.Component {
  render() {
    return (
      <AppContainer>
        <Router>
          <Switch>
            <Route path="/" exact component={buildTest} />
            <Route path="/mypage" component={MyPage} />
            <Route path="/signin/select" component={Select} />
            <Route path="/auth/:user_type/signup" component={SignUp} />
            <Route path="/auth/:user_type/signin" component={SignIn} />
            <Route path="/auth/signout" component={SignOut} />
            <Route component={notFound} />
          </Switch>
        </Router>
      </AppContainer>
    );
  }
}

export default App;
