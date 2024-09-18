import { Spinner } from "@radix-ui/themes";
// import { useRequest } from "ahooks";
import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";

const HomeContent = async ({ page, search }) => {
  //   const { data, loading, error } = useRequest(
  //     async () => {
  //       const resp = await fetch(`/api/movies`, {
  //         method: "POST",
  //         body: JSON.stringify({ page, search }),
  //       });
  //       const data = await resp.json();
  //       data.movies?.forEach((x) => {
  //         x.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`;
  //       });
  //       return data;
  //     },
  //     {
  //       refreshDeps: [page, search],
  //     }
  //   );
  const resp = await fetch(`http://localhost:3000/api/movies`, {
    method: "POST",
    body: JSON.stringify({ page, search }),
  });
  const data = await resp.json();
  data.movies?.forEach((x) => {
    x.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`;
  });
  const { totalCount, currentPage, totalPages } = data?.pagination || {};

  //   if (error) {
  //     console.error("Error fetching movies:", error);
  //   }

  //   if (loading) {
  //     return (
  //       <div className="flex items-center justify-center h-full w-full">
  //         <Spinner size="3" />
  //       </div>
  //     );
  //   }

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
