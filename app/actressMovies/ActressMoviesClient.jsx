import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";

export default async function ActressMoviesClient({ page, actressName }) {
  //   const { data, loading, error } = useRequest(
  //     async () => {
  //       const resp = await fetch(`/api/movies/actressRel/all`, {
  //         method: "POST",
  //         body: JSON.stringify({ page, actressName }),
  //       });
  //       const data = await resp.json();
  //       data.movies?.forEach((x) => {
  //         x.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`;
  //       });
  //       return data;
  //     },
  //     {
  //       refreshDeps: [page, actressName],
  //     }
  //   );

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
