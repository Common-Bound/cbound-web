import React, { Component } from "react";
import Main from "./CreatorMain";
import styled from "styled-components";
import InspectionPage from "../inspectionPage/InspectionPage";

const WorkContainer = styled.div`
  width: 100%;
`;

class WorkPage extends Component {
  render() {
    const info = this.props.location.state;
    console.log(info);

    return (
      <WorkContainer>
        {this.props.match.params.project_type === "normal" ? (
          <Main
            info={info}
            project_type={this.props.match.params.project_type}
            project_id={this.props.match.params.project_id}
          />
        ) : this.props.match.params.project_type === "inspection" ? (
          <InspectionPage
            info={info}
            project_type={this.props.match.params.project_type}
            project_id={this.props.match.params.project_id}
          />
        ) : (
          <Main />
        )}
      </WorkContainer>
    );
  }
}

export default WorkPage;
