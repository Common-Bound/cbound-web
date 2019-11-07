import React, { Component } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import moment from "moment";

const Card = styled.div`
  box-shadow: 0px 8px 8px 2px rgba(0, 0, 0, 0.2);
  min-width: 300px;
  max-width: 300px;
  margin: 0px 30px 30px 0px;
  text-align: center;

  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    max-width: 240px;
    min-width: 240px;
  }

  @media (max-width: 500px) {
    max-width: 100%;
    margin: 0px 0px 30px 0px;
  }

  border: 1px solid lightgrey;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    flex-direction: row;
    height: 130px;
  }
`;

const SubContainer = styled.div`
  width: 100%;
  height: 220px;
  padding: 10px;
  overflow: auto;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    height: 200px;
  }

  @media (max-width: 500px) {
    width: 60%;
    height: 100%;
    padding: 4px;
  }
`;

const ButtonContainer = styled.div``;

const Image = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: 100% 100%;

  @media (max-width: 1024px) {
    height: 160px;
  }
  @media (max-width: 500px) {
    width: 40%;
    height: 100%;
  }
`;

const Title = styled.div`
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  color: black;
  word-break: keep-all;

  @media (max-width: 1024px) {
    padding: 8px;
    font-size: 18px;
  }
  @media (max-width: 500px) {
    padding: 4px;
    font-size: 14px;
  }
`;

const Description = styled.div`
  padding: 8px;
  color: grey;
  font-size: 16px;
  word-break: keep-all;

  @media (max-width: 1024px) {
    padding: 6px;
    font-size: 14px;
  }
  @media (max-width: 500px) {
    padding: 2px;
    font-size: 12px;
  }
`;

const Info = styled.div`
  padding: 8px;
  color: ${props => (props.color === "red" ? "red" : "grey")};
  font-size: 14px;
  font-weight: ${props => (props.weight === "bold" ? "bold" : "normal")}
  word-break: keep-all;

  @media (max-width: 1024px) {
    padding: 6px;
    font-size: 12px;
  }
  @media (max-width: 500px) {
    padding: 2px;
    font-size: 10px;
  }
`;

const Button = styled.div`
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;

  :hover {
    opacity: 0.7;
  }

  @media (max-width: 1024px) {
    font-size: 14px;
  }
  @media (max-width: 500px) {
    font-size: 12px;
    padding: 6px;
  }
`;

class CreatorProjectJoined extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
  }

  handleClick() {
    this.setState({
      clicked: true
    });
  }

  render() {
    const created_time = moment(this.props.created_at, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const due_date_time = moment(this.props.due_date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    // const t1 = moment();
    // const t2 = moment(this.props.due_date);

    // const days = moment.duration(t2.diff(t1)).days();
    // const hours = moment.duration(t2.diff(t1)).hours();
    // const minutes = moment.duration(t2.diff(t1)).minutes();

    return (
      <Card>
        <MainContainer>
          <Image src={this.props.title_image}></Image>
          <SubContainer>
            <Title>
              {this.props.title} (
              {this.props.project_type === "normal" ? "생성" : "검수"})
            </Title>
            <Description>{this.props.simple_description}</Description>
            <Info color="red" weight="bold">
              {this.props.reward} P
            </Info>
            <Info>
              {created_time} ~ {due_date_time}
            </Info>
          </SubContainer>
        </MainContainer>
        <ButtonContainer>
          <Button onClick={this.handleClick.bind(this)}>참여하기</Button>
        </ButtonContainer>
        {this.state.clicked ? (
          <Redirect
            to={{
              pathname: this.props.ref_project
                ? `/mypage/creator/task/${this.props.project_type}/${this.props.ref_project}`
                : `/mypage/creator/task/${this.props.project_type}/${this.props.id}`,
              state: {
                title: this.props.title,
                created_at: this.props.created_at,
                due_date: this.props.due_date,
                classes: this.props.classes
              }
            }}
          />
        ) : (
          undefined
        )}
      </Card>
    );
  }
}

export default CreatorProjectJoined;
