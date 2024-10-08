import MyPagination from "@/components/MyPagination";
import CommonCardSection, {
  StackArrange,
} from "@/components/MovieCardDisplaySection.jsx";
import { getCollectionMovies } from "../actions/index";
import useCommonstore from "@/store/commonStore";

export const StackCollection = async ({ page = 1, download }) => {
  const resp = await getCollectionMovies({ page, download, isStack: true });
  if (resp.error) {
    return <div>{resp.error}</div>;
  }
  const { movies } = resp;
  return <StackArrange movies={movies} />;
};

export const FlexCollection = async ({ page = 1, download }) => {
  const resp = await getCollectionMovies({ page, download });
  if (resp.error) {
    return <div>{resp.error}</div>;
  }
  const { movies, pagination } = resp;

  // Update the store with the new pagination data
  useCommonstore.getState().setPagination(pagination);

  return (
    <>
      <CommonCardSection movies={movies} />
      <MyPagination {...pagination} />
    </>
  );
};

export default function CollectionCardSection({
  page = 1,
  download,
  arrange = "flex",
}) {
  return (
    <>
      {arrange === "flex" ? (
        <FlexCollection page={page} download={download} />
      ) : (
        <StackCollection page={page} download={download} />
      )}
    </>
  );
}
