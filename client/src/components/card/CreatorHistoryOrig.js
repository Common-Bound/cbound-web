import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";

const StyledTableRow = styled(TableRow)`
  transition: 0.2s;
  cursor: pointer;
  :hover {
    background-color: lightgrey;
  }
`;

class CreatorHistoryOrig extends Component {
  render() {
    const created_time = moment(this.props.created_at, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    return (
      <StyledTableRow>
        <TableCell align="center">{created_time}</TableCell>
        <TableCell align="center">{this.props.title}</TableCell>
        <TableCell align="center">{this.props.point}</TableCell>
        <TableCell align="center">{this.props.project_type}</TableCell>
        <TableCell align="center">{this.props.status}</TableCell>
      </StyledTableRow>
    );
  }
}

export default CreatorHistoryOrig;
