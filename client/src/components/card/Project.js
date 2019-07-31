import React, { Component } from "react";

class Project extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = e => {
    const url = "/projects/join";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        proj_id: this.props.id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          alert(data.result);

        }
      })
      .catch(err => {
        return console.log(err);
      });
  };

  render() {
    return (
      <div>
        <h1 onClick={this.handleClick}>제목: {this.props.title}</h1>
        <h2>{this.props.simple_description}</h2>
        <h2>보상: {this.props.reward}</h2>
        <br></br>
        <h3>{this.props.detail_description}</h3>
      </div>
    );
  }
}

export default Project;
