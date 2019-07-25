import React, { Component } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./Body.css";
import CropInfoList from "./CropInfoList.js";

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orig_image: "",
      crop_image: [],
      crop: {},
      label: ""
    };
    this.handleSendAll = this.handleSendAll.bind(this);
  }

  sendData = (bodyData, sendTo) => {
    console.log("submitted");

    fetch(sendTo, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: bodyData
    })
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        console.log("Data received");
        switch (sendTo) {
          case "/work":
            this.putReceivedDataToCropImage(data);
            break;
          case "/work/complete":
            console.log("complete");
            break;
          default:
            break;
        }
        console.log(data);
      })
      .catch(function(ex) {
        console.log("error occured");
        console.log(ex);
      });
  };

  putReceivedDataToCropImage(data) {
    this.setState({ crop_image: data.meta.crop_image });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onFileSelected = async e => {
    // 파일 보내주면 됨
    /*await this.getBase64(e.target.files[0]).then(data =>
      this.setState({
        orig_image: data
      })
    );*/

    this.setState({
      orig_image: e.target.files[0]
    });
    const bodyData = new FormData();
    bodyData.append("imgFile", this.state.orig_image);
    this.sendData(bodyData, "/task");
    console.log(this.state.orig_image);
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // As Base64 string
    // ;

    // As a blobreturn new Promise(resolve => {
    return new Promise(resolve => {
      resolve(canvas.toDataURL());
    });
  }

  handleImageLoaded = image => {
    this.imageRef = image;
  };

  handleOnCropChange = crop => {
    this.setState({ crop: crop });
  };

  handleOnCropComplete = async e => {
    const cropData = this.state.crop;
    const image = new Image();
    image.src = this.state.orig_image;
    if (this.state.orig_image && this.state.label) {
      this.setState(
        {
          crop_image: this.state.crop_image.concat({
            imgSrc: await this.getCroppedImg(this.imageRef, this.state.crop),
            x: cropData.x,
            y: cropData.y,
            width: cropData.width,
            height: cropData.height,
            label: this.state.label
          })
        },
        () => {
          console.log(this.state.crop_image[0].imgSrc);
        }
      );
    }
  };

  handleSendAll() {
    this.sendData(
      {
        orig_image: this.state.orig_image,
        meta: {
          crop_image: this.state.crop_image
        }
      },
      "/task/complete"
    );
  }

  handleKeyPress = e => {
    if (e.charCode === 13) {
      e.preventDefault();
      this.handleOnCropComplete();
    }
  };
  render() {
    const workStyle = {
      borderTop: "3px solid lightgrey"
    };
    return (
      <div>
        <hr style={workStyle} />
        <div>
          <ReactCrop
            src={this.state.orig_image}
            crop={this.state.crop}
            onChange={this.handleOnCropChange}
            onImageLoaded={this.handleImageLoaded}
          />
        </div>
        <br />

        <div>
          <form>
            <label className="fileContainer">
              업로드
              <input type="file" onChange={this.onFileSelected} />
            </label>
            <div className="input-group mb-3">
              <input
                value={this.state.label}
                className="form-control"
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                name="label"
                placeholder="label"
                aria-label="label"
                aria-describedby="label input"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.handleOnCropComplete}
                  id="button-addon2"
                >
                  저장
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={this.handleSendAll}
                >
                  완전 다 보내기
                </button>
              </div>
            </div>
          </form>
        </div>
        <CropInfoList
          orig_image={this.state.orig_image}
          data={this.state.crop_image}
        />
      </div>
    );
  }
}

export default Body;
