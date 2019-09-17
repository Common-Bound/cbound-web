import React, { Component } from "react";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import moment from "moment";
import Body from "./Body";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { isNumber } from "util";

const Container = styled.div`
  width: 80%;
  margin: 0 auto;

  display: ${props => (props.display ? props.display : "flex")};
  flex-direction: column;
  justify-content: flex-start;
  align-items: cneter;
`;

const EntireTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0px 10px 10px;
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
`;

const LeftTitle = styled.div`
  font-family: SpoqaHanSans;
  text-align: left;
  font-weight: bold;
  font-size: 32px;
`;

const RightTitleContainer = styled.div`
  font-family: Avenir;
  display: flex;
  flex-direction: column;

  padding: 10px;
`;

const RightTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  text-align: right;
`;

const RightTitleDate = styled.div`
  font-size: 16px;
  text-align: right;
  color: #8d8d8d;
`;

const MainContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
`;

const FileListContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  padding-bottom: 10px;
`;

const FileList = styled.div`
  width: 640px;
  height: 64px;

  display: flex;

  justify-content: flex-start;
  align-items: center;

  overflow: scroll;
  border: 1px solid lightgrey;
`;

const FileThumbnail = styled.div`
  min-width: 50px;
  height: 50px;
  margin: 0px 5px;

  border: 1px solid lightgrey;

  background-image: url(${props => props.base64});
  background-size: 100% 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  jusify-content: flex-end;
`;

const StyledFormControl = styled(FormControl)`
  width: 200px;
`;

const StyledButton = styled(Button)`
  height: 60px;
`;

const BodyContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
`;

const BodyMainContainer = styled.div`
  width: 100%;
`;

const LeftMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  align-items: center;
  justify-content: flex-start;
`;

const RightDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  align-items: flex-end;
  padding: 20px 20px 0px 20px;

  width: 440px;
  height: 440px;
  background-color: #f0f0f0;
`;

const DescriptionBoxContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DescriptionBox = styled.div`
  font-family: SpoqaHanSans;
  font-size: 18px;
  padding: 14px;
`;

const DropZoneBox = styled.div`
  width: 640px;
  height: 440px;
  background-color: white;
  border: 5px solid lightgrey;
                          
  border-radius: 20px;
  font-family: Avenir;
  font-size: 25px
  font-weight: bold;
  text-align: center;
  line-height: 370px;
