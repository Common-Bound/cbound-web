import React, { Component } from "react";
import Chart from "chart.js";
import styled from "styled-components";
import moment from "moment";

// import "../../../assets/vendor/nucleo/css/nucleo.css";
// import "../../../assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
// import "../../../assets/scss/argon-dashboard-react.scss";

import Header from "../../Headers/Header.js";
import AdminFooter from "../../Footers/AdminFooter.js";
import Button from "@material-ui/core/Button";
import InfiniteScroll from "react-infinite-scroll-component";
import RequesterHistoryOrig from "../../card/RequesterHistoryOrig";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
  margin: 10px auto;

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
  height: 50px !important;

  @media (max-width: 500px) {
    width: 60px !important;
    height: 36px !important;
  }
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
  width: 90%;
  height: 60vh;
  margin: 10px auto;

  display: flex;
  flex-direction: column;
`;

const HistoryTitleContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const HistoryContainerTitle = styled.div`
  font-family: SpoqaHanSans;
  text-align: left;
  font-weight: bold;
  font-size: 28px;
  color: black;
  margin: 10px 0px;

  @media (max-width: 1024px) {
    font-size: 24px;
  }
  @media (max-width: 500px) {
    font-size: 18px;
  }
`;

const DownloadContainer = styled.div``;

const StyledFormControl = styled(FormControl)`
  width: 160px;

  @media (max-width: 1024px) {
    width: 120px;
  }
  @media (max-width: 500px) {
    width: 80px;
    font-size: 10px;
  }
`;

const StyledInputLabel = styled(InputLabel)`
  word-break: keep-all;

  @media (max-width: 500px) {
    font-size: 12px !important;
    padding-right: 16px !important;
  }
`;

const DownloadButton = styled(StyledButton)`
  width: 100px !important;

  @media (max-width: 500px) {
    width: 100px !important;
    height: 50px !important;
  }
`;

const TableWrapper = styled.div`
  height: 50vh;
  overflow: scroll;
`;

const StyledTableCell = styled(TableCell)`
  word-break: keep-all;
`;

const DataIDTableCell = styled(TableCell)`
  @media (max-width: 500px) {
    display: none !important;
  }
