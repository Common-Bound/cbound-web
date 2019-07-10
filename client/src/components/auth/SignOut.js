import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class SignOut extends Component {
  render() {
    const url = this.props.match.path; // /auth/signout
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
    return (
      <div>
        <Redirect to="/" />
      </div>
    );
  }
}

export default SignOut;
