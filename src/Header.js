import React from "react";
import { Location, Link } from "@reach/router";
import styled from "@emotion/styled";
import { Auth } from "aws-amplify";

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

const SignOut = styled("button")`
  background: #ff9900;
  color: white;
  text-transform: uppercase;
  font-weight: 400;
  letter-spacing: 1.1px;
  font-size: 12px;
  outline: none;
  border: none;
  padding: 8px 16px;
  margin-left: 10px;
`;

export default () => (
  <Location>
    {({ location }) => (
      <Container>
        <Title>Safe Content Uploads</Title>
        <div>
          <Nav to={location.pathname === "/" ? "/upload-photo" : "/"}>
            {location.pathname === "/" ? "Upload Photo" : "Back to Photos"}
          </Nav>
          {location.pathname === "/upload-photo" ? (
            <SignOut onClick={Auth.signOut}>Sign Out</SignOut>
          ) : null}
        </div>
      </Container>
    )}
  </Location>
);
