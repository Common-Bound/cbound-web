import React, { Component } from "react";
import ProjectOrig from "../../card/RequesterProjectOrig";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const TitleContainer = styled.div`
  width: 80%;
  padding-top: 40px;
  padding-bottom: 40px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  color: black; !important;

  @media(max-width: 810px){
    padding-top: 24px;
    padding-bottom: 24px;
  }
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
  word-break: keep-all;

  @media (max-width: 500px) {
    font-size: 24px;
  }
`;

const RightTitleContainer = styled.div``;

const TableContainer = styled.div`
  width: 80%;
  height: 60vh;

  margin: 0 auto;

  overflow: scroll;
  text-align: center;

  @media (max-width: 500px) {
    height: 56vh;
  }
`;

const StyledTableHead = styled(TableHead)`
  background-color: black;
`;

const StyledTableCell = styled(TableCell)`
  color: rgba(255, 255, 255, 0.6) !important;
  font-family: Avenir;
  word-break: keep-all;
  font-size: 14px !important;

  @media (max-width: 500px) {
    padding: 8px !important;
    font-size: 12px !important;
  }
`;

const CreateProjectButton = styled.div`
  background-color: #5e72e4;
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

class RequesterProjectsPage extends Component {
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
    const url = `/api${this.props.match.path}`;
    const result = await fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.result)
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
    if (result && result.length > 0) {
      console.log(result);
      const my_proj = result.map(el => {
        if (el.project_type === "inspection") {
          return null;
        }
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

  render() {
    return (
      <Container>
        <TitleContainer>
          <LeftTitleContainer>
            <Title>Requested Projects</Title>
            <SemiTitle>생성한 프로젝트</SemiTitle>
          </LeftTitleContainer>
          <RightTitleContainer>
            <CreateProjectButton
              color="primary"
              onClick={() => {
                window.open(this.props.location.pathname + "/create");
              }}
            >
              프로젝트 생성
            </CreateProjectButton>
          </RightTitleContainer>
        </TitleContainer>

        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell align="center">날짜</StyledTableCell>
                <StyledTableCell align="center">제목</StyledTableCell>
                <StyledTableCell align="center">포인트</StyledTableCell>
                <StyledTableCell align="center">마감</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>{this.state.projects}</TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }
}

export default RequesterProjectsPage;
