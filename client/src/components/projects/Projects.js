import React, { Component } from "react";
import ProjectRequest from "../request/ProjectRequest";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateProject: false,
      projects: []
    };

    this.toggleProjectCreate = this.toggleProjectCreate.bind(this);
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

  toggleProjectCreate() {
    this.setState({
      isCreateProject: !this.state.isCreateProject
    });
  }

  render() {
    if (this.state.isCreateProject) {
      return (
        <div>
          <ProjectRequest />
        </div>
      );
    } else {
      return (
        <div>
          <div>
            <ul>{this.state.projects}</ul>
          </div>
          <div>
            <input
              type="button"
              onClick={this.toggleProjectCreate}
              value="프로젝트 생성"
            />
          </div>
        </div>
      );
    }
  }
}

export default Projects;
