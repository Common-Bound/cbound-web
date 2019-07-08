import React from "react";
import "./App.css";
import AuthForm from "./components/auth/AuthForm/AuthForm";
import FetchTest from "./components/test/FetchTest/FetchTest";

function App() {
  return (
    <div>
      <FetchTest />
      <AuthForm />
    </div>
  );
}

export default App;
