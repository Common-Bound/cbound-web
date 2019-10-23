import React, { Component } from "react";
import ProjectHistory from "../../../card/CreatorHistoryOrig";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import InfiniteScroll from "react-infinite-scroll-component";

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

  color: black; !important;

  @media(max-width: 810px){
    flex-direction: column;
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

  @media (max-width: 810px) {
    padding-top: 10px;
  }
  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

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

class CreatorHistoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      normalData: [],
      inspectionData: [],
      hasMoreInspectionData: true,
      hasMoreNormalData: true,
      inspectionPage: 0,
      normalPage: 0,
      isInspection: true
    };

    this.fetchMoreInspectionData = this.fetchMoreInspectionData.bind(this);
    this.fetchMoreNormalData = this.fetchMoreNormalData.bind(this);
  }

  /**
   * @description 내가 참여한 프로젝트 목록을 가져온다
   *
   * @memberof CreatorProjectsPage
   */

  async componentDidMount() {
    this.state.isInspection
      ? await this.fetchMoreInspectionData()
      : await this.fetchMoreNormalData();
  }

  async fetchMoreInspectionData() {
    const url = `/api${this.props.match.path}/page/inspection/${this.state.inspectionPage}`;
    console.log(url);
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          return alert(data.message);
        }
        if (data.result) {
          // 데이터가 20개보다 적게 들어오면 더 이상 불러올 데이터가 없음
          if (data.result.length < 20) {
            this.setState({
              hasMoreInspectionData: false
            });
          }
          console.log(data);

          this.setState({
            inspectionData: this.state.inspectionData.concat(data.result),
            inspectionPage: this.state.inspectionPage + 1
          });
        }
      });
  }

  async fetchMoreNormalData() {
    const url = `/api${this.props.match.path}/page/normal/${this.state.normalPage}`;
    console.log(url);
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          return alert(data.message);
        }
        if (data.result) {
          // 데이터가 20개보다 적게 들어오면 더 이상 불러올 데이터가 없음
          if (data.result.length < 20) {
            this.setState({
              hasMoreNormalData: false
            });
          }
          console.log(data);

          this.setState({
            normalData: this.state.normalData.concat(data.result),
            normalPage: this.state.normalPage + 1
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
        {this.state.isInspection ? (
          <TableContainer id="inspectionScrollableDiv">
            <InfiniteScroll
              dataLength={this.state.inspectionData.length}
              next={this.fetchMoreInspectionData}
              hasMore={this.state.hasMoreInspectionData}
              loader={<h4>검수 작업 내역을 가져오는 중...</h4>}
              scrollableTarget="inspectionScrollableDiv"
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>더 이상 가져올 내역이 없습니다</b>
                </p>
              }
            >
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell align="center">날짜</StyledTableCell>
                    <StyledTableCell align="center">제목</StyledTableCell>
                    <StyledTableCell align="center">포인트</StyledTableCell>
                    <StyledTableCell align="center">상태</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {this.state.inspectionData.map((el, index) => {
                    return (
                      <ProjectHistory
                        key={index}
                        title={el.title}
                        date={el.date}
                        reward={el.reward}
                        data_type={el.project_type}
                        data_id={el.id}
                        status={el.status}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </InfiniteScroll>
          </TableContainer>
        ) : (
          <TableContainer id="normalScrollableDiv">
            <InfiniteScroll
              dataLength={this.state.normalData.length}
              next={this.fetchMoreNormalData}
              hasMore={this.state.hasMoreNormalData}
              loader={<h4>생산 작업 내역을 가져오는 중...</h4>}
              scrollableTarget="normalScrollableDiv"
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>더 이상 가져올 내역이 없습니다</b>
                </p>
              }
            >
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell align="center">날짜</StyledTableCell>
                    <StyledTableCell align="center">제목</StyledTableCell>
                    <StyledTableCell align="center">포인트</StyledTableCell>
                    <StyledTableCell align="center">상태</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {this.state.normalData.map((el, index) => {
                    return (
                      <ProjectHistory
                        key={index}
                        id={el.id}
                        title={el.title}
                        date={el.date}
                        reward={el.reward}
                        data_type={el.project_type}
                        data_id={el.id}
                        status={el.status}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </InfiniteScroll>
          </TableContainer>
        )}
      </Container>
    );
  }
}

export default CreatorHistoryPage;
