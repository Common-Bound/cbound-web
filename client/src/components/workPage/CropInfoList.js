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
        key={crop.id}
        image={image}
        crop={crop}
        onChange={onChange}
        onRemove={onRemove}
      />
    ));

    // CropItem 요소를 하나씩 화면에 출력해줌
    return <div>{cropList}</div>;
  }
}

export default CropInfoList;
