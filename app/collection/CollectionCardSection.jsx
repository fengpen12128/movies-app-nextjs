import MyPagination from "@/components/MyPagination";
import CommonCardSection, {
  StackArrange,
} from "../../components/MovieCardDisplaySection.jsx";
import { getCollectionMovies } from "../actions/index.jsx";

const CollectionCardSection = async ({
  page = 1,
  arrange = "flex",
  download = "all",
}) => {
  const resp = await getCollectionMovies({ page, download });
  if (resp.error) {
    return <div>{resp.error}</div>;
  }
  //   let resp;
  //   if (arrange === "stack") {
  //     resp = await fetch(
  //       "http://localhost:3000/api/movies/collection/groupBy/actresses/list"
  //     );
  //   } else {
  //     resp = await fetch(
  //       `http://localhost:3000/api/movies/collection/list?page=${page}&download=${download}`
  //     );
  //   }
  const { movies, pagination } = resp;

  return (
    <>
      {arrange === "flex" && <CommonCardSection movies={movies} />}
      {/* {arrange === "stack" && <StackArrange movies={movies} />} */}

      <MyPagination {...pagination} />
    </>
  );
};

export default CollectionCardSection;
