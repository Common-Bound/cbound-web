import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";

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
    const created_time = moment(this.props.created_at, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const due_date_time = moment(this.props.due_date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    const t1 = moment();
    const t2 = moment(this.props.due_date);

    const days = moment.duration(t2.diff(t1)).days();
    const hours = moment.duration(t2.diff(t1)).hours();
    const minutes = moment.duration(t2.diff(t1)).minutes();

    return (
      <StyledTableRow onClick={this.handleClick}>
        <TableCell align="center">{created_time}</TableCell>
        <StyledTableCell align="center" project_type={this.props.project_type}>
          {this.props.project_type === "normal" ? "생성" : "검수"}
        </StyledTableCell>
        <TableCell align="center">{this.props.title}</TableCell>
        <TableCell align="center">{this.props.reward}</TableCell>
        <TableCell align="center">{due_date_time}</TableCell>
        <TableCell align="center">{`${days}일 ${hours}시간 ${minutes}분 뒤 종료`}</TableCell>
      </StyledTableRow>
    );
  }
}

export default Project_orig;
