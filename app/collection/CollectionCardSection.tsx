import { CommonDisplay, StackDisplay } from "@/components/MovieCardDisplay";
import { getCollectionMovies } from "@/app/actions";
import { getGroupedCollectedMoviesMode } from "@/app/actions";
import useCommonstore from "@/store/commonStore";
import MovieEmpty from "@/components/MovieEmpty";
interface CollectionProps {
  page?: number;
  download?: string;
  arrange?: "flex" | "stack";
}

export default async function CollectionCardSection({
  page = 1,
  download,
  arrange = "flex",
}: CollectionProps) {
  if (arrange === "flex") {
    const {
      data: movies,
      code,
      msg,
      pagination,
    } = await getCollectionMovies({ page, download });

    if (code !== 200) {
      return <div>{msg}</div>;
    }

    if (movies!.length === 0) {
      return <MovieEmpty />;
    }

    useCommonstore.getState().setPagination(pagination!);

    return (
      <CommonDisplay movies={movies as Movie[]} pagination={pagination!} />
    );
  }

  const {
    data: groupedMovies,
    code: groupedCode,
    msg: groupedMsg,
    pagination: groupedPagination,
  } = await getGroupedCollectedMoviesMode(page);

  return (
    <StackDisplay
    
      movies={groupedMovies as ActressGroupedMovies[]}
      pagination={groupedPagination!}
    />
  );
}
