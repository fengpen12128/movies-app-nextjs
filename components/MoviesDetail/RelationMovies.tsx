"use client";

import MoviesCard from "@/components/movie-card-styles/MoviesCard";

export default function RelationMovies({
  relMovies,
  setMovieId,
}: {
  relMovies: Movie[];
  setMovieId: (movieId: number) => void;
}) {
  return (
    <div className="w-full mt-10 bg-base-100 rounded  p-2">
      <div className="pb-2 flex justify-between">
        <div className="text-xl font-ibmPlexMono">She also starred in</div>
      </div>
      <div className="grid gap-3 mt-2 grid-cols-1 sm:grid-cols-3">
        {relMovies.map((x: Movie) => (
          <MoviesCard
            key={x.id}
            {...x}
            onClick={() => setMovieId(x.id)}
          ></MoviesCard>
        ))}
      </div>
    </div>
  );
}
