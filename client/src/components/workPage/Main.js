import React, { Component } from "react";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import Body from "./Body";

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

const FileList = styled.div`
  width: 100px;
  height: 500px;

  display: flex;
  flex-direction: column;

  justify-content: flex-start;
  align-items: center;

  overflow: scroll;

  border: 1px solid lightgrey;
`;

const FileThumbnail = styled.div`
  width: 80%;
  height: 80px;
  margin: 5px auto;

  border: 1px solid lightgrey;

  background-image: url(${props => props.base64});
  background-size: 100% 100%;
`;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orig_image_files: undefined,
      orig_image_base64: undefined,
      bodies: undefined
    };
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

    const newBodies = await this.state.orig_image_files.map((file, index) => {
      return new Promise(resolve => {
        resolve(
          <Body
            orig_image_file={file}
            orig_image_base64={this.state.orig_image_base64[index]}
          />
        );
      });
    });

    await Promise.all(newBodies);
    await this.setState({
      bodies: newBodies
    });

    console.log(this.state);
  };

  render() {
    return (
      <div>
        {/* 파일 올리는 DropZone */}
        {!this.state.orig_image_files ? (
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
        ) : (
          ""
        )}
        {!this.state.orig_image_base64 ? (
          <FileList>
            <FileThumbnail />
            <FileThumbnail />
            <FileThumbnail />
          </FileList>
        ) : (
          <FileList>
            {this.state.orig_image_base64.map(base64 => {
              return <FileThumbnail base64={base64} />;
            })}
          </FileList>
        )}
      </div>
    );
  }
}

export default Main;
