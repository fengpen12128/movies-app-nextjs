"use client";

import { MoviesStackMy } from "@/components/MoivesStack";
import MoviesCard from "@/components/MoviesCard";
import { useEffect, useState, useMemo } from "react";
import MovieDetailView from "@/components/MovieDetailView";
import { useRequest } from "ahooks";
import { Spinner } from "@radix-ui/themes";
import MyPagination from "@/components/MyPagination";
import { useSearchParams } from "next/navigation";

const CollectionCardSection = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const {
    data: collectedMoviesStackList,
    loading,
    error,
  } = useRequest(
    async () => {
      const resp = await fetch("/api/movies/collection/groupBy/actresses/list");
      const data = await resp.json();
      return data;
    },
    {
      cacheKey: "collectedMoviesStackList",
    }
  );

  const [clickedMovie, setClickedMovie] = useState(null);
  const [open, setOpen] = useState(false);

  const colClassDia = `grid gap-8 grid-cols-1 sm:grid-cols-4`;

  const handleClickMoviesCard = (id) => {
    setClickedMovie(id);
    setOpen(true);
  };

  const showList = useMemo(() => {
    return collectedMoviesStackList?.slice(page * 30, (page + 1) * 30) || [];
  }, [collectedMoviesStackList, page]);

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
        {showList.map((x) =>
          x.movies.length === 1 ? (
            <MoviesCard
              key={x.movies[0].id}
              onClick={() => handleClickMoviesCard(x.movies[0].id)}
              {...x.movies[0]}
              coverUrl={`${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.movies[0].coverUrl}`}
            />
          ) : (
            <MoviesStackMy
              key={x.movies[0].id}
              moviesList={x.movies}
              actress={x.actress}
            />
          )
        )}
      </section>
      <MyPagination
        current={page}
        totalPage={Math.ceil((collectedMoviesStackList?.length || 0) / 30)}
        totleCount={collectedMoviesStackList?.length || 0}
      />
      <MovieDetailView
        open={open}
        setOpen={setOpen}
        clickedMovie={clickedMovie}
      />
    </>
  );
};

export default CollectionCardSection;
