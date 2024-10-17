"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import VideoPlayResource from "./VideoPlayResource";
import MoviesInfo from "./MoviesInfo";
import MoviesPreview from "../MediaPreview";
import MagnetLinkTable from "./MagnetLinkTable";
import RelationMovies from "@/components/MoviesDetail/RelationMovies";
import { message } from "react-message-popup";
import { inter } from "@/app/fonts";

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
          resourcesResult,
          movieResult,
          mediaResult,
          magnetLinksResult,
          relMoviesResult,
        ] = await Promise.allSettled([
          getVideoResource(movieId),
          getMovieOne(movieId),
          getMedia(movieId),
          getMagnetLinks(movieId),
          getActressRelMovies(movieId),
        ]);

        if (resourcesResult.status === "fulfilled") {
          setResources(resourcesResult.value.data || []);
        }
        if (movieResult.status === "fulfilled") {
          setMovie(movieResult.value.data || null);
        }
        if (mediaResult.status === "fulfilled") {
          setMedia(mediaResult.value.data || []);
        }
        if (magnetLinksResult.status === "fulfilled") {
          setMagnetLinks(magnetLinksResult.value.data || []);
        }
        if (relMoviesResult.status === "fulfilled") {
          setRelMovies(relMoviesResult.value.data || []);
        }
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
    <div className={`${inter.className}`}>
      <MoviesInfo movie={movie} />
      <VideoPlayResource resources={resources} />
      <MoviesPreview media={media} />
      <MagnetLinkTable links={magnetLinks} />
      <RelationMovies relMovies={relMovies} setMovieId={setMovieId} />
    </div>
  );
};

export default Index;
