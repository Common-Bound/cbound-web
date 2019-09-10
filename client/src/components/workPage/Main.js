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
      crop_image: [], // 지금까지 크롭한 영역들의 정보 리스트 (x, y, width, height)
      crop: {}, // ReactCrop 에 사용되는 값으로 크롭 영역이 변경될 때 함께 변경됨. (현재 크롭 영역에 대한 정보를 가지고 있음)
      label: "", // 작업한 영역에 대해 레이블링 할 때 사용되는 입력창의 변경 사항에 대해 저장함
      imageRef: null, // 크롭 컨테이너에 이미지가 로드 되었을 때 이미지 값을 저장함
      changeMode: false, // 현재 크롭된 이미지를 추가해야 할지 수정해야 할지 결정하는 Flag
      preId: "", // ChangeMode 가 true 라면 변경할 이미지의 id
      showEdit: true, // 한 개의 크롭 영역을 변경할 수 있는 이미지를 줄지 크롭된 영역 리스트를 이미지에 그려줄 지
      useAI: true, // AI를 사용할지 말지 스위치 할 때 변경할 값
      loading: false,
      step: 0, // 현재 STEP 수,
      format: undefined // EXPORT 할 때의 데이터 포맷
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
    //console.log(files[0]);
    await this.setState({
      orig_image_files: files
      // __nextkey: 0,
      // crop_image: [],
      // crop: {},
      // label: "",
      // imageRef: "",
      // changeMode: false,
      // preId: "",
      // orig_image: null
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

    // AI를 사용할 경우에만 이미지 데이터를 서버로 전송해줌
    // if (this.state.useAI) {
    //   const bodyData = new FormData();
    //   bodyData.append("orig_image", this.state.orig_image);

    //   this.sendData(bodyData, "/mypage/creator/task/normal"); // 서버로 전송( /mypage/task)
    // }

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
  };

  // 작업한 내용 전부를 서버로 전송함
  handleSendAll = async () => {
    let format = this.state.format;
    const files = this.state.orig_image_files;

    // Export 형식이 'csv' 인 경우
    if (format === "csv") {
      let content =
        "data:text/csv;charset=utf-8,file_name,file_size,region_count,region_id,region_attributes\n";

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
          const crop_id = crop.id;
          let crop_string = JSON.stringify(crop);
          crop_string = replaceAll(crop_string, '"', '""');
          crop_string = '"' + crop_string + '"';
          let row = [];

          row.push(file_name);
          row.push(file_size);
          row.push(region_count);
          row.push(crop_id);
          row.push(crop_string);

          console.log(file_name, file_size, region_count, crop_id, crop_string);
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
      this.Refs.forEach((body, index) => {
        const crop_image = body.getCropImageData();
        const file_name = files[index].name;
        const file_size = files[index].size;
        const region_count = crop_image.length;

        JSONobj[file_name] = {};
        JSONobj[file_name]["file_name"] = file_name;
        JSONobj[file_name]["file_size"] = file_size;
        JSONobj[file_name]["region_count"] = region_count;
        JSONobj[file_name]["regions"] = crop_image;
      });

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
              {orig_image_files ? (
                <StyledFormControl variant="outlined">
                  <InputLabel>Export as</InputLabel>
                  <Select
                    value={format}
                    onChange={this.handleChange.bind(this)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {!info ? <MenuItem value="json">JSON</MenuItem> : ""}
                    {!info ? <MenuItem value="csv">CSV</MenuItem> : ""}
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
