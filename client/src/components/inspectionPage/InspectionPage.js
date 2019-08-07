import React, { Component } from 'react';

class InspectionPage extends Component {
  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const url = this.props;
    console.log(url);
  }

  render() {
    return (
      <div>
        검수 페이지 입니다
      </div>
    );
  }
}

export default InspectionPage;