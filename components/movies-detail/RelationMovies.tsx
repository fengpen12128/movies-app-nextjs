import { CommonDisplay } from "@/components/MovieCardDisplay";
import { useState, useEffect } from "react";
import { getActressRelMovies } from "@/app/actions";

export default function RelationMovies({ movieId }: { movieId: number }) {
  const [relMovies, setRelMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getActressRelMovies(movieId).then((res) => {
      setRelMovies(res.data || []);
    });
  }, [movieId]);

  return (
    <div className="w-full mt-10 bg-base-100 rounded  p-2">
      <div className="pb-2 flex justify-between">
        <div className="text-xl font-ibmPlexMono">She also starred in</div>
      </div>
      {/* <div className="grid gap-3 mt-2 grid-cols-1 sm:grid-cols-3">
        {relMovies.map((x: Movie) => (
          <MoviesCard key={x.id} {...x}></MoviesCard>
        ))}
      </div> */}

      <CommonDisplay movies={relMovies} />
    </div>
  );
}
