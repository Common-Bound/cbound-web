import React, { Component } from "react";
import { arrayTypeAnnotation } from "@babel/types";

class SetDescription extends Component {
  constructor(props) {
    super(props);
    this.state = this.props;

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.onSubmit(this.state);
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <div>
        <br />
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="title">프로젝트 이름</label>
            <br />
            <input
              required
              value={this.state.title}
              name="title"
              onChange={this.handleChange}
            />
            <br />
            <br />
          </div>
          <div>
            <label htmlFor="basicLang">언어: </label>
            <select
              value={this.state.basicLang}
              required
              name="basicLang"
              size="1"
              onChange={this.handleChange}
            >
              <option value="한국어">한국어</option>
              <option value="English">English</option>
              <option value="etc">etc</option>
            </select>
            <br />
            <br />
          </div>
          <div>
            <label htmlFor="simpleDesc">간단한 설명</label>
            <br />
            <input
              required
              value={this.state.simpleDesc}
              name="simpleDesc"
              onChange={this.handleChange}
            />
            <br />
            <br />
          </div>
          <div>
            <label htmlFor="detailDesc">자세한 설명</label>
            <br />
            <textarea
              required
              value={this.state.detailDesc}
              name="detailDesc"
              onChange={this.handleChange}
            />
            <br />
            <br />
          </div>
          <div>
            <label htmlFor="type">작업 타입: </label>
            <select
              value={this.state.type}
              required
              name="type"
              size="1"
              onChange={this.handleChange}
            >
              <option value="이미지">이미지</option>
              <option value="텍스트">텍스트</option>
              <option value="etc">설문조사</option>
            </select>
            <br />
            <br />
          </div>
          <div>
            <input type="submit" value="다음" />
          </div>
        </form>
      </div>
    );
  }
}

export default SetDescription;
