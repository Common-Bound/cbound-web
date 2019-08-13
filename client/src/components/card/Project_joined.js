import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Link } from "react-router-dom";

const StyledTableCell = styled(TableCell)`
  color: ${props =>
    props.project_type === "normal" ? "black" : "blue"} !important;
`;

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

class Project_joined extends Component {
  render() {
    return (
      <StyledTableRow>
        <TableCell align="center">
          {this.props.created_at.substring(0, 10)}
        </TableCell>
        <StyledTableCell align="center" project_type={this.props.project_type}>
          {this.props.project_type === "normal" ? "생성" : "검수"}
        </StyledTableCell>
        <TableCell align="center">
          <StyledLink
            to={
              this.props.ref_project
                ? `/mypage/task/${this.props.project_type}/${
                    this.props.ref_project
                  }`
                : `/mypage/task/${this.props.project_type}/${this.props.id}`
            }
          >
            {this.props.title}
          </StyledLink>
        </TableCell>
        <TableCell align="center">{this.props.reward}</TableCell>
        <TableCell align="center">{this.props.due_date}</TableCell>
        <TableCell align="center">-</TableCell>
      </StyledTableRow>
    );
  }
}

export default Project_joined;
