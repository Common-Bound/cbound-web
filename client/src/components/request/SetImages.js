import React, { Component } from "react";

class SetImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: ""
    };
  }

  onChange = e => {
    let files = e.target.files;
    console.warn(files);
  };

  render() {
    return (
      <div onSubmit={this.onFormSubmit}>
        <input type="file" name="file" onChange={this.onChange} />
      </div>
    );
  }
}

export default SetImages;
