"use client";

import { useState } from "react";
import MoviesCard from "@/components/MoviesCard";
import { Card } from "@radix-ui/themes";

export default function MoviesStack({
  moviesList = [],
  actress = "",
  handleClickMoviesCard,
}) {
  const [open, setOpen] = useState(false);

  if (moviesList.length < 2) {
    return <></>;
  }

  const rotateStyle = [
    "rotate-3 w-[80%]",
    "rotate-6 w-[80%]",
    "rotate-12 w-[80%]",
  ];

  return (
    <>
      <div onClick={() => setOpen(true)} className="relative h-[350px]">
        {moviesList.slice(0, 3).map((x, index) => (
          <div
            key={x.id}
            className="absolute inset-0 flex justify-center items-center"
          >
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
        onClick={(e) => setOpen(false)}
        className="no-scrollbar fixed inset-0 bg-black bg-opacity-60 h-screen w-screen flex items-center justify-center z-40"
        style={{ display: open ? "flex" : "none" }}
      >
        <Card className="w-full sm:w-2/3" onClick={(e) => e.stopPropagation()}>
          <h1 className="pb-3 text-xl font-ma">{actress}</h1>
          <div className="max-h-[75vh]  overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-1  gap-4 sm:grid-cols-3">
              {moviesList.map((x) => (
                <MoviesCard
                  key={x.id}
                  {...x}
                  coverUrl={`${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`}
                  onClick={() => handleClickMoviesCard(x.id)}
                ></MoviesCard>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
