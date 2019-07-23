import React, { Component } from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

class WorkPage extends Component {
  render() {
    const workContainer = {
      margin: "20px auto",
      maxWidth: "720px"
    };

    return (
      <div style={workContainer}>
        <Header />
        <Body />
      </div>
    );
  }
}

export default WorkPage;
