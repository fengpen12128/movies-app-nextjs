import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";

export default async function ActressMoviesClient({ page, actressName }) {
  const resp = await fetch(`http://localhost:3000/api/movies/actressRel/all`, {
    method: "POST",
    body: JSON.stringify({ page, actressName }),
  });
  const data = await resp.json();

  return (
    <>
      <CommonCardSection movies={data?.movies || []} />
      <MyPagination {...data?.pagination} />
    </>
  );
}
