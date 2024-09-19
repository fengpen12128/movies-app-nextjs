import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";
import { getDownloadMovies } from "../actions";

const DownloadContentSection = async ({ page = 1, collectedStatus }) => {
  //   const resp = await fetch(
  //     `http://localhost:3000/api/movies/download?page=${page}&collected=${collectedStatus}`
  //   );
  //   const data = await resp.json();

  const { movies, pagination } = await getDownloadMovies();

  return (
    <>
      <CommonCardSection movies={movies || []} />
      <MyPagination {...pagination} />
    </>
  );
};

export default DownloadContentSection;
