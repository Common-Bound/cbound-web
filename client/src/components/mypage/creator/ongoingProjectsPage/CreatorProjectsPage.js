import React, { Component } from "react";
import ProjectJoined from "../../../card/CreatorProjectJoined";
import LoadingPlaceholder from "../../../card/LoadingPlaceholder";
import AlarmCard from "../../../card/AlarmCard";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  width: 80%;
  padding-top: 40px;
  margin: 0 auto;

  color: black; !important;

  @media(max-width: 500px){
    padding-top: 24px;
  }
`;

const Title = styled.div`
  font-family: Avenir;
  font-size: 20px;
  font-weight: bold;

  @media (max-width: 500px) {
    font-size: 16px;
  }
`;

const SemiTitle = styled.div`
  font-family: SpoqaHanSans;
  font-size: 32px;
  font-weight: bold;

  @media (max-width: 500px) {
    font-size: 24px;
  }
`;

const TableContainer = styled.div`
  width: 80%;
  max-height: 80%;

  display: flex;
  flex-wrap: wrap;

  padding-top: 40px;
  margin: 0 auto;
  overflow: scroll;

  @media (max-width: 500px) {
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;

class CreatorProjectsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      projects: []
    };
  }

  componentDidMount() {
    this.fetchProject();
  }

  /**
   * @description 내가 참여한 프로젝트 목록을 가져온다
   *
   * @memberof CreatorProjectsPage
   */
  async fetchProject() {
    const url = `/api${this.props.match.path}`;
    console.log(url);
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          return alert(data.message);
        }
        if (data.result) {
          console.log(data);
          const new_projects = data.result.map(el => {
            return (
              <ProjectJoined
                key={el.id}
                id={el.id}
                ref_project={el.ref_project}
                title={el.title}
                title_image={el.title_image}
                simple_description={el.simple_description}
                detail_description={el.detail_description}
                due_date={el.due_date}
                created_at={el.created_at}
                type={el.type}
                project_type={el.project_type}
                guideline_url={el.guideline_url}
                reward={el.reward}
              />
            );
          });
          this.setState({
            projects: new_projects
          });
        }
      });

    await this.setState({
      loading: false
    });
  }

  render() {
    return (
      <Container>
        <TitleContainer>
          <Title>On Going Projects</Title>
          <SemiTitle>참여한 프로젝트</SemiTitle>
        </TitleContainer>
        <TableContainer>
          {this.state.loading ? (
            [<LoadingPlaceholder key={1} />, <LoadingPlaceholder key={2} />]
          ) : this.state.projects.length === 0 ? (
            <AlarmCard message="참여한 프로젝트가 아직 없어요!" />
          ) : (
            this.state.projects
          )}
        </TableContainer>
      </Container>
    );
  }
}

export default CreatorProjectsPage;
