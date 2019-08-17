import React, { Component } from "react";
import Header from "./Header";
import Body from "./Body";
import styled from "styled-components";
import InspectionPage from "../inspectionPage/InspectionPage";

const WorkContainer = styled.div`
  width: 100%;
`;

class WorkPage extends Component {
  render() {
    const info = this.props.location.state;

    return (
      <WorkContainer>
        <Header />
        {this.props.match.params.project_type === "normal" ? (
          <Body
            info={info}
            project_type={this.props.match.params.project_type}
            project_id={this.props.match.params.project_id}
          />
        ) : (
          <InspectionPage
            project_type={this.props.match.params.project_type}
            project_id={this.props.match.params.project_id}
          />
        )}
      </WorkContainer>
    );
  }
}

export default WorkPage;
