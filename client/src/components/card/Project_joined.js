import React, { Component } from "react";
import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Link } from "react-router-dom";

class Project_joined extends Component {
  render() {
    return (
      <TableRow>
        <TableCell align="center">
          <Link
            to={
              this.props.ref_project
                ? `/mypage/task/${this.props.project_type}/${
                    this.props.ref_project
                  }`
                : `/mypage/task/${this.props.project_type}/${this.props.id}`
            }
          >
            {this.props.title}
          </Link>
        </TableCell>
        <TableCell align="center">{this.props.reward}</TableCell>
        <TableCell align="center">{this.props.due_date}</TableCell>
      </TableRow>
    );
  }
}

export default Project_joined;
