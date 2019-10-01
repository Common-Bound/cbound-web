import React, { Component } from "react";
import styled from "styled-components";

const WorkContainer = styled.div`
  width: 100%;
`;

class ProjectInsightPage extends Component {
  /* Fetch 응답 data =>
        data = {
               
        }
    */

  render() {
    const info = this.props.location.state;
    console.log(info);

    return (
      <WorkContainer>
        {this.props.match.params.project_type}
        {this.props.match.params.project_id}
      </WorkContainer>
    );
  }
}

export default ProjectInsightPage;
