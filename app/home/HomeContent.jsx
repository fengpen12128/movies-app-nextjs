"use client";

import { Spinner } from "@radix-ui/themes";
import { useRequest } from "ahooks";
import MyPagination from "@/components/MyPagination";
import { useSearchParams } from "next/navigation";
import CommonCardSection from "@/components/CommonCardSection";

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
      return data;
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

  return (
    <>
      <CommonCardSection movies={data?.movies || []} />
      <MyPagination
        current={currentPage}
        totalPage={totalPages}
        totleCount={totalCount}
      />
    </>
  );
};

export default HomeContent;
