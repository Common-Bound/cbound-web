import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import AuthForm from "./components/auth/AuthForm/AuthForm";
import FetchTest from "./components/test/FetchTest/FetchTest";
import Login from "./components/auth/AuthForm/login";

function Main() {
  return (
    <h1>
      <Link to="/auth/signin">로그인</Link>
      <Link to="/auth/signup">회원가입</Link>
      <Link to="/test">마이페이지</Link>
    </h1>
  );
}

function App() {
  return (
    <Router>
      <Route path="/" exact component={Main} />
      <Route path="/test" component={FetchTest} />
      <Route path="/auth/signup" component={AuthForm} />
      <Route path="/auth/signin" component={Login} />
    </Router>
  );
}

export default App;
