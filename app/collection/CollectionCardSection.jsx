"use client";

import { MoviesStackMy } from "@/components/MoivesStack";
import MoviesCard from "@/components/MoviesCard";
import { useEffect, useMemo, useState } from "react";
import MovieDetailView from "@/components/MovieDetailView";
import { useRequest } from "ahooks";
import { Spinner } from "@radix-ui/themes";
import MyPagination from "@/components/MyPagination";
import { useSearchParams } from "next/navigation";

const StackArrange = ({ moviesList = [], handleClickMoviesCard }) => {
  return moviesList.map((x) =>
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
  );
};

const FlexArrange = ({ moviesList, handleClickMoviesCard }) => {
  return moviesList.map((x) => (
    <MoviesCard
      key={x.id}
      onClick={() => handleClickMoviesCard(x.id)}
      {...x}
      coverUrl={`${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`}
    />
  ));
};
const CollectionCardSection = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const arrangeParams = searchParams.get("arrange") || "flex";
  const {
    data: collectedMoviesStackList,
    loading,
    error,
  } = useRequest(
    async () => {
      let resp = undefined;
      if (arrangeParams === "stack") {
        resp = await fetch("/api/movies/collection/groupBy/actresses/list");
      } else {
        resp = await fetch(`/api/movies/collection/list?page=${page}`);
      }
      return await resp.json();
    },
    {
      cacheKey: "collectedMoviesStackList",
      refreshDeps: [page, arrangeParams],
    }
  );

  const [clickedMovie, setClickedMovie] = useState(null);
  const [open, setOpen] = useState(false);

  const colClassDia = `mt-8 grid gap-8 grid-cols-1 sm:grid-cols-4`;

  const handleClickMoviesCard = (id) => {
    setClickedMovie(id);
    setOpen(true);
  };

  let showList;

  // useEffect(() => {
  //     if (arrangeParams === 'stack') {
  //         // showList  = useMemo(() => {
  //         //     return collectedMoviesStackList?.slice((page - 1) * 30, page * 30) || [];
  //         // }, [collectedMoviesStackList, page]);
  //         showList = collectedMoviesStackList?.data
  //     }   else {
  //         showList = collectedMoviesStackList?.data
  //     }
  // },[arrangeParams])

  const { totalCount, currentPage, totalPages } =
    collectedMoviesStackList?.pagination || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="3" />
      </div>
    );
    ``;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <section className={colClassDia}>
        {arrangeParams === "flex" &&
          collectedMoviesStackList?.data &&
          collectedMoviesStackList?.data.length > 0 && (
            <FlexArrange
              moviesList={collectedMoviesStackList?.data}
              handleClickMoviesCard={handleClickMoviesCard}
            />
          )}
        {arrangeParams === "stack" &&
          collectedMoviesStackList &&
          collectedMoviesStackList.length > 0 && (
            <StackArrange
              moviesList={collectedMoviesStackList}
              handleClickMoviesCard={handleClickMoviesCard}
            />
          )}
      </section>
      {arrangeParams === "stack" && (
        <MyPagination
          current={page}
          totalPage={Math.ceil((collectedMoviesStackList?.length || 0) / 30)}
          totleCount={collectedMoviesStackList?.length || 0}
        />
      )}
      {arrangeParams === "flex" && (
        <MyPagination
          current={currentPage}
          totalPage={totalPages}
          totleCount={totalCount}
        />
      )}

      <MovieDetailView
        open={open}
        setOpen={setOpen}
        clickedMovie={clickedMovie}
      />
    </>
  );
};

export default CollectionCardSection;
