"use client";

import { Spinner } from "@radix-ui/themes";
import { useRequest } from "ahooks";
import MyPagination from "@/components/MyPagination";
import { useSearchParams } from "next/navigation";
import CommonCardSection from "@/components/CommonCardSection";

const ActressMovies = () => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const actressName = searchParams.get("actressName") || "";
  const { data, loading, error } = useRequest(
    async () => {
      const resp = await fetch(`/api/movies/actressRel/all`, {
        method: "POST",
        body: JSON.stringify({ page, actressName }),
      });
      const data = await resp.json();
      data.movies?.forEach((x) => {
        x.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`;
      });
      return data;
    },
    {
      refreshDeps: [page, actressName],
    }
  );

  const { totalCount, currentPage, totalPages } = data?.pagination || {};

  if (error) {
    console.error("Error fetching movies:", error);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommonCardSection movies={data?.movies || []} />
      <MyPagination
        current={currentPage}
        totalPage={totalPages}
        totleCount={totalCount}
      />
    </Suspense>
  );
};

export default ActressMovies;
