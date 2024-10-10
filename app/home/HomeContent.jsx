import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";
import { getMovies } from "../actions/index";

const HomeContent = async ({ page, search, prefix, years, tags,batchId }) => {
  const { movies, pagination } = await getMovies({
    page,
    searchKeyword: search,
    prefix,
    years,
    tags,
    batchId,
  });

  return (
    <>
      <CommonCardSection movies={movies} />
      {pagination && <MyPagination {...pagination} />}
    </>
  );
};

export default HomeContent;
