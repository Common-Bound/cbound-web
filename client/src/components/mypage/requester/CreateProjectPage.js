import React, { Component } from "react";
import styled from "styled-components";
import Class from "./Class";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const CreateProjectForm = styled.form`
  width: 80%;
  height: 100%;

  margin: 0 auto;
  overflow: scroll;
  padding: 40px 0px;
  font-family: Avenir;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const ClassContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin: 20px 0px;
`;

const Classes = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledFormGroup = styled.div`
  margin-bottom: 1.5rem;
`;
const StyledInput = styled.input`
  width: 100%;

  font-size: 0.875rem;
  height: calc(2.75rem + 2px);
  color: #8898aa;

  padding: 0.625rem 0.75rem
  border: 1px solid #cad1d7;
  border-radius: 0.375rem;
`;
const StyledLabel = styled.label`
  margin-bottom: 0.5rem;
`;
const StyledButton = styled.button`
  background-color: #5e72e4 !important;
  color: white;
  border-radius: 0.375rem;
  font-weight: 600;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;

  cursor: pointer;
  @media (max-width: 500px) {
    padding: 0.5rem 1rem !important;
    font-size: 12px !important;
  }
`;
const SubmitButton = styled(StyledButton)`
  margin: 0 auto;
  width: 30%;
`;

class CreateProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      simpleDesc: "",
      detailDesc: "",
      // guidelineURL: "",
      dueDate: "",
      type: "image",
      cost: "",
      iamge: "",
      class: "",
      classComponents: [],
      classes: [],
      id: 0
    };

    this.inputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit = async e => {
    e.preventDefault();

    const data = {
      title: this.state.title,
      simple_description: this.state.simpleDesc,
      detail_description: this.state.detailDesc,
      due_date: this.state.dueDate,
      type: this.state.type,
      // guideline_url: this.state.guidelineURL,
      reward: this.state.cost,
      class:
        this.state.type === "image"
          ? this.state.classes.map(option => option.value)
          : []
    };

    const formData = new FormData();
    formData.append("title_image", this.state.image);
    formData.append("info", JSON.stringify(data));

    const url = `/api${this.props.match.path}`;
    await fetch(url, {
      method: "POST",
      body: formData
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

  onFileUpload = e => {
    this.setState({
      image: e.target.files[0]
    });
  };

  handleChange = e => {
    //\console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleAddClass = async e => {
    const newClassComponents = this.state.classComponents;
    const newClasses = this.state.classes;

    const input = this.inputRef.current.value;
    const id = this.state.id;

    const classOption = {
      id: id,
      value: input
    };
    if (input.length <= 0) {
      return alert("클래스 이름을 입력하세요");
    }
    const ClassComponentOption = {
      id: id,
      component: (
        <Class
          key={id}
          name={input}
          id={id}
          handleDeleteClass={this.handleDeleteClass.bind(this)}
        />
      )
    };

    newClassComponents.push(ClassComponentOption);
    newClasses.push(classOption);

    await this.setState({
      classComponents: newClassComponents,
      classes: newClasses,
      id: id + 1
    });
  };

  handleDeleteClass = async id => {
    let newClassComponents = this.state.classComponents;
    let newClasses = this.state.classes;

    let index = newClassComponents.findIndex(component => component.id === id);
    newClassComponents.splice(index, 1);
    index = newClasses.findIndex(option => option.id === id);
    newClasses.splice(index, 1);

    await this.setState({
      classComponents: newClassComponents,
      classes: newClasses
    });
  };

  render() {
    return (
      <Container>
        <CreateProjectForm onSubmit={this.handleSubmit}>
          <StyledFormGroup>
            <h1>
              <StyledLabel>프로젝트 생성</StyledLabel>
            </h1>
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledLabel for="title">제목</StyledLabel>
            <StyledInput
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              placeholder="제목"
              required
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledLabel for="simpleDesc">간단한 설명</StyledLabel>
            <StyledInput
              type="text"
              name="simpleDesc"
              value={this.state.simpleDesc}
              onChange={this.handleChange}
              placeholder="간단한 설명"
              required
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledLabel for="detailDesc">자세한 설명</StyledLabel>
            <StyledInput
              type="textarea"
              name="detailDesc"
              value={this.state.detailDesc}
              onChange={this.handleChange}
              placeholder="자세한 설명"
              required
            />
          </StyledFormGroup>
          <StyledFormGroup for="image">
            <StyledLabel for="image">대표 이미지</StyledLabel>
            <StyledInput
              type="file"
              onChange={this.onFileUpload}
              name="image"
              id="image"
              required
              accept="image/*"
            />
          </StyledFormGroup>
          {/* <StyledFormGroup>
            <StyledLabel for="guidelineURL">가이드라인</StyledLabel>
            <StyledInput
              type="url"
              name="guidelineURL"
              value={this.state.guidelineURL}
              onChange={this.handleChange}
              placeholder="가이드라인 URL"
              required
            />
          </StyledFormGroup> */}
          <StyledFormGroup>
            <StyledLabel for="dueDate">만기일</StyledLabel>
            <StyledInput
              type="date"
              name="dueDate"
              value={this.state.dueDate}
              onChange={this.handleChange}
              placeholder="만기일을 설정하세요"
              required
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledLabel for="type">프로젝트 타입</StyledLabel>
            <select
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
            </select>
            {this.state.type === "image" ? (
              <ClassContainer>
                <Section>
                  <StyledInput
                    type="text"
                    name="class"
                    ref={this.inputRef}
                    value={this.state.class}
                    onChange={this.handleChange}
                    style={{ width: "200px" }}
                  />
                  <StyledButton onClick={this.handleAddClass.bind(this)}>
                    클래스 추가
                  </StyledButton>
                  {this.state.classes.length === 0 ? (
                    <div style={{ padding: "10px", display: "inline-block" }}>
                      클래스가 설정되지 않으면 라벨을 자유롭게 입력할 수
                      있습니다
                    </div>
                  ) : (
                    undefined
                  )}
                </Section>

                <Classes>
                  {this.state.classComponents.map(option => option.component)}
                </Classes>
              </ClassContainer>
            ) : (
              undefined
            )}
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledLabel for="cost">데이터 가격</StyledLabel>
            <StyledInput
              type="number"
              name="cost"
              value={this.state.cost}
              onChange={this.handleChange}
              placeholder="데이터 가격"
              required
            />
          </StyledFormGroup>
          <ButtonContainer>
            <SubmitButton type="submit">생성</SubmitButton>
          </ButtonContainer>
        </CreateProjectForm>
      </Container>
    );
  }
}

export default CreateProjectPage;
