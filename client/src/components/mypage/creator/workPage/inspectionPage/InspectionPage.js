import React, { Component } from "react";
import Body from "./Body";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

class InspectionPage extends Component {
  render() {
    return (
      <Container>
        <Body info={this.props.info} project_id={this.props.project_id} />
      </Container>
    );
  }
}
export default InspectionPage;
