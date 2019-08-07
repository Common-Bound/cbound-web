import React, { Component } from "react";
import ProjectJoined from "../card/Project_joined";

class ProjectsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.fetchProject();
  }

  /**
   * @description 내가 참여한 프로젝트 목록을 가져온다
   *
   * @memberof ProjectsPage
   */
  async fetchProject() {
    const url = this.props.match.path;
    console.log(url);
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          return alert(data.message);
        }
        if (data.result) {
          console.log(data);
          const new_projects = data.result.map(el => {
            return (
              <ProjectJoined
                key={el.id}
                id={el.id}
                title={el.title}
                simple_description={el.simple_description}
                detail_description={el.detail_description}
                due_date={el.due_date}
                created_at={el.created_at}
                type={el.type}
                project_type={el.project_type}
                guideline_url={el.guideline_url}
                reward={el.reward}
              />
            );
          });
          this.setState({
            projects: new_projects
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

export default ProjectsPage;
