// import { useRequest } from "ahooks";
import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";

const HomeContent = async ({ page, search }) => {
  const resp = await fetch(`http://localhost:3000/api/movies`, {
    method: "POST",
    body: JSON.stringify({ page, search }),
  });
  const data = await resp.json();
  const { pagination = {} } = data;
  return (
    <>
      <CommonCardSection movies={data?.movies || []} />
      {pagination && <MyPagination {...pagination} />}
    </>
  );
};

export default HomeContent;
