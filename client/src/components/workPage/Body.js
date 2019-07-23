import React, { Component } from "react";
import CropperJS from "react-cropperjs";

class Body extends Component {
  _crop() {
    // image in dataUrl
    console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
  }

  render() {
    return (
      <CropperJS
        ref="cropper"
        src="http://i.imgur.com/n483ZwJ.jpg"
        style={{ height: 400, width: "100%" }}
        // Cropper.js options
        aspectRatio={16 / 9}
        guides={false}
        crop={this._crop.bind(this)}
      />
    );
  } /*
  state = {
    orig_image: "a",
    crop_image: []
  };

  onFileSelected = async e => {
    await this.setState({
      orig_image: URL.createObjectURL(e.target.files[0])
    });
  };

  fetchTest() {
    var bodyData = {
      orig_image: "url",
      meta: {
        crop_image: [
          {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            label: "123"
          },
          {
            x: 2,
            y: 4,
            width: 6,
            height: 1,
            label: "3214"
          }
        ]
      }
    };

    fetch("/task", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    })
      .then(function(res) {
        return Response.json();
      })
      .then(function(data) {
        console.log("Data received" + data);
      })
      .catch(function(ex) {
        console.log("error occured" + ex);
      });
  }
  render() {
    const workStyle = {
      borderTop: "3px solid lightgrey"
    };

    return (
      <div>
        <hr style={workStyle} />
        <div>
          <img
            id="workImg"
            src={this.state.orig_image}
            alt="workImg"
            style={{ maxWidth: "100%" }}
          />
        </div>
        <br />

        <div>
          <form>
            <input type="file" onChange={this.onFileSelected} />
            <div>
              <input
                type="button"
                className="btn btn-outline-secondary"
                value="링크"
              />
              <input
                type="button"
                className="btn btn-outline-secondary"
                value="저장"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }*/
}

export default Body;
