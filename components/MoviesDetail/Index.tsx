"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import VideoPlayResource from "./VideoPlayResource";
import MoviesInfo from "./MoviesInfo";
import MoviesPreview from "./MediaPreview";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      if (!movieId) {
        message.error("movieId is not passed");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const [
          movieResult,
          resourcesResult,
          mediaResult,
          magnetLinksResult,
          relMoviesResult,
        ] = await Promise.allSettled([
          getMovieOne(movieId),
          getVideoResource(movieId),
          getMedia(movieId),
          getMagnetLinks(movieId),
          getActressRelMovies(movieId),
        ]);

        if (movieResult.status === "fulfilled") {
          setMovie(movieResult.value.data || null);
        } else {
          throw new Error("Failed to fetch movie data");
        }

        if (resourcesResult.status === "fulfilled") {
          setResources(resourcesResult.value.data || []);
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
        setError("Failed to load movie data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>No movie data available.</p>
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
