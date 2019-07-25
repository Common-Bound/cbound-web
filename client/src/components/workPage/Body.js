import React, { Component } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./Body.css";
import CropInfoList from "./CropInfoList.js";

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      __nextkey: 0,
      orig_image: "",
      crop_image: [],
      crop: {},
      label: "",
      imageRef: ""
    };
    this.handleSendAll = this.handleSendAll.bind(this);
    this.putReceivedDataToCropImage = this.putReceivedDataToCropImage.bind(
      this
    );
  }

  sendData = (bodyData, sendTo) => {
    console.log("submitted");

    fetch(sendTo, {
      method: "post",
      body: bodyData
    })
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        console.log("Data received");
        switch (sendTo) {
          case "/task":
            this.putReceivedDataToCropImage(data);
            break;
          case "/task/complete":
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
    const bodyData = new FormData();
    bodyData.append("imgFile", e.target.files[0]);
    this.sendData(bodyData, "/task");

    await this.getBase64(e.target.files[0]).then(data =>
      this.setState({
        orig_image: data
      })
    );

    console.log(this.state.orig_image);
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // As Base64 string
  // ;

  // As a blobreturn new Promise(resolve => {

  handleImageLoaded = image => {
    this.setState({ imageRef: image });
  };

  handleOnCropChange = crop => {
    this.setState({ crop: crop });
  };

  handleOnCropComplete = async e => {
    const cropData = this.state.crop;
    const image = new Image();
    image.src = this.state.orig_image;
    if (this.state.orig_image && this.state.label) {
      this.setState({
        crop_image: this.state.crop_image.concat({
          id: this.state.__nextkey++,
          x: cropData.x,
          y: cropData.y,
          width: cropData.width,
          height: cropData.height,
          label: this.state.label
        }),
        label: ""
      });
      //console.log(this.state.crop_image[0].imgSrc);
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

  handleOnCropModify = id => {
    console.log(id);
  };

  handleOnCropRemove = id => {
    console.log(id);
    const { crop_image } = this.state;
    this.setState({
      crop_image: crop_image.filter(crop => crop.id !== id)
    });
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
                  id="store"
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
          crops={this.state.crop_image}
          image={this.state.imageRef}
          onChange={this.handleOnCropModify}
          onRemove={this.handleOnCropRemove}
        />
      </div>
    );
  }
}

export default Body;
