import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import AuthForm from "./components/auth/AuthForm/AuthForm";
import FetchTest from "./components/test/FetchTest/FetchTest";
import Login from "./components/auth/AuthForm/login";
import Logout from "./components/auth/AuthForm/logout";

function Main() {
  return <h1>Welcome to DALA!</h1>;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false
    };
  }

  render() {
    return (
      <Router>
        <header>
          <Link to="/mypage/main">마이페이지</Link>
        </header>
        <Route path="/" exact component={Main} />
        <Route path="/mypage" component={FetchTest} />
        <Route path="/auth/signup" component={AuthForm} />
        <Route path="/auth/signin" component={Login} />
        <Route path="/auth/signout" component={Logout} />
      </Router>
    );
  }
}

export default App;
