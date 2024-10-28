import { CommonDisplay, StackDisplay } from "@/components/MovieCardDisplay";
import {
  getCollectionMovies,
  getGroupedCollectedMoviesMode,
} from "@/app/actions";
import useCommonstore from "@/store/commonStore";
import MovieEmpty from "@/components/MovieEmpty";

interface CollectionProps {
  page?: number;
  download?: string;
  order?: MovieOrder;
  arrange?: "flex" | "stack";
}

export default async function CollectionCardSection({
  page = 1,
  download,
  order = "favoriteDesc",
  arrange = "flex",
}: CollectionProps) {
  const isFlexArrangement = arrange === "flex";
  const { data, code, msg, pagination } = isFlexArrangement
    ? await getCollectionMovies({ page, download, order })
    : await getGroupedCollectedMoviesMode({ page, order });

  if (code !== 200) {
    return <div>{msg}</div>;
  }

  if (data!.length === 0) {
    return <MovieEmpty />;
  }

  if (isFlexArrangement) {
    // useCommonstore.getState().setPagination(pagination!);
    return <CommonDisplay movies={data as Movie[]} pagination={pagination!} />;
  }

  return (
    <StackDisplay
      movies={data as ActressGroupedMovies[]}
      pagination={pagination!}
    />
  );
}
