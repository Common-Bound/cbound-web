import React, { Component } from "react";
import { Route } from "react-router-dom";
import Main from "./RequesterMain";
import styled from "styled-components";

const WorkContainer = styled.div`
  width: 100%;
`;

class InsightPage extends Component {
  render() {
    const info = this.props.location.state;
    const project_id = this.props.match.params.project_id;
    console.log(info);

    return (
      <WorkContainer>
        <Route
          exact
          path={`${this.props.location.pathname}`}
          render={props => (
            <Main {...props} info={info} project_id={project_id} />
          )}
        />
      </WorkContainer>
    );
  }
}

export default InsightPage;