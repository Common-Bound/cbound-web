import React from "react";
import "./App.css";
import AuthForm from './components/auth/AuthForm/AuthForm';
import FetchTest from './components/test/FetchTest/FetchTest';

function App() {
  const handleClick = e => {
    const url = "/users/1";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  };

  return (
    <div>
      <FetchTest />
    </div>
  );
}

export default App;
