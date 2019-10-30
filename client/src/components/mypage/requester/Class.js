import React, { Component } from "react";
import styled from "styled-components";
import deleteImg from "../../../images/close_button.webp";

const Container = styled.div`
  padding: 20px;
  margin: 20px 20px 20px 0px;

  background-color: white;
  border-radius: 20px;

  display: flex;
`;

const Name = styled.div``;

const DeleteButton = styled.div`
  width: 20px;
  height: 20px;
  margin: 5px 0px 0px 6px;

  background-image: url(${props => props.img});
  backgrondd-size: cover;
  background-repeat: no-repeat;
  z-index: 1;
`;

class Class extends Component {
  handleDeleteClass = async () => {
    const id = this.props.id;
    console.log(`name: ${this.props.name}, id: ${id} 지움`);
    await this.props.handleDeleteClass(id);
  };

  render() {
    return (
      <Container>
        <Name>{this.props.name}</Name>
        <DeleteButton
          img={deleteImg}
          value="삭제"
          onClick={this.handleDeleteClass.bind(this)}
        />
      </Container>
    );
  }
}

export default Class;
