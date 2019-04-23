import React from "react";
import { Location, Link } from "@reach/router";
import styled from "@emotion/styled";

const Container = styled("div")`
  background: white;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 3px 9px rgba(100, 100, 100, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
`;

const Title = styled("h1")`
  color: #ffc300;
`;

const Nav = styled(Link)`
  color: #ffc300;
  text-transform: uppercase;
  font-weight: bold;
  text-decoration: none;
`;

export default () => (
  <Location>
    {({ location }) => (
      <Container>
        <Title>Safe Content Uploads</Title>
        <Nav to={location.pathname === "/" ? "/upload-photo" : "/"}>
          {location.pathname === "/" ? "Upload Photo" : "Back to Photos"}
        </Nav>
      </Container>
    )}
  </Location>
);
