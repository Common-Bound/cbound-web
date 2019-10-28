import React, { Component } from "react";
// import { Route } from "react-router-dom";
// node.js library that concatenates classes (strings)
// import classnames from "classnames";
// react plugin used to create charts
import Chart from "chart.js";
// import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import styled from "styled-components";
import moment from "moment";

import "../../../assets/vendor/nucleo/css/nucleo.css";
import "../../../assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "../../../assets/scss/argon-dashboard-react.scss";

import Header from "../../Headers/Header.js";
import AdminFooter from "../../Footers/AdminFooter.js";
import Button from "@material-ui/core/Button";
import InfiniteScroll from "react-infinite-scroll-component";
import RequesterHistoryOrig from "../../card/RequesterHistoryOrig";

import { Card, CardHeader, Table, Container, Row, Col } from "reactstrap";

// core components
// import {
//   chartOptions,
//   parseOptions,
//   chartExample1,
//   chartExample2
// } from "../../../variables/charts.jsx";

const EntireContainer = styled.div`
  width: 100%;
`;

const EntireTitleBackground = styled.div`
  width: 100%;

  background: linear-gradient(87deg, #212529 0, #212229 100%) !important;
`;

const EntireTitleContainer = styled.div`
  width: 92%;
  margin: 0 auto;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 40px 0px;

  color: black; !important;

  @media(max-width: 810px){
    width: 90%;
  }
  @media(max-width: 500px){
    width: 85%;
    padding: 24px 0px;
  }
`;

const LeftTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LeftTitleDate = styled.div`
  font-family: Avenir;
  text-align: left;
  color: #8d8d8d;
  font-size: 16px;
  color: white;

  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

const LeftTitle = styled.div`
  font-family: SpoqaHanSans;
  text-align: left;
  font-weight: bold;
  font-size: 32px;
  color: white;

  @media (max-width: 500px) {
    font-size: 28px;
  }
`;

const MainChartContainer = styled.div`
  width: 92%;
  margin: 0 auto;

  display: flex;

  @media (max-width: 810px) {
    flex-direction: column;
  }
`;

const LineChartContainer = styled.div`
  width: 55%;
  padding: 20px;

  display: flex;
  flex-direction: column;

  @media (max-width: 810px) {
    width: 100%;
  }
`;

const LineChartButtonContaner = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  width: 80px !important;
  height: 36px !important;
  margin: 6px !important;
`;

const PieChartContainer = styled.div`
  width: 45%;
  height: auto;
  padding-top: 68px;

  @media (max-width: 810px) {
    width: 100%;
    padding-top: 40px;
  }

  @media (max-width: 500px) {
    padding-top: 20px;
  }
`;

const PieCanvas = styled.canvas`
  height: 300px;
`;

