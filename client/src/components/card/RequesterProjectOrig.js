import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Redirect } from "react-router-dom";
import moment from "moment";

const StyledTableRow = styled(TableRow)`
  transition: 0.2s;
  cursor: pointer;

  :hover {
    background-color: lightgrey;
  }
`;

const StyledTableCell = styled(TableCell)`
  word-break: keep-all;

  @media (max-width: 500px) {
    padding: 8px !important;
    font-size: 12px !important;
  }
`;

const StyledDateTableCell = styled(StyledTableCell)`
  @media(max-width: 500px){
    font-size: 10px !important;
  })
`;

class CreatorProjectJoined extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
  }

  handleClick() {
    this.setState({
      clicked: true
    });
  }

  render() {
    const created_time = moment(this.props.created_at, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const due_date_time = moment(this.props.due_date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    return (
      <StyledTableRow onClick={this.handleClick.bind(this)}>
        <StyledDateTableCell align="center">{created_time}</StyledDateTableCell>
        <StyledTableCell align="center">{this.props.title}</StyledTableCell>
        <StyledTableCell align="center">{this.props.reward}</StyledTableCell>
        <StyledDateTableCell align="center">
          {due_date_time}
        </StyledDateTableCell>
        {this.state.clicked ? (
          <Redirect
            to={{
              pathname: this.props.ref_project
                ? `/mypage/requester/insight/${this.props.ref_project}`
                : `/mypage/requester/insight/${this.props.id}`,
              state: {
                title: this.props.title,
                created_at: this.props.created_at,
                due_date: this.props.due_date
              }
            }}
          />
        ) : (
          undefined
        )}
      </StyledTableRow>
    );
  }
}

export default CreatorProjectJoined;
