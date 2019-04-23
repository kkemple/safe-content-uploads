import React from "react";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import { Router } from "@reach/router";
import { Global, css } from "@emotion/core";

import Upload from "./Upload";
import Uploads from "./Uploads";

Amplify.configure(aws_exports);

export default () => (
  <div>
    <Global
      styles={css`
        *,
        *::after,
        *::before {
          box-sizing: border-box;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
          font-smoothing: antialiased;
        }

        html {
          min-height: 100vh;
          background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
        }
      `}
    />
    <Router>
      <Uploads path="/" />
      <Upload path="/upload-photo" level="public" />
    </Router>
  </div>
);
