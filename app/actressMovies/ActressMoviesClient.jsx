import { CommonDisplay } from "@/components/MovieCardDisplay";
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
  const { data: movies, pagination, code, msg } = data;

  if (code !== 200) {
    return <div>{msg}</div>;
  }
  if (movies.length === 0) {
    return <MovieEmpty />;
  }

  return <CommonDisplay movies={movies} pagination={pagination} />;
}
