import React, { Component } from "react";
import Body from "./Body";

class InspectionPage extends Component {
  render() {
    return (
      <div>
        <Body info={this.props.info} project_id={this.props.project_id} />
      </div>
    );
  }
}
export default InspectionPage;