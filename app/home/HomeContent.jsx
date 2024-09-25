import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";
import { getMovies } from "../actions/index";

const HomeContent = async ({ page, search, prefix, years, tags }) => {
  const { movies, pagination } = await getMovies({
    page,
    searchKeyword: search,
    prefix,
    years,
    tags,
  });

  return (
    <>
      <CommonCardSection movies={movies} />
      {pagination && <MyPagination {...pagination} />}
    </>
  );
};

export default HomeContent;
