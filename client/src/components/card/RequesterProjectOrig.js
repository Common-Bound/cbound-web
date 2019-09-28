import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Link } from "react-router-dom";
import moment from "moment";

const StyledTableRow = styled(TableRow)`
  transition: 0.2s;
  cursor: pointer;
  :hover {
    background-color: lightgrey;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none !important;
  color: black !important;
`;

class CreatorProjectJoined extends Component {
  render() {
    const created_time = moment(this.props.created_at, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const due_date_time = moment(this.props.due_date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    return (
      <StyledTableRow>
        <TableCell align="center">{created_time}</TableCell>
        <TableCell align="center">
          <StyledLink
            to={{
              pathname: `/mypage/requester/insight/${this.props.project_type}/${this.props.id}`,
              state: {
                title: this.props.title,
                created_at: this.props.created_at,
                due_date: this.props.due_date
              }
            }}
          >
            {this.props.title}
          </StyledLink>
        </TableCell>
        <TableCell align="center">{this.props.reward}</TableCell>
        <TableCell align="center">{due_date_time}</TableCell>
      </StyledTableRow>
    );
  }
}

export default CreatorProjectJoined;
