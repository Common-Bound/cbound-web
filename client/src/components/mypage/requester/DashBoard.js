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

import {
  //   Button,
  //   Card,
  //   CardHeader,
  //   CardBody,
  //   NavItem,
  //   NavLink,
  //   Nav,
  //   Progress,
  //   Table,
  Container
  //   Row,
  //   Col
} from "reactstrap";
import { Athena } from "aws-sdk";

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

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // activeNav: 1,
      // chartExample1Data: "data1",
      data: undefined,
      chartTerms: "month"
    };
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

  async componentDidMount() {
    await this.fetchData();
    this.drawLineChart();
    this.drawPieChart();
  }

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
    var chart = new Chart(ctx, {
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
                ? [0, 10, 5, 2, 20, 30, 45, 30, 25, 49, 69, 80]
                : [10, 20, 30, 40]
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
    var chart = new Chart(ctx, {
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

        {/* <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Overview
                      </h6>
                      <h2 className="text-white mb-0">Created Data</h2>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 1
                            })}
                            href="#pablo"
                            onClick={e => this.toggleNavs(e, 1)}
                          >
                            <span className="d-none d-md-block">Month</span>
                            <span className="d-md-none">M</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 2
                            })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={e => this.toggleNavs(e, 2)}
                          >
                            <span className="d-none d-md-block">Week</span>
                            <span className="d-md-none">W</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  // Chart
                  <div className="chart">
                    <Line
                      data={chartExample1[this.state.chartExample1Data]}
                      options={chartExample1.options}
                      getDatasetAtEvent={e => console.log(e)}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Performance
                      </h6>
                      <h2 className="mb-0">Total costs</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  // Chart
                  <div className="chart">
                    <Bar
                      data={chartExample2.data}
                      options={chartExample2.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Recent activity</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Creator Name</th>
                      <th scope="col">Credibility</th>
                      <th scope="col">Output</th>
                      <th scope="col">Activity Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">EunsuKimme</th>
                      <td>98%</td>
                      <td>14</td>
                      <td>
                        <i className="fas fa-plus text-success mr-3" /> Create
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">HyunSeoCHOI</th>
                      <td>93%</td>
                      <td>43</td>
                      <td>
                        <i className="fas fa-check text-warning mr-3" /> Inspect
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">KuangMei</th>
                      <td>94%</td>
                      <td>102</td>
                      <td>
                        <i className="fas fa-check text-warning mr-3" /> Inspect
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Dr.Stranger</th>
                      <td>23%</td>
                      <td>147</td>
                      <td>
                        <i className="fas fa-plus text-success mr-3" /> create
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">JungHyun</th>
                      <td>82%</td>
                      <td>7</td>
                      <td>
                        <i className="fas fa-check text-danger mr-3" /> Inspect
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Social traffic</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Referral</th>
                      <th scope="col">Visitors</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>1,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">60%</span>
                          <div>
                            <Progress
                              max="100"
                              value="60"
                              barClassName="bg-gradient-danger"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>5,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">70%</span>
                          <div>
                            <Progress
                              max="100"
                              value="70"
                              barClassName="bg-gradient-success"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Google</th>
                      <td>4,807</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">80%</span>
                          <div>
                            <Progress max="100" value="80" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Instagram</th>
                      <td>3,678</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">75%</span>
                          <div>
                            <Progress
                              max="100"
                              value="75"
                              barClassName="bg-gradient-info"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">twitter</th>
                      <td>2,645</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">30%</span>
                          <div>
                            <Progress
                              max="100"
                              value="30"
                              barClassName="bg-gradient-warning"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container> */}
        <Container fluid>
          <AdminFooter />
        </Container>
      </EntireContainer>
    );
  }
}

export default DashBoard;