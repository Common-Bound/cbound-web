import React, { Component } from "react";

class TestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: ""
    };
  }

  handleChange = e => {
    console.log(e.target.files[0]);
    this.setState({
      selectedFile: e.target.files[0]
    });
  };

  handleClick = e => {
    e.preventDefault();
    const data = new FormData();
    data.append("imgFile", this.state.selectedFile);

    const url = "/upload";
    fetch(url, {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <form>
          <input type="file" name="imgFile" onChange={this.handleChange} />
          <button type="submit" onClick={this.handleClick}>
            파일 업로드
          </button>
        </form>
      </div>
    );
  }
}

export default TestForm;
