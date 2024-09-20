"use client";

import { useState } from "react";
import MoviesCard from "./MoviesCard";
import MoviesStack from "./MoivesStack";
// import MoviesPreviewModal from "./MoviesPreviewModal";
// import MoviesDetail from "./MoviesDetail/MoviesDetail";

export const StackArrange = ({ movies = [] }) => {
  const [open, setOpen] = useState(false);
  const [clickedMovie, setClickedMovie] = useState(null);

  const handleClickMoviesCard = (id) => {
    setClickedMovie(id);
    setOpen(true);
  };

  const colClassDia = `grid mt-8 gap-5 grid-cols-1 sm:grid-cols-4`;

  return (
    <>
      <section className={colClassDia}>
        {movies.map((x) =>
          x.movies.length === 1 ? (
            <MoviesCard
              key={x.movies[0].id}
              onClick={() => handleClickMoviesCard(x.movies[0].id)}
              {...x.movies[0]}
              coverUrl={`${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.movies[0].coverUrl}`}
            />
          ) : (
            <MoviesStack
              key={x.movies[0].id}
              moviesList={x.movies}
              actress={x.actress}
            />
          )
        )}
      </section>

      <MoviesPreviewModal open={open} setOpen={setOpen}>
        {open && <MoviesDetail code={clickedMovie} />}
      </MoviesPreviewModal>
    </>
  );
};

const CommonCardSection = ({ movies = [] }) => {
  const [clickedMovie, setClickMovie] = useState("");
  const [open, setOpen] = useState(false);
  const handleClickMoviesCard = (code) => {
    setOpen(true);
    setClickMovie(code);
  };

  const colClassDia = `grid mt-4 gap-5 grid-cols-1 sm:grid-cols-4`;

  return (
    <>
      <MoviesPreviewModal open={open} setOpen={setOpen}>
        {open && <MoviesDetail code={clickedMovie} />}
      </MoviesPreviewModal>

      <section className={colClassDia}>
        {movies.map((x) => (
          <MoviesCard
            onClick={() => handleClickMoviesCard(x.id)}
            key={x.id}
            {...x}
            coverUrl={`${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`}
          ></MoviesCard>
        ))}
      </section>
    </>
  );
};

export default CommonCardSection;
