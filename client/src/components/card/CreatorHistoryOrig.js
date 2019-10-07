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

const StyledTitleTableCell = styled(StyledTableCell)`
  color: ${props => (props.project_type ? "black" : "blue")} !important;
`;

const StyledStatusTableCell = styled(StyledTableCell)`
  color: ${props =>
    props.status === "created"
      ? "blue"
      : props.status === "done"
      ? "green"
      : "red"} !important;
`;

class CreatorHistoryOrig extends Component {
  render() {
    const created_time = moment(this.props.date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    return (
      <StyledTableRow>
        <StyledDateTableCell align="center">{created_time}</StyledDateTableCell>
        <StyledTitleTableCell
          align="center"
          project_type={this.props.project_type}
        >
          {this.props.title}({this.props.project_type ? "생성" : "검수"})
        </StyledTitleTableCell>
        <StyledTableCell align="center">{this.props.reward}</StyledTableCell>
        <StyledStatusTableCell align="center" status={this.props.status}>
          {this.props.status ? this.props.status : "-"}
        </StyledStatusTableCell>
      </StyledTableRow>
    );
  }
}

export default CreatorHistoryOrig;
