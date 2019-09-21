import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Redirect, Link } from "react-router-dom";
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

    const t1 = moment();
    const t2 = moment(this.props.due_date);

    const days = moment.duration(t2.diff(t1)).days();
    const hours = moment.duration(t2.diff(t1)).hours();
    const minutes = moment.duration(t2.diff(t1)).minutes();

    return (
      <StyledTableRow onClick={this.handleClick.bind(this)}>
        <TableCell align="center">{created_time}</TableCell>
        <StyledTableCell align="center" project_type={this.props.project_type}>
          {this.props.project_type === "normal" ? "생성" : "검수"}
        </StyledTableCell>
        <TableCell align="center">{this.props.title}</TableCell>
        <TableCell align="center">{this.props.reward}</TableCell>
        <TableCell align="center">{due_date_time}</TableCell>
        <TableCell align="center">{`${days}일 ${hours}시간 ${minutes}분 뒤 종료`}</TableCell>
        {this.state.clicked ? (
          <Redirect
            to={{
              pathname: this.props.ref_project
                ? `/mypage/creator/task/${this.props.project_type}/${this.props.ref_project}`
                : `/mypage/creator/task/${this.props.project_type}/${this.props.id}`,
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
