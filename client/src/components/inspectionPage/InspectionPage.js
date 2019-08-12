import React, { Component } from "react";
import styled from "styled-components";
import Body from "./Body";

class InspectionPage extends Component {
  render() {
    return (
      <div>
        <Body project_id={this.props.project_id} />
      </div>
    );
  }
}
export default InspectionPage;
