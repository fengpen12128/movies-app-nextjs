import MyPagination from "@/components/MyPagination";
import { CommonDisplay } from "@/components/MovieCardDisplay";
import { getDownloadMovies } from "../actions/index";

const DownloadContentSection = async ({ page = 1, collected }) => {
  const {
    data: movies,
    pagination,
    code,
  } = await getDownloadMovies(page, collected);

  if (code !== 200) {
    return <div>Not found</div>;
  }

  return (
    <>
      <CommonDisplay movies={movies} />
      <MyPagination {...pagination} />
    </>
  );
};

export default DownloadContentSection;
