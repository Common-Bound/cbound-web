import React from "react";

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Row className="align-items-center justify-content-xl-between">
          <Col xl="6">
            <div className="copyright text-center text-xl-left text-muted">
              {" "}
              <a
                className="font-weight-bold ml-1"
                href="http://c-bound.io"
                rel="noopener noreferrer"
                target="_blank"
              >
                Common-Bound
              </a>
            </div>
          </Col>

          <Col xl="6">
            <Nav className="nav-footer justify-content-center justify-content-xl-end">
              <NavItem>
                <NavLink
                  href="http://c-bound.io"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Common-Bound
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="https://blog.naver.com/sw_maestro/221632296913"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  About Us
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="https://github.com/eunsukimme/Common-Bound"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Github
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md?ref=adr-admin-footer"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  LiCENSE
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      </footer>
    );
  }
}

export default Footer;
