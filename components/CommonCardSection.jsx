"use client";

import { useState } from "react";
import MoviesCard from "./MoviesCard";
import MovieDetailView from "./MovieDetailView";

const CommonCardSection = ({ movies }) => {
  const [clickedMovie, setClickMovie] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClickMoviesCard = (code) => {
    setOpen(true);
    setClickMovie(code);
  };

  const colClassDia = `grid mt-8 gap-5 grid-cols-1 sm:grid-cols-4`;

  return (
    <>
      <MovieDetailView
        open={open}
        setOpen={setOpen}
        clickedMovie={clickedMovie}
      />

      <section className={colClassDia}>
        {movies.map((x) => (
          <MoviesCard
            onClick={() => handleClickMoviesCard(x.id)}
            key={x.id}
            {...x}
          ></MoviesCard>
        ))}
      </section>
    </>
  );
};

export default CommonCardSection;
