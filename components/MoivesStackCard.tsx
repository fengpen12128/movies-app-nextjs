"use client";

import { useState } from "react";
import MoviesCard from "@/components/MoviesCard";
import { StackCardContentModal } from "@/components/MoviesPreviewModal";
import { CommonDisplay } from "@/components/MovieCardDisplay";

export default function MoviesStack({
  movies,
  actress,
}: {
  movies: Movie[];
  actress: Actress;
}) {
  const [open, setOpen] = useState(false);

  const rotateStyle = [
    "rotate-3 w-[80%]",
    "rotate-6 w-[80%]",
    "rotate-12 w-[80%]",
  ];

  return (
    <>
      <div className="relative h-[350px]">
        {movies.slice(0, 3).map((x, index) => (
          <div
            key={x.id}
            className="absolute inset-0 flex justify-center items-center"
          >
            <div className={rotateStyle[index]}>
              <MoviesCard {...x}></MoviesCard>
            </div>
          </div>
        ))}
        <div
          onClick={() => setOpen(true)}
          className="absolute inset-0 bg-transparent cursor-pointer"
        ></div>
      </div>

      <StackCardContentModal open={open} setOpen={setOpen}>
        {open && (
          <>
            <h1 className="pb-3 text-xl font-ma">{actress.actressName}</h1>
            <section className="grid mt-4 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
              {movies.map((x) => (
                <MoviesCard key={x.id} {...x} />
              ))}
            </section>
          </>
        )}
      </StackCardContentModal>

    </>
  );
}
