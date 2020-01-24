import React from "react";
import styled from "styled-components";

const EntireContainer = styled.div`
  width: 100%;
`;

const FluidContainer = styled.div`
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;

  justify-content: space-around;
  align-items: center;
`;

const Card = styled.div`
  min-width: 180px;
  max-width: 20%;
  padding: 1rem 1.5rem;
  margin: 10px;

  display: flex;
  flex-wrap: wrap;

  background-color: white;
  border-radius: 5px;

  @media (max-width: 1100px) {
    min-width: 40%;
  }
  @media (max-width: 500px) {
    min-width: 92%;
  }
`;
const CardTop = styled.div`
  width: 100%;
  line-height: 1;
  display: flex;
  justify-content: space-between;
`;
const CardInfoContainer = styled.div`
  width: 100%;
`;
const CardInfoTextContainer = styled.div``;
const TitleText = styled.div`
  color: #8898aa !important;
  font-size: 0.815rem;
  font-weight: bold;
  margin-bottom: 5px;
`;
const TitleNumber = styled.div`
  font-size: 1.25rem;
  font-weight: 600 !important;
`;
const CardBottom = styled.div`
  font-size: 0.8rem;
  color: ${props =>
    props.color === "green" ? "#2dce89 !important" : "#fb6340 !important"};
`;
const SmallIcon = styled.i``;
const SmallText = styled.div`
  font-size: 0.875rem !important;
  color: #8898aa !important;
`;
const IconContainer = styled.div`
  padding: 12px;

  background-color: ${props => props.color};
  border-radius: 100%;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
const StyledIcon = styled.i`
  color: white;
  font-size: 1.25rem;
`;

class Header extends React.Component {
  render() {
    return (
      <EntireContainer className="header bg-gradient-dark pb-5 pt-md-10">
        <FluidContainer>
          <Card>
            <CardTop>
              <CardInfoContainer>
                <CardInfoTextContainer>
                  <TitleText>Total Data</TitleText>
                  <TitleNumber>
                    {this.props.data
                      ? this.props.data.total_count
                      : "loading.."}
                  </TitleNumber>
                </CardInfoTextContainer>
              </CardInfoContainer>
              <IconContainer color={"#f5365c !important"}>
                <StyledIcon className="fas fa-chart-bar" />
              </IconContainer>
            </CardTop>
            <CardBottom color="green">
              <SmallIcon className="fa fa-arrow-up" /> 3.48%
              <SmallText>Since last month</SmallText>
            </CardBottom>
          </Card>
          <Card>
            <CardTop>
              <CardInfoContainer>
                <CardInfoTextContainer>
                  <TitleText>Today Data</TitleText>
                  <TitleNumber>
                    {this.props.data
                      ? this.props.data.today_count
                      : "loading.."}
                  </TitleNumber>
                </CardInfoTextContainer>
              </CardInfoContainer>
              <IconContainer color={"#fb6340 !important"}>
                <StyledIcon className="fas fa-chart-pie" />
              </IconContainer>
            </CardTop>
            <CardBottom color="">
              <SmallIcon className="fas fa-arrow-down" /> 3.48%
              <SmallText>Since yesterday</SmallText>
            </CardBottom>
          </Card>
          <Card>
            <CardTop>
              <CardInfoContainer>
                <CardInfoTextContainer>
                  <TitleText>Data Creator</TitleText>
                  <TitleNumber>
                    {this.props.data
                      ? this.props.data.creator_count
                      : "loading.."}
                  </TitleNumber>
                </CardInfoTextContainer>
              </CardInfoContainer>
              <IconContainer color={"#ffd600 !important"}>
                <StyledIcon className="fas fa-users" />
              </IconContainer>
            </CardTop>
            <CardBottom color="">
              <SmallIcon className="fa fa-arrow-down" /> 1.10%
              <SmallText>Since last week</SmallText>
            </CardBottom>
          </Card>
          <Card>
            <CardTop>
              <CardInfoContainer>
                <CardInfoTextContainer>
                  <TitleText>Inspected</TitleText>
                  <TitleNumber>
                    {this.props.data
                      ? this.props.data.total_count !== 0
                        ? (this.props.data.inspected_count /
                            this.props.data.total_count) *
                          100
                        : 0
                      : "loading.."}
                  </TitleNumber>
                </CardInfoTextContainer>
              </CardInfoContainer>
              <IconContainer color={"#11cdef !important"}>
                <StyledIcon className="fas fa-percent" />
              </IconContainer>
            </CardTop>
            <CardBottom color="green">
              <SmallIcon className="fa fa-arrow-up" /> 3.48%
              <SmallText>Since yesterday</SmallText>
            </CardBottom>
          </Card>
        </FluidContainer>
      </EntireContainer>
    );
  }
}

export default Header;
