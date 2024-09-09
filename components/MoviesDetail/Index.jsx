"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import MoviesInfo from "./MoviesInfo.jsx";
import VideoPlayResource from "./VideoPlayResource.jsx";
import MoviesPreview from "../MediaPreview.jsx";
import MagnetLinkTable from "./MagnetLinkTable.jsx";
import RelationMovies from "./RelationMovies.jsx";
import { getImages } from "@/api/commonApi";

const setToDemonstrationMode = (data, wallpapers) => {
  data.coverUrl = `${process.env.NEXT_PUBLIC_TEST_PATH}/${
    wallpapers[Math.floor(Math.random() * wallpapers.length)]
  }`;
  data.files.forEach((x) => {
    x.path = `${process.env.NEXT_PUBLIC_TEST_PATH}/${
      wallpapers[Math.floor(Math.random() * wallpapers.length)]
    }`;
  });
};
const setToDemonstrationMode2 = (data, wallpapers) => {
  data.coverUrl = `${
    wallpapers[Math.floor(Math.random() * wallpapers.length)]
  }`;
  data.files.forEach((x) => {
    x.path = `${wallpapers[Math.floor(Math.random() * wallpapers.length)]}`;
  });
};

const setToMinioMode = (data, wallpapers) => {
  data.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${data.coverUrl}`;
  data.files.forEach((x) => {
    x.path = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.path}`;
  });
};
const Index = ({ code: initialCode }) => {
  const [movies, setMovies] = useState(null);

  const [code, setCode] = useState(initialCode);

  const getMoviesDetail = async () => {
    const [resp, wallpapers] = await Promise.all([
      fetch(`/api/movies/detail/${code}`),
      //getImages(),
      fetch("/api/common/image").then((resp) => {
        return resp.json();
      }),
    ]);
    const data = await resp.json();
    // 设置为演示模式
    setToDemonstrationMode2(data, wallpapers.wallpapers);
    setMovies(data);
  };

  useEffect(() => {
    if (!code) return;
    // 用于在点击关系电影时，清除已有电影数据，从而出现Loading效果
    setMovies(null);
    getMoviesDetail();
  }, [code]);

  if (!code) {
    return <div>No movie selected</div>;
  }

  if (!movies) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="3" />
      </div>
    );
  }

  const { actresses, magnetLinks, files, videoResource } = movies;

  return (
    <>
      <MoviesInfo {...movies} videoFirst={videoResource[0] || null} />
      <VideoPlayResource videoResource={videoResource} />
      <MoviesPreview mediaUrls={files} />
      <MagnetLinkTable links={magnetLinks} />
      <RelationMovies
        setCode={setCode}
        actressNames={actresses.map((x) => x.actressName)}
      />
    </>
  );
};

export default Index;
