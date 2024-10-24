import { CommonDisplay } from "@/components/MovieCardDisplay";
import { getMoviesByActressName } from "@/app/actions";
import MovieEmpty from "@/components/MovieEmpty";

interface ActressMoviesClientProps {
  page?: number;
  name: string;
  collected?: string;
  single?: string;
  download?: string;
}

export default async function ActressMoviesPage(
  params: ActressMoviesClientProps
) {
  const {
    data: movies,
    code,
    msg,
    pagination,
  } = await getMoviesByActressName(params);

  if (code !== 200) {
    return <div>{msg}</div>;
  }
  if (movies!.length === 0) {
    return <MovieEmpty />
  }

  return <CommonDisplay movies={movies!} pagination={pagination} />;
}
