import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Project_joined extends Component {
  render() {
    return (
      <div>
        <Link to={`/mypage/task/${this.props.id}`} ><h2>제목: {this.props.title}</h2></Link>
        <h3>{this.props.simple_description}</h3>
        <h3>보상: {this.props.reward}</h3>
        <br></br>
        <h4>{this.props.detail_description}</h4>
      </div>
    );
  }
}

export default Project_joined;