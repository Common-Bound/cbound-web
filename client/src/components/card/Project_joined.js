import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Link } from "react-router-dom";
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

const StyledLink = styled(Link)`
  text-decoration: none !important;
  color: black !important;
`;

class Project_joined extends Component {
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
      <StyledTableRow>
        <TableCell align="center">{created_time}</TableCell>
        <StyledTableCell align="center" project_type={this.props.project_type}>
          {this.props.project_type === "normal" ? "생성" : "검수"}
        </StyledTableCell>
        <TableCell align="center">
          <StyledLink
            to={{
              pathname: this.props.ref_project
                ? `/mypage/task/${this.props.project_type}/${
                    this.props.ref_project
                  }`
                : `/mypage/task/${this.props.project_type}/${this.props.id}`,
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
        <TableCell align="center">{`${days}일 ${hours}시간 ${minutes}분 뒤 종료`}</TableCell>
      </StyledTableRow>
    );
  }
}

export default Project_joined;
