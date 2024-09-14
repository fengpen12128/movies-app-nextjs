"use client";

import MoviesCard from '@/components/MoviesCard';
import {useState} from 'react';
import MovieDetailView from '@/components/MovieDetailView';
import {useRequest} from 'ahooks';
import {Spinner} from '@radix-ui/themes';
import {useSearchParams} from 'next/navigation';
import MyPagination from '@/components/MyPagination';

const downLoadSection = () => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const { data, loading, error } = useRequest(
    async () => {
      const resp = await fetch(`/api/movies/download?page=${page}`);
        return await resp.json();
    },
    {
      refreshDeps: [page],
        onSuccess: (result, params) => {
          result?.movies?.forEach((movie) => {
              movie.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${movie.coverUrl}`
          })
        },
    },

  );

  const { totalCount, currentPage, totalPages } = data?.pagination || {};

  const [clickedMovie, setClickedMovie] = useState(null);
  const [open, setOpen] = useState(false);

  const colClassDia = `grid gap-8 grid-cols-1 sm:grid-cols-4`;

  const handleClickMoviesCard = (id) => {
    setClickedMovie(id);
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="3" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <section className={colClassDia}>
        {data.movies?.map((x) => (
          <MoviesCard
            onClick={() => handleClickMoviesCard(x.id)}
            key={x.id}
            {...x}
          ></MoviesCard>
        ))}
      </section>

      <MyPagination
        current={currentPage}
        totalPage={totalPages}
        totleCount={totalCount}
      />
      <MovieDetailView
        open={open}
        setOpen={setOpen}
        clickedMovie={clickedMovie}
      />
    </>
  );
};

export default downLoadSection;