`;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orig_image_files: undefined,
      orig_image_base64: undefined,
      bodies: undefined,
      format: "", // EXPORT 할 때의 데이터 포맷
      time_counter: [], // 각 이미지를 작업하는데 걸린 시간
      timer: "",
      pre_select: 0
    };
    this.Refs = [];
  }

  // 업로드된 이미지를 출력하기 위해 Base64로 바꿀 때 호출됨
  async getBase64(files) {
    const base64s = await files.map(file => {
      // File 을 Base64로 바꿔줌
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    });

    const result = await Promise.all(base64s);

    return new Promise(resolve => resolve(result));
  }

  // 이미지가 업로드 되었을 때 호출됨
  onFileSelected = async files => {
    console.log(files);
    // 이미지가 업로드 되었을 때 기존에 크롭된 영역을 초기화함
    await this.setState({
      orig_image_files: files
    });

    await this.getBase64(files).then(
      base64s =>
        new Promise(resolve => {
          resolve(
            this.setState({
              orig_image_base64: base64s
            })
          );
        })
    );
    console.log(this.state.orig_image_base64);

    const bodies = await this.state.orig_image_files.map((file, index) => {
      return new Promise(resolve => {
        resolve(
          <Body
            key={index}
            class="bodies"
            info={this.props.info}
            project_type={this.props.project_type}
            project_id={this.props.project_id}
            display={index === 0 ? "flex" : "none"}
            orig_image_file={file}
            orig_image_base64={this.state.orig_image_base64[index]}
            handleSendAll={this.handleSendAll}
            ref={ref => {
              this.Refs[index] = ref;
            }}
          />
        );
      });
    });

    const newBodies = await Promise.all(bodies);
    await this.setState({
      bodies: newBodies
    });

    var tempTimeCounterArray = [];
    for (var i = 0; i < this.state.bodies.length; i++) {
      var temp = { index: i, time: 0 };
      tempTimeCounterArray.push(temp);
    }

    this.setState({
      time_counter: tempTimeCounterArray,
      timer: new Date().getTime(),
      pre_select: 0
    });
  };

  handleClick = e => {
    const index = Number(e.target.dataset.index);

    // 해당 썸네일의 index에 해당하는 Body를 display 시킨다
    const bodyHTMLCollections = document.getElementsByClassName("bodies");

    const bodyNodes = Array.from(bodyHTMLCollections);

    bodyNodes.forEach((body, _id) => {
      if (_id === index) {
        body.style.display = "flex";
      } else body.style.display = "none";
    });

    this.setState(
      {
        time_counter: this.state.time_counter.map(el => {
          if (el.index === this.state.pre_select) {
            return {
              index: this.state.pre_select,
              time: el.time + new Date().getTime() - this.state.timer
            };
          } else return el;
        }),
        timer: new Date().getTime(),
        pre_select: index
      },
      () => {
        console.log(this.state.time_counter);
      }
    );
  };

  // 작업한 내용 전부를 서버로 전송함
  handleSendAll = async () => {
    let format = this.state.format;
    const files = this.state.orig_image_files;

    // Export 형식이 'csv' 인 경우
    if (format === "csv") {
      let content =
        "data:text/csv;charset=utf-8,file_name,file_size,region_count,region_id,shape_attributes,region_attributes\n";

      const bodyRowsPromises = await this.Refs.map(async (body, index) => {
        let rowArray = [];

        function replaceAll(str, searchStr, replaceStr) {
          return str.split(searchStr).join(replaceStr);
        }

        const crop_image = body.getCropImageData();
        const file_name = files[index].name;
        const file_size = files[index].size;
        const region_count = crop_image.length;

        const cropPromises = await crop_image.map(async crop => {
          const crop_id = crop.shape_attributes.id;
          let shape_attributes = crop.shape_attributes;
          let region_attributes = JSON.stringify(crop.region_attributes);

          const naturalWidth = await this.checkImageSize(index);

          // 계산된 naturalWidth 가 숫자라면(640 보다 큰 경우) 좌표를 재조정해준다
          if (isNumber(naturalWidth)) {
            shape_attributes = await this.resizeCropLocation(
              naturalWidth,
              shape_attributes
            );
            shape_attributes = JSON.stringify(shape_attributes);
          }

          shape_attributes = replaceAll(shape_attributes, '"', '""');
          shape_attributes = '"' + shape_attributes + '"';

          region_attributes = replaceAll(region_attributes, '"', '""');
          region_attributes = '"' + region_attributes + '"';
          let row = [];

          row.push(file_name);
          row.push(file_size);
          row.push(region_count);
          row.push(crop_id);
          row.push(shape_attributes);
          row.push(region_attributes);

          console.log(
            file_name,
            file_size,
            region_count,
            crop_id,
            shape_attributes,
            region_attributes
          );
          row = row.join(",");
          return new Promise(resolve => {
            resolve(row);
          });
        });

        let rows = await Promise.all(cropPromises);
        rows = rows.join("\n");
        console.log(rows);

        rowArray.push(rows);

        return new Promise(resolve => {
          resolve(rowArray);
        });
      });

      const rows = await Promise.all(bodyRowsPromises);
      console.log(rows);

      content += rows.join("\n");

      console.log(content);
      var encodedUri = encodeURI(content);
      window.open(encodedUri);
    }

    // Export 형식이 'json' 인 경우
    else if (format === "json") {
      // let content = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj))
      let JSONobj = {};
      const promises = await this.Refs.map(async (body, index) => {
        let crop_image = body.getCropImageData();
        const file_name = files[index].name;
        const file_size = files[index].size;
        const region_count = crop_image.length;

        const naturalWidth = await this.checkImageSize(index);

        // 계산된 naturalWidth 가 숫자라면(640 보다 큰 경우) 좌표를 재조정해준다
        if (isNumber(naturalWidth)) {
          // 각 crop 에 포함된 shape_attributes 를 resize 해준다
          const resizedShapeAttributesPromises = await crop_image.map(
            async crop => {
              let new_shape = await this.resizeCropLocation(
                naturalWidth,
                crop.shape_attributes
              );
              return new Promise(resolve => resolve(new_shape));
            }
          );

          const new_shape_attributes = await Promise.all(
            resizedShapeAttributesPromises
          );

          crop_image.forEach((crop, index) => {
            crop_image[index].shape_attributes = new_shape_attributes[index];
          });
        }

        JSONobj[file_name] = {};
        JSONobj[file_name]["file_name"] = file_name;
        JSONobj[file_name]["file_size"] = file_size;
        JSONobj[file_name]["region_count"] = region_count;
        JSONobj[file_name]["regions"] = crop_image;

        return new Promise(resolve => resolve(true));
      });

      await Promise.all(promises);

      console.log(JSONobj);
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

    // 서버로 전송
    this.Refs.forEach(body => {
      body.handleSendAll();
    });
    alert(
      "작업이 완료되었습니다. 포인트는 검수를 통과하는 즉시 지급되니 잠시 기다려 주시기 바랍니다."
    );
  };

  handleChange = e => {
    console.log(e.target.value);
    this.setState({
      format: e.target.value
    });
  };

  /**
   *
   * @param {orig_state_file 을 참조할 인덱스} index
   * @dev  파일 이미지의 naturalWidth가 640px 보다 크다면 true, 아니면 false를 리턴한다
   */
  async checkImageSize(index) {
    const base64 = this.state.orig_image_base64[index];

    const img = document.createElement("img");
    img.setAttribute("src", base64);
    img.setAttribute("alt", "");
    const naturalWidth = Number(img.naturalWidth);
    console.log("natural width: " + img.naturalWidth);

    // 이미지의 원래 width가 640px 보다 크다면, 크롭 좌표들을 적절한 비율로 되돌려줘야한다
    if (naturalWidth > 640) {
      return new Promise(resolve => {
        resolve(naturalWidth);
      });
    } else return new Promise(resolve => resolve(null));
  }

  resizeCropLocation(naturalWidth, shape_attributes) {
    const scale = naturalWidth / 640;
    console.log("scale: " + scale);
    const s = shape_attributes;

    const id = s.id;
    const new_x = s.x * scale;
    const new_y = s.y * scale;
    const new_width = s.width * scale;
    const new_height = s.height * scale;

    return new Promise(resolve => {
      resolve({
        id: id,
        x: Number.parseFloat(new_x).toFixed(0),
        y: Number.parseFloat(new_y).toFixed(0),
        width: Number.parseFloat(new_width).toFixed(0),
        height: Number.parseFloat(new_height).toFixed(0)
      });
    });
  }

  render() {
    const { format, orig_image_files, orig_image_base64, bodies } = this.state;

    let info = this.props.info;
    let t1;
    let t2;
    let days;
    let hours;
    let minutes;

    // 만약 프로젝트 정보가 주어졌다면, 시간을 계산하고 그렇지 않다면(standalone 이라면) 건너 뛴다
    if (info) {
      info = this.props.info;

      t1 = moment();
      t2 = moment(info.due_date);

      days = moment.duration(t2.diff(t1)).days();
      hours = moment.duration(t2.diff(t1)).hours();
      minutes = moment.duration(t2.diff(t1)).minutes();
    }

    return (
      <Container display={this.props.display}>
        {/* 최 상단에 위취한 정보를 보여주는 컨테이너 */}
        <EntireTitleContainer>
          <LeftTitleContainer>
            <LeftTitleDate>
              <span style={{ color: "black", fontWeight: "bold" }}>
                {info ? "MISSION" : "STANDALONE"}
              </span>
              {info
                ? ` ${moment(info.created_at).format("YYYY-MM-DD")} - ${moment(
                    info.due_date
                  ).format("YYYY-MM-DD")}`
                : ""}
            </LeftTitleDate>
            <LeftTitle>{info ? info.title : "이미지 라벨링"}</LeftTitle>
          </LeftTitleContainer>
          <RightTitleContainer>
            <RightTitle>DEADLINE</RightTitle>
            <RightTitleDate>
              {info
                ? `${days} DAYS : ${hours} HOURS : ${minutes} MINUTES`
                : "UNLIMITED"}
            </RightTitleDate>
          </RightTitleContainer>
        </EntireTitleContainer>
        {/* 이미지 업로드 창과 이미지, 설명을 보여주는 메인 컨테이너 */}
        <MainContainer>
          <FileListContainer>
            {/* 파일 썸네일 영역 */}
            {!orig_image_base64 ? (
              <FileList>
                <FileThumbnail />
                <FileThumbnail />
                <FileThumbnail />
              </FileList>
            ) : (
              <FileList>
                {orig_image_base64.map((base64, index) => {
                  return (
                    <FileThumbnail
                      key={index}
                      onClick={this.handleClick.bind(this)}
                      base64={base64}
                      data-index={index}
                    />
                  );
                })}
              </FileList>
            )}
            <ButtonContainer>
              {!info && orig_image_files ? (
                <StyledFormControl variant="outlined">
                  <InputLabel>Export as</InputLabel>
                  <Select
                    value={format}
                    onChange={this.handleChange.bind(this)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                </StyledFormControl>
              ) : (
                ""
              )}
              {orig_image_files ? (
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={this.handleSendAll.bind(this)}
                >
                  완료하기
                </StyledButton>
              ) : (
                ""
              )}
            </ButtonContainer>
          </FileListContainer>
          {!orig_image_files ? (
            <BodyContainer>
              {/* Main Container 의 왼쪽 영역 */}
              <LeftMainContainer>
                {/* 파일 올리는 DropZone */}
                <Dropzone onDrop={this.onFileSelected}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <DropZoneBox>[+] UPLOAD IMAGE</DropZoneBox>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </LeftMainContainer>
              {/* Main Container 의 오른쪽 영역 */}
              <RightDescriptionContainer>
                <DescriptionBoxContainer>
                  <DescriptionBox>
                    좌측 [+] 영역을 클릭하여 이미지를 업로드 해 주세요 (단,
                    이미지 선명하지 않거나 해상도가 낮으면 업로드 되지 않습니다)
                  </DescriptionBox>
                  {/* <DescriptionBox>
                  2. 이미지가 정상적으로 업로드 되어 바운드 되면, AI가 자동으로
                  글자라고 인식하여 이미지들을 아래 썸네일로 보여줍니다.
                </DescriptionBox> */}
                </DescriptionBoxContainer>
              </RightDescriptionContainer>
            </BodyContainer>
          ) : (
            <BodyMainContainer>{bodies}</BodyMainContainer>
          )}
        </MainContainer>
      </Container>
    );
  }
}

export default Main;
