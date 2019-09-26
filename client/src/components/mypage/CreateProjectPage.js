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
  render() {
    return (
      <CreateProjectForm>
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
            id="title"
            placeholder="제목"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="simpleDesc">간단한 설명</Label>
          <Input
            type="text"
            name="simpleDesc"
            id="simpleDesc"
            placeholder="간단한 설명"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="detailDesc">자세한 설명</Label>
          <Input
            type="textarea"
            name="detailDesc"
            id="detailDesc"
            placeholder="자세한 설명"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="guidelineURL">가이드라인</Label>
          <Input
            type="url"
            name="guidelineURL"
            id="guidelineURL"
            placeholder="가이드라인 URL"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="dueDate">만기일</Label>
          <Input
            type="date"
            name="dueDate"
            id="dueDate"
            placeholder="만기일을 설정하세요"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">프로젝트 타입</Label>
          <Input type="select" name="select" id="exampleSelect" required>
            <option>이미지</option>
            <option>텍스트</option>
            <option>음성</option>
            <option>설문 조사</option>
          </Input>
        </FormGroup>{" "}
        <FormGroup>
          <Label for="cost">데이터 가격</Label>
          <Input
            type="number"
            name="cost"
            id="cost"
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
