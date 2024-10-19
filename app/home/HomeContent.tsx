import { CommonDisplay } from "@/components/MovieCardDisplay";
import { getMovies } from "@/app/actions";
import MovieEmpty from "@/components/MovieEmpty";

const HomeContent: React.FC<MovieQueryParams> = async (params) => {
  const { data, pagination, code, msg } = await getMovies({
    ...params,
    actressName: undefined,
  });
  if (code !== 200) {
    return <div>{msg}</div>;
  }
  if (data!.length === 0) {
    return <MovieEmpty />;
  }
  return <CommonDisplay movies={data!} pagination={pagination} />;
};

export default HomeContent;
