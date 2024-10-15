"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MoviesCard from "@/components/MoviesCard";
import { StackCardContentModal } from "@/components/MoviesPreviewModal";
import { Card, Spinner } from "@radix-ui/themes";
import {
  getCollectedMoviesByActressId,
  getDownloadMoviesByActressId,
} from "@/app/actions";

export default function MoviesStack({
  movies,
  actress,
}: {
  movies: Movie;
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
        <div className="absolute inset-0 flex justify-center items-center">
          <div className={rotateStyle[0]}>
            <Card>
              <div className=" min-h-[280px] rotate-3 w-[80%] "></div>
            </Card>
          </div>
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <div className={rotateStyle[1]}>
            <Card>
              <div className=" min-h-[280px] rotate-3 w-[80%] "></div>
            </Card>
          </div>
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <div className={rotateStyle[2]}>
            <MoviesCard {...movies}></MoviesCard>
          </div>
        </div>

        <div
          onClick={() => setOpen(true)}
          className="absolute inset-0 bg-transparent cursor-pointer"
        ></div>
      </div>

      <StackCardContentModal open={open} setOpen={setOpen}>
        {open && (
          <>
            <h1 className="pb-3 text-xl font-ma">{actress.actressName}</h1>
            <ActressMoviesList actressId={actress.id} />
          </>
        )}
      </StackCardContentModal>
    </>
  );
}
const ActressMoviesList = ({ actressId }: { actressId: number }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const type = pathname.includes("collected") ? "collection" : "download";

  useEffect(() => {
    setLoading(true);
    if (type === "collection") {
      getCollectedMoviesByActressId(actressId).then((res) => {
        setMovies(res.data || []);
        setLoading(false);
      });
    } else if (type === "download") {
      getDownloadMoviesByActressId(actressId).then((res) => {
        setMovies(res.data || []);
        setLoading(false);
      });
    }
  }, [actressId, type]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <section className="grid mt-4 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
      {movies.map((x) => (
        <MoviesCard key={x.id} {...x} />
      ))}
    </section>
  );
};
