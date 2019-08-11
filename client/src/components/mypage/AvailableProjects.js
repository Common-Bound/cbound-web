import React, { Component } from "react";
import ProjectOrig from "../card/Project_orig";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

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

const SemiTitle = styled.div`
  font-size: 1.4rem;
  padding: 10px 60px;
`;

const TableContainer = styled.div`
  width: 80%;
  height: 600px;
  margin: 0 auto;
  overflow: scroll;
  text-align: center;
`;

/*const Table = styled.table`
  width: 80%;
  margin: 0 auto;
  border: 1px solid lightgrey;
`;

const Thead = styled.thead`
  width: 100%;
`;*/

class AvailableProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      session: "",
      projects: []
    };
  }

  /**
   * @dev /mypage 라우트로 요청을 보냈을 때, 세션이 존재한다면
   *      참여 가능한 프로젝트 목록을 가져온다. 그러나 세션이 존재하지
   *      않는다면 false 를 반환한다
   */
  async componentDidMount() {
    await this.fetchProject();
  }

  async fetchProject() {
    const url = this.props.match.path;
    const result = await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.message) {
          return alert(data.message);
        }
        this.setState({ session: data.result, loading: false });
        return new Promise(resolve => {
          resolve(data.result);
        });
      })
      .catch(err => {
        console.log(err);
      });

    // 만약 result가 false가 아니라면 프로젝트 목록이다
    if (result) {
      const my_proj = result.map(el => {
        return (
          <ProjectOrig
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
        projects: my_proj
      });
    }
  }

  /**
   * @description 랜덤 프로젝트 추가 버튼 클릭시 랜덤한 프로젝트를 생성하고
   *              프로젝트 목록을 다시 불러온다
   */
  handleClick = e => {
    const url = this.props.match.path;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.fetchProject();
      });
  };

  render() {
    return (
      <Container>
        <Title>Common Bound</Title>
        <SemiTitle>참여 가능한 프로젝트</SemiTitle>
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
          <Button onClick={this.handleClick.bind(this)}>
            랜덤 프로젝트 추가
          </Button>
        </TableContainer>
      </Container>
    );
  }
}

export default AvailableProjects;
