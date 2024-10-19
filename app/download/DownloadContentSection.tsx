import { CommonDisplay, StackDisplay } from "@/components/MovieCardDisplay";
import { getDownloadMovies, getGroupedDownloadMovies } from "@/app/actions";
import MovieEmpty from "@/components/MovieEmpty";

interface DownloadContentSectionProps {
  page?: number;
  collected?: string;
  arrange?: "flex" | "stack";
  order?: MovieOrder;
}

const DownloadContentSection = async ({
  page = 1,
  collected,
  arrange = "flex",
  order = "downloadDesc",
}: DownloadContentSectionProps) => {
  const isFlexArrangement = arrange === "flex";
  const { data, pagination, code, msg } = isFlexArrangement
    ? await getDownloadMovies({ page, collected, order })
    : await getGroupedDownloadMovies({ page, order });

  if (code !== 200) {
    return <div>{msg}</div>;
  }

  if (data!.length === 0) {
    return <MovieEmpty />;
  }

  return isFlexArrangement ? (
    <CommonDisplay movies={data as Movie[]} pagination={pagination!} />
  ) : (
    <StackDisplay
      movies={data as ActressGroupedDownloadMovies[]}
      pagination={pagination!}
    />
  );
};

export default DownloadContentSection;
