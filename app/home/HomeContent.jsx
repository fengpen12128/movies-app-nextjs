import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";
import { getMovies } from "../actions";

const HomeContent = async ({ page, search }) => {
  const { movies, pagination } = await getMovies({
    page,
    searchKeyword: search,
  });
  return (
    <>
      <CommonCardSection movies={movies || []} />
      {pagination && <MyPagination {...pagination} />}
    </>
  );
};

export default HomeContent;
