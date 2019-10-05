import React, { Component } from "react";
import ProjectHistory from "../../../card/CreatorHistoryOrig";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const TitleContainer = styled.div`
  width: 80%;
  padding-top: 40px;
  padding-bottom: 40px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

  color: black; !important;
`;

const LeftTitleContainer = styled.div``;

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

const RightTitleContainer = styled.div``;

const RightSemiTitle = styled.div`
  padding-top: 52px;
  font-family: SpoqaHanSans;
  font-size: 18px;
  color: grey;
`;

const TableContainer = styled.div`
  width: 80%;
  height: 600px;
  margin: 0 auto;
  overflow: scroll;
  text-align: center;
`;

const StyledTableHead = styled(TableHead)`
  background-color: black;
`;

const StyledTableCell = styled(TableCell)`
  color: rgba(255, 255, 255, 0.6) !important;
  font-family: Avenir;
`;

class CreatorHistoryPage extends Component {
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
              <ProjectHistory
                key={el.id}
                id={el.id}
                title={el.title}
                date={el.date}
                reward={el.reward}
                project_type={el.project_type}
                status={el.status}
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
        <TitleContainer>
          <LeftTitleContainer>
            <Title>Work History</Title>
            <SemiTitle>작업 참여 내역</SemiTitle>
          </LeftTitleContainer>
          <RightTitleContainer>
            <RightSemiTitle>
              최근 30일 동안 작업한 내역이 보여집니다
            </RightSemiTitle>
          </RightTitleContainer>
        </TitleContainer>
        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell align="center">CREATED</StyledTableCell>
                <StyledTableCell align="center">ROLE</StyledTableCell>
                <StyledTableCell align="center">TITLE</StyledTableCell>
                <StyledTableCell align="center">POINT</StyledTableCell>
                <StyledTableCell align="center">STATUS</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>{this.state.projects}</TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }
}

export default CreatorHistoryPage;
