import React, { Component } from "react";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    const url = this.props.match.path;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          console.log(data);
          this.setState({
            projects: data.result
          });
        }
      });
  }
  render() {
    return (
      <div>
        <ul>{this.state.projects}</ul>
      </div>
    );
  }
}

export default Projects;
