import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import styled from "styled-components";

const SubmitButton = styled(Button)`
  margin: 0 auto;
  width: 30%
  padding: 5px;
  font-size: 18px;
`;

const CreateProjectForm = styled(Form)`
  width: 80%;
  margin: 0 auto;
  padding-top: 40px;
  font-family: Avenir;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

class CreateProjectPage extends Component {
  state = {
    title: "",
    simpleDesc: "",
    detailDesc: "",
    guidelineURL: "",
    dueDate: "",
    type: "image",
    cost: ""
  };
  handleSubmit = async e => {
    e.preventDefault();

    const data = {
      title: this.state.title,
      title_image: null,
      simple_description: this.state.simpleDesc,
      detail_description: this.state.detailDesc,
      due_date: this.state.dueDate,
      type: this.state.type,
      guideline_url: this.state.guidelineURL,
      reward: this.state.cost
    };

    const url = this.props.match.path;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.result) {
          alert("Succeed");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = e => {
    //console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  render() {
    return (
      <CreateProjectForm onSubmit={this.handleSubmit}>
        <FormGroup>
          <h1>
            <Label>프로젝트 생성</Label>
          </h1>
        </FormGroup>
        <FormGroup>
          <Label for="title">제목</Label>
          <Input
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.handleChange}
            placeholder="제목"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="simpleDesc">간단한 설명</Label>
          <Input
            type="text"
            name="simpleDesc"
            value={this.state.simpleDesc}
            onChange={this.handleChange}
            placeholder="간단한 설명"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="detailDesc">자세한 설명</Label>
          <Input
            type="textarea"
            name="detailDesc"
            value={this.state.detailDesc}
            onChange={this.handleChange}
            placeholder="자세한 설명"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="guidelineURL">가이드라인</Label>
          <Input
            type="url"
            name="guidelineURL"
            value={this.state.guidelineURL}
            onChange={this.handleChange}
            placeholder="가이드라인 URL"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="dueDate">만기일</Label>
          <Input
            type="date"
            name="dueDate"
            value={this.state.dueDate}
            onChange={this.handleChange}
            placeholder="만기일을 설정하세요"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">프로젝트 타입</Label>
          <Input
            type="select"
            name="type"
            value={this.state.type}
            onChange={this.handleChange}
            required
          >
            <option value="image">이미지</option>
            <option value="text">텍스트</option>
            <option value="voice">음성</option>
            <option value="survey">설문 조사</option>
          </Input>
        </FormGroup>{" "}
        <FormGroup>
          <Label for="cost">데이터 가격</Label>
          <Input
            type="number"
            name="cost"
            value={this.state.cost}
            onChange={this.handleChange}
            placeholder="데이터 가격"
            required
          />
        </FormGroup>
        <ButtonContainer>
          <SubmitButton color="primary" type="submit">
            생성
          </SubmitButton>
        </ButtonContainer>
      </CreateProjectForm>
    );
  }
}

export default CreateProjectPage;
