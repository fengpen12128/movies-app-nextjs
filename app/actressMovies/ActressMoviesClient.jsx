import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";
import { getMoviesByActress } from "../actions/index";
import MovieEmpty from "@/components/MovieEmpty";

export default async function ActressMoviesClient({
  page,
  name,
  collected,
  single,
  download,
}) {
  const data = await getMoviesByActress({
    page,
    name,
    collected,
    single,
    download,
  });

  if (data.error) {
    return <div>{data.error}</div>;
  }
  const { movies, pagination } = data;
  return (
    <div>
      {movies.length > 0 ? (
        <CommonCardSection movies={movies} />
      ) : (
        <>
          <MovieEmpty />
        </>
      )}
      <MyPagination {...pagination} />
    </div>
  );
}