const HistoryContainer = styled.div`
  width: 80%;
  height: 60vh;
  margin: 0 auto;

  overflow: scroll;
`;

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // activeNav: 1,
      // chartExample1Data: "data1",
      data: undefined,
      chartTerms: "month",
      inspectionData: [],
      hasMoreInspectionData: true,
      inspectionPage: 0,
      month_count: []
    };
  }

  async componentDidMount() {
    await this.fetchData();
    this.drawLineChart();
    this.drawPieChart();
    await this.fetchMoreInspectionData();
    console.log(this.props.location);
  }

  async fetchMoreInspectionData() {
    const url = `/api${this.props.match.url}/${this.state.inspectionPage}`;
    console.log(url);
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
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

  // toggleNavs = (e, index) => {
  //   e.preventDefault();
  //   this.setState({
  //     activeNav: index,
  //     chartExample1Data:
  //       this.state.chartExample1Data === "data1" ? "data2" : "data1"
  //   });
  //   let wow = () => {
  //     console.log(this.state);
  //   };
  //   wow.bind(this);
  //   setTimeout(() => wow(), 1000);
  //   // this.chartReference.update();
  // };

  fetchData = async () => {
    const url = `/api${this.props.match.url}`;
    console.log(url);

    const result = await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);

        return new Promise(resolve => resolve(data.result));
      })
      .catch(err => {
        console.log(err);
      });

    await this.setState({
      data: result
    });
    return new Promise(resolve => resolve(result));
  };

  drawLineChart = () => {
    var ctx = document.getElementById("line-chart").getContext("2d");
    new Chart(ctx, {
      // The type of chart we want to create
      type: "line",
      // The data for our dataset
      data: {
        labels:
          this.state.chartTerms === "month"
            ? [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
              ]
            : ["week1", "week2", "week3", "week4"],
        datasets: [
          {
            label: "생산된 데이터 수",
            // backgroundColor: "rgb(255, 99, 132)",
            backgroundColor: "#ff8787",
            borderColor: "#ff8787",
            pointBorderWidth: 4,
            pointHoverBorderWidth: 12,
            data:
              this.state.chartTerms === "month"
                ? this.state.data.month_count
                : this.state.data.weekly_count
          }
        ]
      },

      // Configuration options go here
      options: {}
    });
  };

  drawPieChart = () => {
    const data = this.state.data;
    var ctx = document.getElementById("pie-chart").getContext("2d");
    new Chart(ctx, {
      // The type of chart we want to create
      type: "pie",
      // The data for our dataset
      data: {
        labels: ["검수 대기", "검수 완료"],
        datasets: [
          {
            label: "데이터 검수율",
            backgroundColor: ["#94d82d", "#4dabf7"],
            borderColor: "white",
            borderWidth: 1,
            data: [
              data.total_count - data.inspected_count,
              data.inspected_count
            ]
          }
        ]
      },

      // Configuration options go here
      options: {
        cutoutPercentage: 50
      }
    });
  };

  toggleTerms = async e => {
    console.log(e.target.innerHTML);
    await this.setState({
      chartTerms: e.target.innerHTML.toLowerCase()
    });

    this.drawLineChart();
  };

  // componentWillMount = async () => {
  //   if (window.Chart) {
  //     parseOptions(Chart, chartOptions());
  //   }
  // };

  // getRoutes = routes => {
  //   return routes.map((prop, key) => {
  //     if (prop.layout === "/admin") {
  //       return (
  //         <Route
  //           path={prop.layout + prop.path}
  //           component={prop.component}
  //           key={key}
  //         />
  //       );
  //     } else {
  //       return null;
  //     }
  //   });
  // };

  render() {
    const info = this.props.info;
    const { chartTerms } = this.state;

    return (
      <EntireContainer className="main-content" ref="mainContent">
        <EntireTitleBackground>
          <EntireTitleContainer>
            <LeftTitleContainer>
              <LeftTitleDate>
                <span style={{ color: "white", fontWeight: "bold" }}>
                  {info ? "MISSION" : "STANDALONE"}
                </span>
                {info
                  ? ` ${moment(info.created_at).format(
                      "YYYY-MM-DD"
                    )} - ${moment(info.due_date).format("YYYY-MM-DD")}`
                  : ""}
              </LeftTitleDate>
              <LeftTitle>{info ? info.title : "이미지 라벨링"}</LeftTitle>
            </LeftTitleContainer>
          </EntireTitleContainer>
        </EntireTitleBackground>
        <Header data={this.state.data} />
        {/* Page content */}
        <MainChartContainer>
          <LineChartContainer>
            <LineChartButtonContaner>
              <StyledButton
                onClick={this.toggleTerms.bind(this)}
                variant={chartTerms === "month" ? "contained" : undefined}
                color="secondary"
              >
                Month
              </StyledButton>
              <StyledButton
                onClick={this.toggleTerms.bind(this)}
                variant={chartTerms === "week" ? "contained" : undefined}
                color="secondary"
              >
                Week
              </StyledButton>
            </LineChartButtonContaner>
            <canvas id="line-chart"></canvas>
          </LineChartContainer>
          <PieChartContainer>
            <PieCanvas id="pie-chart"></PieCanvas>
          </PieChartContainer>
        </MainChartContainer>
        <HistoryContainer id="inspectionScrollableDiv">
          <Container className="mt--1" fluid>
            <InfiniteScroll
              dataLength={this.state.inspectionData.length}
              next={this.fetchMoreInspectionData.bind(this)}
              hasMore={this.state.hasMoreInspectionData}
              loader={<h4>검수 작업 내역을 가져오는 중...</h4>}
              scrollableTarget="inspectionScrollableDiv"
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>더 이상 가져올 내역이 없습니다</b>
                </p>
              }
            >
              <Row className="mt-5">
                <Col className="mb-5 mb-xl-0" xl="8">
                  <Card className="shadow">
                    <CardHeader className="border-0">
                      <Row className="align-items-center">
                        <div className="col">
                          <h3 className="mb-0">Recent activity</h3>
                        </div>
                        {/*<div className="col text-right">
                          <Button
                            color="primary"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                            size="sm"
                          >
                            See all
                          </Button> 
                        </div>*/}
                      </Row>
                    </CardHeader>
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">해당 이미지</th>
                          <th scope="col">날짜</th>
                          <th scope="col">신용도</th>
                          <th scope="col">상태</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.inspectionData.map((el, index) => {
                          return (
                            <RequesterHistoryOrig
                              key={index}
                              data_id={el.id}
                              name={el.orig_image}
                              date={el.created_at}
                              credit={"temp"}
                              status={el.status}
                            />
                          );
                        })}
                      </tbody>
                    </Table>
                  </Card>
                </Col>
              </Row>
            </InfiniteScroll>
          </Container>{" "}
        </HistoryContainer>
        <Container fluid>
          <AdminFooter />
        </Container>
      </EntireContainer>
    );
  }
}

export default DashBoard;
