import React, { Component } from "react";
import styled from "styled-components";
import InspectionPage from "./InspectionPage";
import NormalPage from "./NormalPage";

const HistoryContainer = styled.div`
  width: 100%;
`;

class HistoryPage extends Component {
  render() {
    const info = this.props.location.state;
    console.log(info);

    return (
      <HistoryContainer>
        {this.props.match.params.project_type === "normal" ? (
          <NormalPage info={info} data_id={this.props.match.params.data_id} />
        ) : (
          <InspectionPage
            info={info}
            data_id={this.props.match.params.data_id}
          />
        )}
      </HistoryContainer>
    );
  }
}

export default HistoryPage;
