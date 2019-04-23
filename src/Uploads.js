import React, { useState, useEffect } from "react";
import { Storage } from "aws-amplify";
import { S3Image } from "aws-amplify-react";
import styled from "@emotion/styled";

import Header from "./Header";

const PhotoGrid = styled("div")`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

const GridItem = styled("div")`
  width: 300px;
  height: 300px;
  border: 15px solid white;
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
  margin: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 9px rgba(100, 100, 100, 0.1);

  img {
    display: block;
    max-width: 270px;
    max-height: 270px;
    width: auto;
    height: auto;
  }
`;

const Layout = styled("div")`
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  width: 100vw;
  min-height: 100vh;
  padding-top: 150px;
`;

export default () => {
  const [state, setState] = useState({ photos: [], loaded: false });

  useEffect(() => {
    async function loadPhotos() {
      const photos = await Storage.list("uploads/", { level: "protected" });
      setState({ photos, loaded: true });
    }

    loadPhotos();
  }, [state.loaded]);

  return (
    <>
      <Header />
      <Layout>
        <PhotoGrid>
          {!!state.photos.length &&
            state.photos.map(({ key }) => (
              <GridItem key={key}>
                <S3Image level="protected" imgKey={key} />
              </GridItem>
            ))}
        </PhotoGrid>
      </Layout>
    </>
  );
};
