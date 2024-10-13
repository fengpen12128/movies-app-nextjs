"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import VideoPlayResource from "./VideoPlayResource";
import MoviesInfo from "./MoviesInfo";
import MoviesPreview from "../MediaPreview";
import MagnetLinkTable from "./MagnetLinkTable";
import RelationMovies from "@/components/MoviesDetail/RelationMovies";
import { message } from "react-message-popup";
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

const Index: React.FC<IndexProps> = ({ movieId: initialMovieId }) => {
  const [movieId, setMovieId] = useState<number | null>(initialMovieId);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [resources, setResources] = useState<VideoResource[]>([]);
  const [media, setMedia] = useState<MovieMedia[]>([]);
  const [magnetLinks, setMagnetLinks] = useState<MagnetLink[]>([]);
  const [relMovies, setRelMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!movieId) {
        message.error("movieId is not passed");
        return;
      }
      setMovie(null);

      try {
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

        setMovie(movie || null);
        setResources(resources || []);
        setMedia(media || []);
        setMagnetLinks(magnetLinks || []);
        setRelMovies(relMovies || []);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchResources();
  }, [movieId]);

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
      <VideoPlayResource resources={resources} />
      <MoviesPreview media={media} />
      <MagnetLinkTable links={magnetLinks} />
      <RelationMovies relMovies={relMovies} setMovieId={setMovieId} />
    </>
  );
};

export default Index;
