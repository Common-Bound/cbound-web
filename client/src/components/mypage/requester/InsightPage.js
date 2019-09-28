import React, { Component } from "react";
import Main from "./RequesterMain";
import styled from "styled-components";

const WorkContainer = styled.div`
  width: 100%;
`;

class InsightPage extends Component {
  render() {
    const info = this.props.location.state;
    console.log(info);

    return (
      <WorkContainer>
        <Main info={info} project_id={this.props.match.params.project_id} />
      </WorkContainer>
    );
  }
}

export default InsightPage;
