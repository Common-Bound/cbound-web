import React, { Component } from "react";
import moment from "moment";
import { Redirect } from "react-router-dom";

class RequesterHistoryOrig extends Component {
  render() {
    const created_time = moment(this.props.date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    return (
      <tr>
        <th scope="row">
          <img
            src={this.props.name}
            alt=""
            style={{ width: "20%", height: "auto" }}
          ></img>
        </th>
        <td>{created_time}</td>
        <td>{this.props.credit}</td>
        {this.props.status === "failure" ? (
          <td>
            <i className="fas fa-check text-warning mr-3" /> 반려
          </td>
        ) : (
          <td>
            <i className="fas fa-plus text-success mr-3" /> 생산
          </td>
        )}
      </tr>
    );
  }
}

export default RequesterHistoryOrig;
