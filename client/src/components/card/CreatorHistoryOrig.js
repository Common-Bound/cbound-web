import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import { Redirect } from "react-router-dom";

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

const StyledStatusTableCell = styled(StyledTableCell)`
  color: ${props =>
    props.status
      ? props.status === "created"
        ? "blue"
        : props.status === "done"
        ? "green"
        : "red"
      : "black"} !important;
`;

class CreatorHistoryOrig extends Component {
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
    const created_time = moment(this.props.date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    return (
      <StyledTableRow onClick={this.handleClick.bind(this)}>
        <StyledDateTableCell align="center">{created_time}</StyledDateTableCell>
        <StyledTableCell align="center" data_type={this.props.data_type}>
          {this.props.title}({this.props.data_type ? "생성" : "검수"})
        </StyledTableCell>
        <StyledTableCell align="center">{this.props.reward}</StyledTableCell>
        <StyledStatusTableCell align="center" status={this.props.status}>
          {this.props.status ? this.props.status : "-"}
        </StyledStatusTableCell>
        {this.state.clicked ? (
          <Redirect
            to={{
              pathname: `/mypage/creator/history/${
                this.props.data_type ? "normal" : "inspection"
              }/${this.props.data_id}`,
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

export default CreatorHistoryOrig;
