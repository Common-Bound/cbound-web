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

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  signIn = () => {
    this.setState({
      auth: true
    });
  };

  signOut = () => {
    this.setState({
      auth: false
    });
  };

  render() {
    return (
      <Router>
        <header>
          {this.state.auth ? (
            <Link to="/auth/signout">로그아웃</Link>
          ) : (
            <Link to="/auth/signin">로그인</Link>
          )}
          <Link to="/mypage">마이페이지</Link>
        </header>
        <Route path="/" exact component={Main} />
        <Route path="/mypage" component={FetchTest} />
        <Route path="/auth/signup" component={AuthForm} />
        <Route
          path="/auth/signin"
          render={props => <Login {...props} signIn={this.signIn} />}
        />
        <Route
          path="/auth/signout"
          render={props => <Logout {...props} signOut={this.signOut} />}
        />
      </Router>
    );
  }
}

export default App;
