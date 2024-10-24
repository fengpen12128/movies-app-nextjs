"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import VideoPlayResource from "./VideoPlayResource";
import MoviesInfo from "./MoviesInfo";
import MoviesPreview from "./MediaPreview";
import MagnetLinkTable from "./MagnetLinkTable";
import RelationMovies from "./RelationMovies";
import { message } from "react-message-popup";
import { getMovieDetail } from "@/app/actions/movie-action/getMovieDetail";

interface IndexProps {
  movieId: number;
}

const Index: React.FC<IndexProps> = ({ movieId }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [resources, setResources] = useState<VideoResource[]>([]);
  const [media, setMedia] = useState<MoviesMediaUrl | null>(null);
  const [magnetLinks, setMagnetLinks] = useState<MagnetLink[]>([]);
  const [relMovies, setRelMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) {
        message.error("movieId is not passed");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const result = await getMovieDetail(movieId);

        if (result.code === 200 && result.data) {
          const { movie, videoResources, media, magnetLinks, relationMovies } =
            result.data;
          setMovie(movie);
          setResources(videoResources);
          setMedia(media);
          setMagnetLinks(magnetLinks);
          setRelMovies(relationMovies);
        } else {
          setError(result.msg!);
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setError("Failed to load movie data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  return (
    <>
      <MoviesInfo movie={movie!} />
      <VideoPlayResource resources={resources} />
      {media && <MoviesPreview media={media} />}
      <MagnetLinkTable links={magnetLinks} />
      <RelationMovies relMovies={relMovies} />
    </>
  );
};

export default Index;
