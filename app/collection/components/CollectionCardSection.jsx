"use client";

import { MoviesStackMy } from "@/components/MoivesStack";
import MoviesCard from "@/components/MoviesCard";
import { useEffect, useState } from "react";

import MovieDetailView from "@/components/MovieDetailView";

const CollectionCardSection = ({ movies, setSilderOpen, setClickMovie }) => {
  const [collectedMoviesStackList, setCollectedMoviesStackList] = useState([]);
  const fetchData = async () => {
    const resp = await fetch("/api/movies/collection/groupby/actresses/list");
    const data = await resp.json();
    setCollectedMoviesStackList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [clickedMovie, setClickMovieed] = useState(null);
  const [open, setOpen] = useState(false);

  const colClassDia = `grid gap-8 grid-cols-1 sm:grid-cols-4`;

  const handleClickMoviesCard = (id) => {
    setClickMovieed(id);
    setOpen(true);
  };

  return (
    <>
      <section className={colClassDia}>
        {collectedMoviesStackList.map((x, index) => (
          <>
            {x.movies.length === 1 ? (
              <MoviesCard
                onClick={() => handleClickMoviesCard(x.movies[0].id)}
                {...x.movies[0]}
                coverUrl={`${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.movies[0].coverUrl}`}
              />
            ) : (
              <MoviesStackMy
                moviesList={x.movies}
                actress={x.actress}
              ></MoviesStackMy>
            )}
          </>
        ))}
      </section>

      <MovieDetailView
        open={open}
        setOpen={setOpen}
        clickedMovie={clickedMovie}
      />
    </>
  );
};

export default CollectionCardSection;
