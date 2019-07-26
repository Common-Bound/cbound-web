import React, { Component } from "react";
import CropItem from "./CropItem";

class CropInfoList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.crops !== nextProps.crops;
  }

  render() {
    const { crops, image, onChange, onRemove } = this.props;

    console.log("a", crops);
    const cropList = crops.map(crop => (
      <CropItem
        key={crop.id}
        image={image}
        crop={crop}
        onChange={onChange}
        onRemove={onRemove}
      />
    ));

    return <div>{cropList}</div>;
  }
}

export default CropInfoList;
