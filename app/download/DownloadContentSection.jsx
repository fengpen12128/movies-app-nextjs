import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";
import { getDownloadMovies } from "../actions";

const DownloadContentSection = async ({ page = 1, collected }) => {
  const { movies, pagination } = await getDownloadMovies(page, collected);

  return (
    <>
      <CommonCardSection movies={movies || []} />
      <MyPagination {...pagination} />
    </>
  );
};

export default DownloadContentSection;
