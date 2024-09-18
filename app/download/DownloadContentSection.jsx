import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";

const DownloadContentSection = async ({ page, collectedStatus }) => {
  //   const { data, loading, error } = useRequest(
  //     async () => {
  //       const resp = await fetch(
  //         `/api/movies/download?page=${page}&collected=${collectedStatus}`
  //       );
  //       return await resp.json();
  //     },
  //     {
  //       refreshDeps: [page, collectedStatus],
  //       onSuccess: (result, params) => {
  //         result?.movies?.forEach((movie) => {
  //           movie.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${movie.coverUrl}`;
  //         });
  //       },
  //     }
  //   );

  const resp = await fetch(
    `http://localhost:3000/api/movies/download?page=${page}&collected=${collectedStatus}`
  );
  const data = await resp.json();
  data.movies?.forEach((movie) => {
    movie.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${movie.coverUrl}`;
  });

  const { totalCount, currentPage, totalPages } = data?.pagination || {};

  //   if (loading) {
  //   };

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

export default DownloadContentSection;
