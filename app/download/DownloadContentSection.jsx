import { CommonDisplay } from "@/components/MovieCardDisplay";
import { getDownloadMovies } from "@/app/actions";

const DownloadContentSection = async ({ page = 1, collected }) => {
  const {
    data: movies,
    pagination,
    code,
  } = await getDownloadMovies(page, collected);

  if (code !== 200) {
    return <div>Not found</div>;
  }

  return <CommonDisplay movies={movies} pagination={pagination} />;
};

export default DownloadContentSection;
