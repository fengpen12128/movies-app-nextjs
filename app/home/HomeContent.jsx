"use client";

import { useEffect, useState, useCallback } from "react";

import MoviesCard from "@/components/MoviesCard";
import MovieDetailView from "@/components/MovieDetailView";
import { Card, Spinner, Select, Flex } from "@radix-ui/themes";
import { useRequest } from "ahooks";
import MyPagination from "@/components/MyPagination";
import { useSearchParams } from "next/navigation";

const CardContent = ({ movies }) => {
  const [clickedMovie, setClickMovie] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClickMoviesCard = (code) => {
    setOpen(true);
    setClickMovie(code);
  };

  const colClassDia = `grid gap-5 grid-cols-1 sm:grid-cols-4`;

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

const HomeContent = () => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const { data, loading, error } = useRequest(
    async () => {
      const resp = await fetch(`/api/movies`, {
        method: "POST",
        body: JSON.stringify({ page, search }),
      });
      const data = await resp.json();
      data.movies?.forEach((x) => {
        x.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`;
      });
      return data
    },
    {
      refreshDeps: [page, search],
    }
  );

  const { totalCount, currentPage, totalPages } = data?.pagination || {};

  if (error) {
    console.error("Error fetching movies:", error);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="3" />
      </div>
    );
  }

  //const displayDialog = `px-8 container mx-auto h-screen pt-6 no-scrollbar overflow-auto`;

  return (
    <>
      <div>
        <Card className="mb-5">
          <Flex gap="3" align="center">
            <label>Downloads</label>
            <Select.Root size="2" defaultValue="1">
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="1">全部</Select.Item>
                <Select.Item value="2">已下载</Select.Item>
                <Select.Item value="3">未下载</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        <CardContent movies={data?.movies || []} />
        <MyPagination
          current={currentPage}
          totalPage={totalPages}
          totleCount={totalCount}
        />
      </div>
    </>
  );
};

export default HomeContent;
