"use client";

import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import MoviesInfo from "./MoviesInfo.jsx";
import VideoPlayResource from "./VideoPlayResource.jsx";
import MoviesPreview from "../MediaPreview.jsx";
import MagnetLinkTable from "./MagnetLinkTable.jsx";
import RelationMovies from "./RelationMovies.jsx";
import { useRequest } from "ahooks";

const Index = ({ code: initialCode }) => {
  const [code, setCode] = useState(initialCode);

  const setToMinioMode = (data) => {
    data.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${data.coverUrl}`;
    data.files.forEach((x) => {
      x.path = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.path}`;
    });
  };

  const { data: movies, loading } = useRequest(
    async () => {
      if (!code) return null;
      const resp = await fetch(`/api/movies/${code}`);
      const data = await resp.json();
      setToMinioMode(data);
      return data;
    },
    {
      refreshDeps: [code],
    }
  );

  if (!code) {
    return <div>No movie selected</div>;
  }

  if (loading) {
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
