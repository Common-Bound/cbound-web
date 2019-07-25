import React, { Component } from "react";
import CropItem from "./CropItem";

class CropInfoList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.crops !== nextProps.crops;
  }

  render() {
    const { crops, image, onChange, onRemove } = this.props;

    const cropList = crops.map(crop => (
      <CropItem
        image={image}
        crop={crop}
        onRemove={onRemove}
        onChange={onChange}
      />
    ));

    return <div>{cropList}</div>;
  }
}

export default CropInfoList;
