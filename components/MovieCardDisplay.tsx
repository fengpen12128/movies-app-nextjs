"use client";

import MoviesCard from "./movie-card-styles/MoviesCard";
import MoviesStack from "./MoivesStackCard";
import MyPagination from "./MyPagination";
import { nanoid } from "nanoid";

export const StackDisplay: React.FC<{
  movies: ActressGroupedMovies[] | ActressGroupedDownloadMovies[];
  pagination?: PaginationData;
}> = ({ movies, pagination }) => {
  const colClassDia = `grid mt-8 gap-5 grid-cols-1 sm:grid-cols-4`;

  return (
    <>
      <section className={colClassDia}>
        {movies.map((x) =>
          x.grouped ? (
            <MoviesStack
              key={nanoid()}
              movies={x.movies as Movie}
              actress={x.actress}
            />
          ) : (
            <MoviesCard key={nanoid()} {...(x.movies as Movie)} />
          )
        )}
      </section>
      <MyPagination {...pagination!} />
    </>
  );
};

export const CommonDisplay: React.FC<{
  movies: Movie[];
  pagination?: PaginationData;
}> = ({ movies, pagination }) => {
  const colClassDia = `grid mt-4 gap-5 grid-cols-1  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`;
  if (!movies) {
    return <div>No movies found</div>;
  }

  return (
    <div className="mb-10">
      <section className={colClassDia}>
        {movies.map((x) => (
          <MoviesCard key={x.id} {...x} />
        ))}
      </section>
      <MyPagination {...pagination!} />
    </div>
  );
};
