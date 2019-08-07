import React, { Component } from "react";
import Header from "./Header";
import Body from "./Body";
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import Footer from "./Footer";
import InspectionPage from '../inspectionPage/InspectionPage';

const WorkContainer = styled.div`
  margin: 20px auto;
  max-width: 720px;
`;

class WorkPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {

    return (
      <WorkContainer>
        <Header />
        {this.props.match.params.project_type === 'normal' ?
          <Body project_type={this.props.match.params.project_type}
            project_id={this.props.match.params.project_id} /> :
          <InspectionPage project_type={this.props.match.params.project_type}
            project_id={this.props.match.params.project_id} />
        }
      </WorkContainer>
    );
  }
}

export default WorkPage;
