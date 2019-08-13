import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

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

class Project_orig extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = e => {
    const url = "/mypage/join";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        proj_id: this.props.id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          return alert(data.message);
        }
        if (data.result === true) {
          return alert(
            "프로젝트에 참여하였습니다. 가이드라인을 잘 읽고 참여해 주세요"
          );
        }
      })
      .catch(err => {
        return console.log(err);
      });
  };

  render() {
    return (
      <StyledTableRow onClick={this.handleClick}>
        <TableCell align="center">
          {this.props.created_at.substring(0, 10)}
        </TableCell>
        <StyledTableCell align="center" project_type={this.props.project_type}>
          {this.props.project_type === "normal" ? "생성" : "검수"}
        </StyledTableCell>
        <TableCell align="center">{this.props.title}</TableCell>
        <TableCell align="center">{this.props.reward}</TableCell>
        <TableCell align="center">{this.props.due_date}</TableCell>
        <TableCell align="center">-</TableCell>
      </StyledTableRow>
    );
  }
}

export default Project_orig;
