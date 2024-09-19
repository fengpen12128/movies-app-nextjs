import MyPagination from "@/components/MyPagination";
import CommonCardSection, {
  StackArrange,
} from "../../components/MovieCardDisplaySection.jsx";

const CollectionCardSection = async ({
  page = 1,
  arrange = "flex",
  download = "all",
}) => {
  let resp;
  if (arrange === "stack") {
    resp = await fetch(
      "http://localhost:3000/api/movies/collection/groupBy/actresses/list"
    );
  } else {
    resp = await fetch(
      `http://localhost:3000/api/movies/collection/list?page=${page}&download=${download}`
    );
  }
  const filteredMovies = await resp.json();

  return (
    <>
      {arrange === "flex" && <CommonCardSection movies={filteredMovies.data} />}
      {arrange === "stack" && <StackArrange movies={filteredMovies} />}

      <MyPagination {...filteredMovies?.pagination} />
    </>
  );
};

export default CollectionCardSection;
