import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { PhotoPicker } from "aws-amplify-react";
import * as nsfwjs from "nsfwjs/dist";
import styled from "@emotion/styled";
import { Global, css, keyframes } from "@emotion/core";
import { navigate } from "@reach/router";
import uuid from "uuid";

import Header from "./Header";

const detectGifEvil = predictions =>
  !predictions
    .filter(c => {
      return (
        ["Hentai", "Porn", "Sexy"].includes(c[0].className) &&
        c.probability > 0.49
      );
    })
    .flat().length;

const detectEvil = predictions => {
  return !predictions
    .filter(c => {
      return (
        ["Hentai", "Porn", "Sexy"].includes(c.className) && c.probability > 0.49
      );
    })
    .flat().length;
};

const checkContent = async (file, type, model) => {
  const image = new Image();
  image.src = file;

  if (type === "image/gif") {
    const predictions = await model.classifyGif(image);
    const deemedEvil = detectGifEvil([...predictions]);
    return deemedEvil;
  } else {
    const predictions = await model.classify(image);
    const deemedEvil = detectEvil(predictions);
    return deemedEvil;
  }
};

const spin = keyframes`
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
  `;

const Loader = styled("div")`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;

  :after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 6px;
    box-sizing: border-box;
    border: 26px solid white;
    border-color: #ff9900 transparent #ffc300 transparent;
    animation: ${spin} 1.2s infinite;
  }
`;

const LoaderContainer = styled("div")`
  background: white;
  width: 300px;
  height: 300px;
  border: 15px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  border-radius: 4px;
`;

const Overlay = styled("div")`
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Layout = styled("div")`
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  width: 100vw;
  min-height: 100vh;
  padding-top: 150px;
`;

const LoadingMessage = styled("h2")`
  color: #ffc300;
`;

export default () => {
  const [state, setState] = useState({
    model: null,
    loaded: false,
    processing: false
  });

  useEffect(() => {
    async function loadModel() {
      nsfwjs
        .load("https://nsfwjs-model.surge.sh/")
        .then(model => {
          setState({ ...state, model, loaded: true });
          return undefined;
        })
        .catch(error => {
          console.error(error);
          return undefined;
        });
    }

    loadModel();
  }, [state.loaded]);

  useEffect(() => {
    async function verifyAndUploadFile() {
      if (!state.file || !state.model) return;

      try {
        let isClean = false;
        const reader = new FileReader();
        reader.onload = async e => {
          isClean = await checkContent(
            e.target.result,
            state.file.type,
            state.model
          );

          if (isClean) {
            const random = uuid();

            await Storage.put(
              `uploads/${random}-${state.file.name}`,
              state.file,
              {
                contentType: state.file.type
              }
            );

            setState({ ...state, processing: false, file: null });
            alert("Thanks! Image uploaded!");

            navigate("/");
          } else {
            setState({ ...state, processing: false, file: null });
            alert(
              "Image is inappropriate! If you feel this is incorrect please reach out so that we can review your image."
            );
          }
        };

        reader.readAsDataURL(state.file);
      } catch (error) {
        console.log(error);
        alert(`Looks like something went wrong: ${error.message}`);
      }
    }

    verifyAndUploadFile();
  }, [state.file, state.model]);

  return state.loaded ? (
    <>
      <Global
        styles={css`
          img {
            max-width: 380px !important;
            max-height: 380px;
          }
        `}
      />
      <Header />
      <Layout>
        <PhotoPicker
          preview
          onPick={async data => {
            setState({ ...state, file: data.file, processing: true });
          }}
        />
        {state.processing ? <Overlay /> : null}
      </Layout>
    </>
  ) : (
    <>
      <Header />
      <Layout>
        <LoaderContainer>
          <LoadingMessage>Loading Model...</LoadingMessage>
          <Loader />
        </LoaderContainer>
      </Layout>
    </>
  );
};
