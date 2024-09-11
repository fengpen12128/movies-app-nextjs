"use client";

import { useState } from "react";
import MoviesCard from "@/components/MoviesCard";
import { Card } from "@radix-ui/themes";
import MovieDetailView from "@/components/MovieDetailView";

export function MoviesStackMy({ moviesList = [], actress = "" }) {
  const [open, setOpen] = useState(false);

  if (moviesList.length < 2) {
    return <></>;
  }

  const rotateStyle = [
    "rotate-3 w-[80%]",
    "rotate-6 w-[80%]",
    "rotate-12 w-[80%]",
  ];

  const [clickedMovie, setClickMovieed] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <>
      <MovieDetailView
        open={openDetail}
        setOpen={setOpenDetail}
        clickedMovie={clickedMovie}
      />
      <div onClick={() => setOpen(true)} className="relative h-[350px]">
        {moviesList.slice(0, 3).map((x, index) => (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className={rotateStyle[index]}>
              <MoviesCard
                {...x}
                coverUrl={`${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`}
              ></MoviesCard>
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={(e) => {
          setOpen(false);
        }}
        className="no-scrollbar fixed inset-0 bg-black bg-opacity-60 h-screen w-screen flex items-center justify-center z-40"
        style={{ display: open ? "flex" : "none" }}
      >
        <Card
          className="w-full sm:w-2/3    "
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="pb-3 text-xl font-ma">{actress}</h1>
          {/* <div className="h-[85vh] sm:h-[85vh]  overflow-y-auto no-scrollbar"> */}
          <div className="max-h-[75vh]  overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-1  gap-4 sm:grid-cols-3">
              {moviesList.map((x) => (
                <MoviesCard
                  {...x}
                  coverUrl={`${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`}
                  onClick={() => {
                    setClickMovieed(x.id);
                    setOpenDetail(true);
                  }}
                ></MoviesCard>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}