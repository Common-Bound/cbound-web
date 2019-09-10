import React from "react";

import { Route, Switch, Link } from "react-router-dom";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components

import "../../assets/vendor/nucleo/css/nucleo.css";
import "../../assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/scss/argon-dashboard-react.scss";

import Header from "../../components/Headers/Header.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import routes from "routes.js";
import styled from "styled-components";
import AdminFooter from "../../components/Footers/AdminFooter.jsx";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts.jsx";

const LeftBanner = styled.div`
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 64px;

  display: flex;
  flex-flow: column;
  align-items: center;

  background: #353535;
  color: white;
  z-index: 1;
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;

  width: 80%;
  margin: 0 auto;
  height: 40px;
  margin-top: 20px;

  text-decoration: none !important;

  color: rgba(255, 255, 255, 0.3);

  :hover {
    color: white;
  }
`;

const AllProjectButton = styled(StyledLink)`
  color: ${props =>
    props.pathname === "/mypage/creator"
      ? "white"
      : "rgba(255, 255, 255, 0.3)"};
`;

const MyProjectButton = styled(StyledLink)`
  color: ${props =>
    props.pathname === "/mypage/creator/projects"
      ? "white"
      : "rgba(255, 255, 255, 0.3)"};
`;

const Icon = styled.i`
  transform: scale(1.4, 1.4);
`;

const IconTitle = styled.div`
  width: 100px;
  margin-left: 14px;
  font-family: Avenir;
`;

const Section = styled.div`
  position: relative;
  padding-left: 200px;
  padding-top: 0px;
`;

class RequesterBody extends React.Component {
  state = {
    activeNav: 1,
    chartExample1Data: "data1"
  };
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1"
    });
    let wow = () => {
      console.log(this.state);
    };
    wow.bind(this);
    setTimeout(() => wow(), 1000);
    // this.chartReference.update();
  };
  componentWillMount() {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  render() {
    return (
      <>
        <LeftBanner>
          <MyProjectButton
            to={`${this.props.match.url}/projects`}
            pathname={this.props.location.pathname}
          >
            <Icon className="fas fa-list" />
            <IconTitle>My Projects</IconTitle>
          </MyProjectButton>
          <StyledLink
            to="/auth/signout"
            pathname={this.props.location.pathname}
          >
            <Icon className="fas fa-sign-in-alt" />
            <IconTitle>Sign Out</IconTitle>
          </StyledLink>
        </LeftBanner>
        <Section>
          <div className="main-content" ref="mainContent">
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid>
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
                      {/* Chart */}
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
                      {/* Chart */}
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
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
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
                          <td>90%</td>
                          <td>14</td>
                          <td>
                            <i className="fas fa-plus text-success mr-3" />{" "}
                            Create
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">HyunSeoCHOI</th>
                          <td>PERFECT</td>
                          <td>100043</td>
                          <td>
                            <i className="fas fa-check text-warning mr-3" />{" "}
                            Inspect
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">KuangMei</th>
                          <td>94%</td>
                          <td>102</td>
                          <td>
                            <i className="fas fa-check text-warning mr-3" />{" "}
                            Inspect
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">GeunHyePARK</th>
                          <td>40%</td>
                          <td>147</td>
                          <td>
                            <i className="fas fa-plus text-success mr-3" />{" "}
                            create
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">MR.JWA</th>
                          <td>PERFECT</td>
                          <td>7</td>
                          <td>
                            <i className="fas fa-check text-danger mr-3" />{" "}
                            Inspect
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
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
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
            </Container>
            <Container fluid>
              <AdminFooter />
            </Container>
          </div>
        </Section>
      </>
    );
  }
}

export default RequesterBody;
