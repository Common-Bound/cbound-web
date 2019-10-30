import React, { Component } from "react";
import CropItem from "./CropItem";
import styled from "styled-components";

const List = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-flow: row;
  justify-content: flex-start;

  border: 1px solid lightgrey;
  overflow: scroll;
`;

const EmptyBox = styled.div`
  width: 140px;
  height: 100px;
  border: 1px solid lightgrey;

  @media (max-width: 1024px) {
    width: 100px;
    height: 80px;
  }
  @media (max-width: 500px) {
    width: 100px;
    height: 60px;
    margin: 0px;
  }
`;

class CropInfoList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.crops !== nextProps.crops ||
      this.props.useAI !== nextProps.useAI
    );
  }

  render() {
    const {
      useAI,
      crops,
      image,
      onChange,
      onRemove,
      showEdit,
      changeLabel,
      classes
    } = this.props;

    const cropList = crops.map(crop => (
      <CropItem
        key={crop.shape_attributes.id}
        useAI={useAI}
        image={image}
        crop={crop}
        onChange={onChange}
        onRemove={onRemove}
        showEdit={showEdit}
        changeLabel={changeLabel}
        classes={classes}
      />
    ));

    // CropItem 요소를 하나씩 화면에 출력해줌
    return (
      <List>
        {cropList.length > 0 ? cropList : Array(3).fill(<EmptyBox />)}
      </List>
    );
  }
}

export default CropInfoList;
