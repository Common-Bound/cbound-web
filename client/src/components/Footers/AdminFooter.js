import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  padding: 40px 0px;
  display: flex;

  justify-content: space-between;
  align-items: center;

  @media (max-width: 500px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const MainLink = styled.a`
  color: #5e72e4 !important;
  text-decoration: none;
`;

const Navigation = styled.div`
  @media (max-width: 500px) {
    padding: 20px 0px;
  }
`;

const StyledLink = styled.a`
  padding: 0px 10px;
  color: #8898aa !important
  text-decoration: none;
`;

class Footer extends React.Component {
  render() {
    return (
      <Container className="footer">
        <MainLink
          href="https://cbound.herokuapp.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Common-Bound
        </MainLink>
        <Navigation>
          <StyledLink
            href="https://blog.naver.com/sw_maestro/221632296913"
            rel="noopener noreferrer"
            target="_blank"
          >
            About Us
          </StyledLink>
          <StyledLink
            href="https://github.com/Common-Bound"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </StyledLink>
          <StyledLink
            href="https://github.com/Common-Bound/cbound-web"
            rel="noopener noreferrer"
            target="_blank"
          >
            License
          </StyledLink>
        </Navigation>
      </Container>
    );
  }
}

export default Footer;
