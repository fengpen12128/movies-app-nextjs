import MyPagination from "@/components/MyPagination";
import CommonCardSection, {
  StackArrange,
} from "@/components/MovieCardDisplaySection";
const CollectionCardSection = async ({
  page = 1,
  arrange = "flex",
  download = "all",
}) => {
  //   const {
  //     data: filteredMovies,
  //     loading,
  //     error,
  //   } = useRequest(
  //     async () => {
  //       let resp = undefined;
  //       if (arrangeParams === "stack") {
  //         resp = await fetch("/api/movies/collection/groupBy/actresses/list");
  //       } else {
  //         resp = await fetch(
  //           `/api/movies/collection/list?page=${page}&download=${downloadParams}`
  //         );
  //       }
  //       return await resp.json();
  //     },
  //     {
  //       cacheKey: "filteredMovies",
  //       refreshDeps: [page, arrangeParams, downloadParams],
  //     }
  //   );

  let resp = undefined;
  if (arrange === "stack") {
    resp = await fetch(
      "http://localhost:3000/api/movies/collection/groupBy/actresses/list"
    );
  } else {
    resp = await fetch(
      `http://localhost:3000/api/movies/collection/list?page=${page}&download=${download}`
    );
  }
  const filteredMovies = await resp.json();

  const { totalCount, currentPage, totalPages } =
    filteredMovies?.pagination || {};

  return (
    <>
      {/* <section className={colClassDia}> */}
      {arrange === "flex" && filteredMovies?.data && (
        <CommonCardSection moviesList={filteredMovies.data} />
      )}
      {arrange === "stack" && filteredMovies && filteredMovies.length > 0 && (
        <StackArrange moviesList={filteredMovies} />
      )}
      {/* </section> */}

      {arrange === "stack" && (
        <MyPagination
          current={page}
          totalPage={Math.ceil((filteredMovies?.length || 0) / 30)}
          totleCount={filteredMovies?.length || 0}
        />
      )}
      {arrange === "flex" && (
        <MyPagination
          current={currentPage}
          totalPage={totalPages}
          totleCount={totalCount}
        />
      )}
    </>
  );
};

export default CollectionCardSection;
