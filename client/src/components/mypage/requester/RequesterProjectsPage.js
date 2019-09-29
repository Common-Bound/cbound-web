import React, { Component } from "react";
import { Button } from "reactstrap";
import ProjectOrig from "../../card/RequesterProjectOrig";
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
  margin: 0 auto;

  color: black; !important;
`;

const Title = styled.div`
  padding-top: 40px;
  font-family: Avenir;
  font-size: 20px;
  font-weight: bold;
`;

const SemiTitle = styled.div`
  padding-bottom: 40px;
  font-family: SpoqaHanSans;
  font-size: 32px;
  font-weight: bold;
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

const CreateProjectButton = styled(Button)`
  float: right;
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
    const url = this.props.match.path;
    const result = await fetch(url)
      .then(res => res.json())
      .then(data => {
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
          <Title>Requested Projects</Title>
          <SemiTitle>
            생성한 프로젝트
            <CreateProjectButton
              color="primary"
              onClick={() => {
                window.open(this.props.location.pathname + "/create");
              }}
            >
              프로젝트 생성
            </CreateProjectButton>
          </SemiTitle>
        </TitleContainer>

        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell align="center">KICK-OFF</StyledTableCell>
                {/* <StyledTableCell align="center">ROLE</StyledTableCell> */}
                <StyledTableCell align="center">TITLE</StyledTableCell>
                <StyledTableCell align="center">POINT</StyledTableCell>
                <StyledTableCell align="center">DUE</StyledTableCell>
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