import React from "react";
import VideoPlayResource from "./VideoPlayResource";
import MoviesInfo from "./MoviesInfo";
import MoviesPreview from "./MediaPreview";
import MagnetLinkTable from "./MagnetLinkTable";
import RelationMovies from "@/components/MoviesDetail/RelationMovies";
import { Spinner } from "@radix-ui/themes";
import {
  getVideoResource,
  getMovieOne,
  getMedia,
  getMagnetLinks,
  getActressRelMovies,
} from "@/app/actions";

interface IndexProps {
  movieId: number;
}

const Index: React.FC<IndexProps> = async ({ movieId }) => {
  if (!movieId) {
    return <div>movieId is not provided</div>;
  }

  const [
    { data: resources },
    { data: movie },
    { data: media },
    { data: magnetLinks },
    { data: relMovies },
  ] = await Promise.all([
    getVideoResource(movieId),
    getMovieOne(movieId),
    getMedia(movieId),
    getMagnetLinks(movieId),
    getActressRelMovies(movieId),
  ]);

  if (!movie) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <>
      <MoviesInfo movie={movie} />
      <VideoPlayResource resources={resources || []} />
      <MoviesPreview media={media || []} />
      <MagnetLinkTable links={magnetLinks || []} />
    </>
  );
};

export default Index;
