import { CommonDisplay, StackDisplay } from "@/components/MovieCardDisplay";
import { getDownloadMovies } from "@/app/actions";
import MovieEmpty from "@/components/MovieEmpty";
import { getGroupedDownloadMovies } from "@/app/actions/movieAction/getGroupedDownloadMoviesMode";

interface DownloadContentSectionProps {
  page?: number;
  collected?: string;
  arrange?: "flex" | "stack";
}

const DownloadContentSection = async ({
  page = 1,
  collected,
  arrange = "flex",
}: DownloadContentSectionProps) => {
  if (arrange === "flex") {
    const {
      data: movies,
      pagination,
      code,
      msg,
    } = await getDownloadMovies(page, collected);

    if (code !== 200) {
      return <div>{msg}</div>;
    }

    if (movies!.length === 0) {
      return <MovieEmpty />;
    }

    return (
      <CommonDisplay movies={movies as Movie[]} pagination={pagination!} />
    );
  }

  const {
    data: groupedMovies,
    code: groupedCode,
    msg: groupedMsg,
    pagination: groupedPagination,
  } = await getGroupedDownloadMovies(page);

  if (groupedCode !== 200) {
    return <div>{groupedMsg}</div>;
  }

  return (
    <StackDisplay
      movies={groupedMovies as ActressGroupedDownloadMovies[]}
      pagination={groupedPagination!}
    />
  );
};

export default DownloadContentSection;
