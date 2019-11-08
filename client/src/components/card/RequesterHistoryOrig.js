import React, { Component } from "react";
import moment from "moment";
import { Redirect } from "react-router-dom";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import styled from "styled-components";

const ThumbnailImage = styled.img`
  width: 100px;

  @media (max-width: 500px) {
    width: 50px;
  }
`;

const StyledTableCell = styled(TableCell)`
  word-break: keep-all;
`;

const DataIDTableCell = styled(TableCell)`
  @media (max-width: 500px) {
    display: none !important;
  }
`;

class RequesterHistoryOrig extends Component {
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
      <TableRow onClick={this.handleClick.bind(this)}>
        <StyledTableCell align="center">
          <ThumbnailImage src={this.props.name} alt=""></ThumbnailImage>
        </StyledTableCell>
        <StyledTableCell align="center">{created_time}</StyledTableCell>
        <DataIDTableCell align="center">{this.props.data_id}</DataIDTableCell>
        <StyledTableCell align="center">{this.props.credit}</StyledTableCell>
        {this.props.status === "failure" ? (
          <StyledTableCell align="center">
            <i className="fas fa-check text-warning mr-3" /> 반려
          </StyledTableCell>
        ) : (
          <StyledTableCell align="center">
            <i className="fas fa-plus text-success mr-3" /> 생산
          </StyledTableCell>
        )}
        {this.state.clicked ? (
          <Redirect
            push
            to={{
              pathname: `/mypage/requester/history/${this.props.data_id}`,
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
      </TableRow>
    );
  }
}

export default RequesterHistoryOrig;
