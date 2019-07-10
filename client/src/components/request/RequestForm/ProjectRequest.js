// 정적인 버튼 (프로젝트 생성단계 를 보여줌)

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SetDescription from "./SetDescription";

class ProjectRequest extends Component {
  state = {
    title: "",
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

  handleSetDsc = data => {
    this.state = data;
  };
  render() {
    return (
      <Router>
        <div>
          <Link to="./dsc">
            <button>설명</button>
          </Link>
          <Link to="/img">
            <button>이미지</button>
          </Link>
          <Link to="/gui">
            <button>가이드</button>
          </Link>
          <Link to="/cst">
            <button>단가</button>
          </Link>
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
                onSubmit={this.handleSetDsc}
              />
            )}
          />
        </div>
        <div>
          <Route
            exact
            path="/img"
            render={props => (
              <SetDescription
                {...props}
                mainImage={this.state.mainImage}
                taskExample1={this.state.taskExample1}
                taskExample2={this.state.taskExample2}
                taskExample3={this.state.taskExample3}
                onSubmit={this.handleSetImg}
              />
            )}
          />
        </div>
        <div>
          <Route
            exact
            path="/gui"
            render={props => (
              <SetDescription
                {...props}
                guideLine={this.state.guideLine}
                onSubmit={this.handleSetGui}
              />
            )}
          />
        </div>
        <div>
          <Route
            exact
            path="/cst"
            render={props => (
              <SetDescription
                {...props}
                dataCost={this.state.dataCost}
                totalData={this.state.totalData}
                dataInspector={this.state.dataInspector}
                onSubmit={this.handleSetCst}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default ProjectRequest;
