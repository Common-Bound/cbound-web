// 정적인 버튼 (프로젝트 생성단계 를 보여줌)

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SetDescription from "./SetDescription";

class ProjectRequest extends Component {
  state = {
    title: "HELLO",
    basicLang: "",
    simpleDesc: "",
    detailDesc: "",
    type: "",
    mainImage: "",
    taskExample1: "",
    taskExample2: "",
    taskExample3: "",
    guideLine: "",
    ageCondi: "",
    genderCondi: "",
    dataCost: "",
    totalData: "",
    dataInspector: "",
    dueDate: ""
  };
  render() {
    const { information } = this.state;
    return (
      <Router>
        <div>
          <Link to="./dsc">설명</Link>
          <Link to="/img">이미지</Link>
          <Link to="/gui">가이드</Link>
          <Link to="/cst">단가</Link>
        </div>
        <div>
          <Route
            exact
            path="/dsc"
            render={props => (
              <SetDescription
                {...props}
                title={this.state.title}
                basicLang={this.state.basicLang}
                simpleDesc={this.state.simpleDesc}
                detailDesc={this.state.detailDesc}
                type={this.state.type}
              />
            )}
          />
        </div>
        <div>
          <Route
            exact
            path="img"
            render={props => (
              <SetDescription
                {...props}
                mainImage={this.state.mainImage}
                taskExample1={this.state.taskExample1}
                taskExample2={this.state.taskExample2}
                taskExample3={this.state.taskExample3}
              />
            )}
          />
        </div>
        <div>
          <Route
            exact
            path="/gui"
            render={props => (
              <SetDescription {...props} title={this.state.title} />
            )}
          />
        </div>
        <div>
          <Route
            exact
            path="/cst"
            render={props => (
              <SetDescription {...props} title={this.state.title} />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default ProjectRequest;
