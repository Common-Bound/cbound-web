import React, { Component } from "react";
import CropItem from "./CropItem";
import styled from 'styled-components';

const List = styled.div`
  display: flex;
  flex-flow: row;
  width: 100%;
  border: 1px solid red;
  overflow: scroll;
`;

class CropInfoList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.crops !== nextProps.crops;
  }

  render() {
    const { crops, image, onChange, onRemove, showEdit } = this.props;

    const cropList = crops.map(crop => (
      <CropItem
        key={crop.id}
        image={image}
        crop={crop}
        onChange={onChange}
        onRemove={onRemove}
        showEdit={showEdit}
      />
    ));

    // CropItem 요소를 하나씩 화면에 출력해줌
    return <List>{cropList}</List>;
  }
}

export default CropInfoList;
