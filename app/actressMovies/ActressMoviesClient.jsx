import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";
import { getMoviesByActress } from "../actions";

export default async function ActressMoviesClient({ page, name }) {
  const data = await getMoviesByActress({
    page,
    name,
  });

  if (data.error) {
    return <div>{data.error}</div>;
  }
  const { movies, pagination } = data;
  return (
    <>
      <CommonCardSection movies={movies || []} />
      <MyPagination {...pagination} />
    </>
  );
}
