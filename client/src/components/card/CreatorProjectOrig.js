import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";

const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  margin: 0px 30px 30px 0px;
  text-align: center;

  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    max-width: 240px;
  }

  @media (max-width: 500px) {
    max-width: 100%;
    margin: 0px 0px 30px 0px;
  }
`;

const MainContainer = styled.div``;

const SubContainer = styled.div``;

const Image = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: 100% 100%;

  @media (max-width: 1024px) {
    height: 160px;
  }
  @media (max-width: 500px) {
    height: 120px;
  }
`;

const Title = styled.div`
  padding: 10px;
  font-size: 24px;
  font-weight: bold;
  color: black;
`;

const Description = styled.div`
  padding: 8px;
  color: grey;
  font-size: 18px;
  word-break: keep-all;
`;

const Info = styled.div`
  padding: 8px;
  color: ${props => (props.color === "red" ? "red" : "grey")};
  font-size: 16px;
  word-break: keep-all;
`;

const Button = styled.div`
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;

  hover {
    opacity: 0.7;
  }
`;

// const StyledTableCell = styled(TableCell)`
//   color: ${props =>
//     props.project_type === "normal" ? "black" : "blue"} !important;
// `;

// const StyledTableRow = styled(TableRow)`
//   transition: 0.2s;
//   cursor: pointer;
//   :hover {
//     background-color: lightgrey;
//   }
// `;

// const ResponsiveStyledTableCell = styled(TableCell)`
//   @media (max-width: 810px) {
//     display: none !important;
//   }
// `;

class CreatorProjectOrig extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = e => {
    const url = "/mypage/creator/join";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        proj_id: this.props.id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          return alert(data.message);
        }
        if (data.result === true) {
          return alert(
            "프로젝트에 참여하였습니다. 가이드라인을 잘 읽고 참여해 주세요"
          );
        }
      })
      .catch(err => {
        return console.log(err);
      });
  };

  render() {
    const created_time = moment(this.props.created_at, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const due_date_time = moment(this.props.due_date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    const t1 = moment();
    const t2 = moment(this.props.due_date);

    const days = moment.duration(t2.diff(t1)).days();
    const hours = moment.duration(t2.diff(t1)).hours();
    const minutes = moment.duration(t2.diff(t1)).minutes();

    return (
      <Card>
        <MainContainer>
          <Image src={this.props.title_image}></Image>
        </MainContainer>
        <SubContainer>
          <Title>
            {this.props.title} (
            {this.props.project_type === "normal" ? "생성" : "검수"})
          </Title>
          <Description>{this.props.simple_description}</Description>
          <Info>
            {created_time} ~ {due_date_time}
          </Info>
          <Info color="red">{this.props.reward} P</Info>
          {/* <a href="#"><i class="fa fa-dribbble"></i></a> 
        <a href="#"><i class="fa fa-twitter"></i></a> 
        <a href="#"><i class="fa fa-linkedin"></i></a> 
        <a href="#"><i class="fa fa-facebook"></i></a>  */}

          <Button onClick={this.handleClick}>참여하기</Button>
        </SubContainer>

        {/* <StyledTableRow onClick={this.handleClick}>
          <ResponsiveStyledTableCell align="center">
            {created_time}
          </ResponsiveStyledTableCell>
          <StyledTableCell
            align="center"
            project_type={this.props.project_type}
          >
            {this.props.project_type === "normal" ? "생성" : "검수"}
          </StyledTableCell>
          <TableCell align="center">{this.props.title}</TableCell>
          <TableCell align="center">{this.props.reward}</TableCell>
          <TableCell align="center">{due_date_time}</TableCell>
          <ResponsiveStyledTableCell align="center">{`${days}일 ${hours}시간 ${minutes}분 뒤 종료`}</ResponsiveStyledTableCell>
        </StyledTableRow> */}
      </Card>
    );
  }
}

export default CreatorProjectOrig;
