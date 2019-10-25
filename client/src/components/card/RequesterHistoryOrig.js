import React, { Component } from "react";
import moment from "moment";
import { Redirect } from "react-router-dom";

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
      <tr onClick={this.handleClick.bind(this)}>
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
        {this.state.clicked ? (
          <Redirect
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
      </tr>
    );
  }
}

export default RequesterHistoryOrig;
