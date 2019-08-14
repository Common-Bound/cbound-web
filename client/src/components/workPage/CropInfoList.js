import React, { Component } from "react";
import CropItem from "./CropItem";
import styled from "styled-components";

const List = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  width: 100%;
  border: 1px solid red;
  overflow: scroll;
`;

const EmptyBox = styled.div`
  width: 140px;
  height: 100px;
  border: 1px solid lightgrey;
  margin: 5px;
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
      changeLabel
    } = this.props;

    const cropList = crops.map(crop => (
      <CropItem
        key={crop.id}
        useAI={useAI}
        image={image}
        crop={crop}
        onChange={onChange}
        onRemove={onRemove}
        showEdit={showEdit}
        changeLabel={changeLabel}
      />
    ));

    // CropItem 요소를 하나씩 화면에 출력해줌
    return (
      <List>
        {cropList.length > 0 ? cropList : Array(5).fill(<EmptyBox />)}
      </List>
    );
  }
}

export default CropInfoList;
