import React, { Component } from "react";
import styled from "styled-components";

const Card = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Message = styled.div`
  font-size: 36px;
  font-weight: bold;
  font-family: SpoqaHanSans;
  word-break: keep-all;
  color: black;

  @media (max-width: 1024px) {
    font-size: 28px;
  }
  @media (max-width: 500px) {
    font-size: 20px;
  }
`;

class AlarmCard extends Component {
  render() {
    return (
      <Card>
        <Message>{this.props.message}</Message>
      </Card>
    );
  }
}

export default AlarmCard;
