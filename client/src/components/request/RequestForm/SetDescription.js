import React, { Component } from "react";

class SetDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      basicLang: "",
      simpleDesc: "",
      detailDesc: "",
      type: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async e => {
    e.preventDefault();
  };

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}

export default SetDescription;
