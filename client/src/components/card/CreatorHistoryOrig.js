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

const StyledTableCell = styled(TableCell)`
  color: ${props => (props.project_type ? "black" : "blue")} !important;
`;

class CreatorHistoryOrig extends Component {
  render() {
    const created_time = moment(this.props.date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    return (
      <StyledTableRow>
        <TableCell align="center">{created_time}</TableCell>
        <StyledTableCell align="center" project_type={this.props.project_type}>
          {this.props.project_type ? "생성" : "검수"}
        </StyledTableCell>
        <TableCell align="center">{this.props.title}</TableCell>
        <TableCell align="center">{this.props.reward}</TableCell>
        <TableCell align="center">
          {this.props.status ? this.props.status : "-"}
        </TableCell>
      </StyledTableRow>
    );
  }
}

export default CreatorHistoryOrig;