`;
const FooterContainer = styled.div`
  width: 100%;
  padding: 0px 40px;
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
      month_count: [],
      format: ""
    };
  }

  async componentDidMount() {
    await this.fetchData();
    this.drawLineChart();
    this.drawPieChart();
    await this.fetchMoreInspectionData();
    console.log("props", this.props);
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

  handleFormatChange = e => {
    this.setState({
      format: e.target.value
    });
  };

  handleDownload = async e => {
    if (this.state.format === "") {
      return alert("추출할 데이터 포맷을 지정해주세요");
    }
    const format = this.state.format;
    const url = `/api/mypage/requester/download/${this.props.project_id}`;
    const datas = await fetch(url)
      .then(res => res.json())
      .then(data => {
        return data;
      });

    // Export 형식이 'csv' 인 경우
    if (format === "csv") {
      let content =
        "data:text/csv;charset=utf-8,file_name,file_URL,region_count,region_id,shape_attributes,region_attributes\n";

      const bodyRowsPromises = await datas.map(async (data, index) => {
        let rowArray = [];

        function replaceAll(str, searchStr, replaceStr) {
          return str.split(searchStr).join(replaceStr);
        }

        const crop_image = data.payload.meta.crop_image;
        // file 이름을 가져오기 위해 orig_image 를 참조한다
        const splitted_url = data.payload.orig_image.split("/");
        const file_name = `${decodeURIComponent(splitted_url[5])}`;
        const file_URL = data.payload.orig_image;
        const region_count = crop_image.length;

        const cropPromises = await crop_image.map(async crop => {
          const crop_id = crop.shape_attributes.id;
          let shape_attributes = crop.shape_attributes;
          let region_attributes = JSON.stringify({
            label: crop.region_attributes.label
          });

          // const naturalWidth = await this.checkImageSize(index);

          // // 계산된 naturalWidth 가 숫자라면(640 보다 큰 경우) 좌표를 재조정해준다
          // if (isNumber(naturalWidth)) {
          //   shape_attributes = await this.resizeCropLocation(
          //     naturalWidth,
          //     shape_attributes
          //   );
          // }
          shape_attributes = await JSON.stringify(shape_attributes);

          shape_attributes = replaceAll(shape_attributes, '"', '""');
          shape_attributes = '"' + shape_attributes + '"';

          region_attributes = replaceAll(region_attributes, '"', '""');
          region_attributes = '"' + region_attributes + '"';
          let row = [];

          row.push(file_name);
          row.push(file_URL);
          row.push(region_count);
          row.push(crop_id);
          row.push(shape_attributes);
          row.push(region_attributes);

          row = row.join(",");
          return new Promise(resolve => {
            resolve(row);
          });
        });

        let rows = await Promise.all(cropPromises);
        rows = rows.join("\n");

        rowArray.push(rows);

        return new Promise(resolve => {
          resolve(rowArray);
        });
      });

      const rows = await Promise.all(bodyRowsPromises);

      content += rows.join("\n");

      var encodedURI = encodeURI(content);
      const downloadCSV = document.createElement("a");
      downloadCSV.setAttribute("href", encodedURI);
      downloadCSV.setAttribute("download", "dataset.csv");
      document.body.appendChild(downloadCSV); // required for firefox
      downloadCSV.click();
      downloadCSV.remove();
    }

    // Export 형식이 'json' 인 경우
    else if (format === "json") {
      // let content = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj))
      let JSONobj = {};
      const promises = await datas.map(async (data, index) => {
        var crop_images = data.payload.meta.crop_image;
        let crop_image = crop_images.map(crop => {
          return {
            shape_attributes: crop.shape_attributes,
            region_attributes: {
              label: crop.region_attributes.label
            }
          };
        });
        const splitted_url = data.payload.orig_image.split("/");
        const file_name = `${decodeURIComponent(splitted_url[5])}`;
        const file_URL = data.payload.orig_image;
        const region_count = crop_image.length;

        // const naturalWidth = await this.checkImageSize(index);

        // // 계산된 naturalWidth 가 숫자라면(640 보다 큰 경우) 좌표를 재조정해준다
        // if (isNumber(naturalWidth)) {
        //   // 각 crop 에 포함된 shape_attributes 를 resize 해준다
        //   const resizedShapeAttributesPromises = await crop_image.map(
        //     async crop => {
        //       let new_shape = await this.resizeCropLocation(
        //         naturalWidth,
        //         crop.shape_attributes
        //       );
        //       return new Promise(resolve => resolve(new_shape));
        //     }
        //   );

        //   const new_shape_attributes = await Promise.all(
        //     resizedShapeAttributesPromises
        //   );

        //   crop_image.forEach((crop, index) => {
        //     crop_image[index].shape_attributes = new_shape_attributes[index];
        //   });
        // }

        JSONobj[file_name] = {};
        JSONobj[file_name]["file_name"] = file_name;
        JSONobj[file_name]["file_URL"] = file_URL;
        JSONobj[file_name]["region_count"] = region_count;
        JSONobj[file_name]["regions"] = crop_image;

        return new Promise(resolve => resolve(true));
      });

      await Promise.all(promises);

      let content =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(JSONobj));

      const downloadJSON = document.createElement("a");
      downloadJSON.setAttribute("href", content);
      downloadJSON.setAttribute("download", "dataset.json");
      document.body.appendChild(downloadJSON); // required for firefox
      downloadJSON.click();
      downloadJSON.remove();
    }
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
    const { chartTerms, format } = this.state;

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
        <HistoryContainer>
          <HistoryTitleContainer>
            <HistoryContainerTitle>검수 데이터 현황</HistoryContainerTitle>
            <DownloadContainer>
              <StyledFormControl>
                <StyledInputLabel>Export as</StyledInputLabel>
                <Select
                  value={format}
                  onChange={this.handleFormatChange.bind(this)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="json">JSON</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </StyledFormControl>

              <DownloadButton
                onClick={this.handleDownload.bind(this)}
                variant="contained"
                color="secondary"
              >
                다운로드
              </DownloadButton>
            </DownloadContainer>
          </HistoryTitleContainer>
          <Paper>
            <TableWrapper id="inspectionScrollableDiv">
              <Table className="align-items-center table-flush" stickyHeader>
                <TableHead className="thead-light">
                  <TableRow>
                    <StyledTableCell align="center">
                      해당 이미지
                    </StyledTableCell>
                    <StyledTableCell align="center">날짜</StyledTableCell>
                    <DataIDTableCell align="center">데이터 ID</DataIDTableCell>
                    <StyledTableCell align="center">신용도</StyledTableCell>
                    <StyledTableCell align="center">상태</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
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
                  ></InfiniteScroll>
                </TableBody>
              </Table>
            </TableWrapper>
          </Paper>
        </HistoryContainer>
        <FooterContainer>
          <AdminFooter />
        </FooterContainer>
      </EntireContainer>
    );
  }
}

export default DashBoard;
