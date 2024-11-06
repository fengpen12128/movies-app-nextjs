"use client";

import MoviesCard from "./movie-card-styles/MoviesCard";
import MoviesStack from "./MoivesStackCard";
import MyPagination from "./MyPagination";
import { nanoid } from "nanoid";
import { MoviesPreviewModal } from "@/components/MoviesPreviewModal";
import MoviesDetail from "@/components/movies-detail/Index";
import { useState } from "react";
import { useGridColumn } from "@/app/hooks/useGridColumn";

export const StackDisplay: React.FC<{
  movies: ActressGroupedMovies[] | ActressGroupedDownloadMovies[];
  pagination?: PaginationData;
}> = ({ movies, pagination }) => {
  const colClassDia = `grid mt-8 gap-5 grid-cols-1 sm:grid-cols-4`;

  const [openMovieId, setOpenMovieId] = useState<number | null>(null);
  const handleOpenModal = (id: number) => setOpenMovieId(id);
  const handleCloseModal = () => setOpenMovieId(null);

  return (
    <>
      <MoviesPreviewModal
        open={openMovieId !== null}
        setOpen={handleCloseModal}
      >
        {openMovieId !== null && <MoviesDetail movieId={openMovieId} />}
      </MoviesPreviewModal>
      <section className={colClassDia}>
        {movies.map((x) =>
          x.grouped ? (
            <MoviesStack
              key={nanoid()}
              movies={x.movies as Movie}
              actress={x.actress}
            />
          ) : (
            <MoviesCard
              onOpenModal={() => handleOpenModal((x.movies as Movie).id)}
              key={nanoid()}
              {...(x.movies as Movie)}
            />
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
  pageGrid?: boolean;
}> = ({ movies, pagination, pageGrid = true }) => {
  const [colClass, coverSetting] = useGridColumn(pageGrid);

  if (!movies) {
    return <div>No movies found</div>;
  }
  const [openMovieId, setOpenMovieId] = useState<number | null>(null);
  const handleOpenModal = (id: number) => setOpenMovieId(id);
  const handleCloseModal = () => setOpenMovieId(null);

  return (
    <>
      <MoviesPreviewModal
        open={openMovieId !== null}
        setOpen={handleCloseModal}
      >
        {openMovieId !== null && <MoviesDetail movieId={openMovieId} />}
      </MoviesPreviewModal>

      <div className="mb-10">
        <section className={colClass}>
          {movies.map((x) => (
            <MoviesCard
              key={x.id}
              {...x}
              onOpenModal={() => handleOpenModal(x.id)}
            />
          ))}
        </section>
        {pagination && <MyPagination {...pagination!} />}
      </div>
    </>
  );
};
