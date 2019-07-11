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
          return alert(data.result);
        }
      })
      .catch(err => {
        return console.log(err);
      });
  };

  render() {
    return (
      <div>
        <h1>제목: {this.props.title}</h1>
        <h6>id: {this.props.id}</h6>
        <button onClick={this.handleClick}>참여하기</button>
      </div>
    );
  }
}

export default Project;
