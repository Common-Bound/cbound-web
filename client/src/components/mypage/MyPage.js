import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: ""
    };
    const url = this.props.match.path;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ data: data.result, loading: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    if (this.state.loading) {
      return <div>로딩 중...</div>;
    }

    if (this.state.data === true) {
      return (
        <div>
          <h1>마이페이지</h1>
          <Link to="/auth/signout">로그아웃</Link>
        </div>
      );
    }
    if (this.state.data === false) {
      return <Redirect to="/auth/signin" />;
    }
  }
}

export default MyPage;
