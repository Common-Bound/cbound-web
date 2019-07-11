import React, { Component } from "react";
import Project from "../card/Project";

class ProjectsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async fetchProject() {
    const url = this.props.match.path;
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          return alert(data.message);
        }
        if (data.result) {
          console.log(data);
          const new_projects = data.result.map(el => {
            return <Project key={el.id} id={el.id} title={el.title} />;
          });
          this.setState({
            projects: new_projects
          });
        }
      });
  }

  componentDidMount() {
    this.fetchProject();
  }

  handleClick = e => {
    const url = this.props.match.path;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.fetchProject();
      });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>랜덤 프로젝트 추가</button>
        <ul>{this.state.projects}</ul>
      </div>
    );
  }
}

export default ProjectsPage;
