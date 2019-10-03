import React, { Component } from "react";
import ProjectOrig from "../../../card/CreatorProjectOrig";
import styled from "styled-components";
// import Button from "@material-ui/core/Button";

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
`;

const Title = styled.div`
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
  max-height: 80%;

  display: flex;
  flex-wrap: wrap;

  margin: 0 auto;
  overflow: scroll;

  @media (max-width: 500px) {
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;

// const StyledTableHead = styled(TableHead)`
//   background-color: black;
// `;

// const StyledTableCell = styled(TableCell)`
//   color: rgba(255, 255, 255, 0.6) !important;
//   font-family: Avenir;
// `;

// const ResponsiveStyledTableCell = styled(StyledTableCell)`
//   @media (max-width: 810px) {
//     display: none !important;
//   }
// `;

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
    console.log(this.props.match.path);
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
    if (result && result.length > 0) {
      console.log(result);
      const my_proj = result.map(el => {
        return (
          <ProjectOrig
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
        <TitleContainer>
          <Title>Available Projects</Title>
          <SemiTitle>참여 가능한 프로젝트</SemiTitle>
        </TitleContainer>
        <TableContainer>
          {/* <Table>
            <StyledTableHead>
              <TableRow>
                <ResponsiveStyledTableCell align="center">
                  KICK-OFF
                </ResponsiveStyledTableCell>
                <StyledTableCell align="center">ROLE</StyledTableCell>
                <StyledTableCell align="center">TITLE</StyledTableCell>
                <StyledTableCell align="center">POINT</StyledTableCell>
                <StyledTableCell align="center">DUE</StyledTableCell>
                <ResponsiveStyledTableCell align="center">
                  REMAINED
                </ResponsiveStyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>{this.state.projects}</TableBody>
          </Table> */}
          {/* 사용성 테스트를 위해 막아놓음 */}
          {/* <Button onClick={this.handleClick.bind(this)}>
            랜덤 프로젝트 추가
          </Button> */}
          {this.state.projects}
        </TableContainer>
      </Container>
    );
  }
}

export default AvailableProjects;
