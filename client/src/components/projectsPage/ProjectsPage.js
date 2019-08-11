import React, { Component } from "react";
import ProjectJoined from "../card/Project_joined";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const Container = styled.div`
  border: 1px solid blue;
  width: 100%;
  height: 100vh;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  padding: 40px 60px;
`;

const TableContainer = styled.div`
  width: 80%;
  height: 600px;
  margin: 0 auto;
  overflow: scroll;
  text-align: center;
`;

class ProjectsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.fetchProject();
  }

  /**
   * @description 내가 참여한 프로젝트 목록을 가져온다
   *
   * @memberof ProjectsPage
   */
  async fetchProject() {
    const url = this.props.match.path;
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
                title={el.title}
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
  }

  render() {
    return (
      <Container>
        <Title>참여한 프로젝트</Title>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">제목</TableCell>
                <TableCell align="center">보상</TableCell>
                <TableCell align="center">마감 기한</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.state.projects}</TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }
}

export default ProjectsPage;
