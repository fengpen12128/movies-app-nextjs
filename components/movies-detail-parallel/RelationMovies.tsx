"use client";

import { CommonDisplay } from "@/components/MovieCardDisplay";
import { useQuery } from "@tanstack/react-query";
import { getActressRelMovies } from "@/app/actions";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function RelationMovies({ movieId }: { movieId: number }) {
  const { data: relMovies = [], isLoading: isLoadingRelMovies } = useQuery({
    queryKey: ["relatedMovies", movieId],
    queryFn: async () => {
      const res = await getActressRelMovies(movieId);
      return res.data || [];
    },
    enabled: !!movieId, // 确保只有在 movieId 存在时才执行查询

  });

  return (
    <div className="w-full mt-10 bg-base-100 rounded p-2">
      <div className="pb-2 flex justify-between">
        <div className="text-xl font-ibmPlexMono">She also starred in</div>
      </div>
      {isLoadingRelMovies ? (
        <>Loading...</>
      ) : (
        <CommonDisplay movies={relMovies} />
      )}
    </div>
  );
}
