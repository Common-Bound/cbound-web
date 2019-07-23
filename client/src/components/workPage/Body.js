import React, { Component } from "react";
import imageSrc from "./cropped/img/sight.jpg";

class Body extends Component {
  /*getInitialState() {
    return {
      file: []
    };
  }

  state = { selectedFile: null };
  _onChange = e => {
    var file = e.target.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);

    reader.onloadend = function(e) {
      this.setState({
        imgSrc: [reader.result]
      });
    }.bind(this);
    console.log(url);
  };

  render() {
    const workStyle = {
      borderTop: "3px solid lightgrey"
    };

    return (
      <div>
        <hr style={workStyle} />
        <div>
          <img id="image" src={imageSrc} alt="workImage" style="max-width:" />
        </div>
        <br />

        <div>
          <form>
            <input type="file" onChange={this._onChange} />
            <div>
              <button
                type="button"
                onClick={this.state}
                class="btn btn-outline-secondary"
              >
                링크
              </button>
              <button
                type="button"
                onClick="store()"
                class="btn btn-outline-secondary"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }*/
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
    return <input type="button" onSubmit={this.fetchTest} />;
  }
}

export default Body;
