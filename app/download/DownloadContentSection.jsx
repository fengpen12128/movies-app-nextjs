import MyPagination from "@/components/MyPagination";
import CommonCardSection from "@/components/MovieCardDisplaySection";

const DownloadContentSection = async ({ page = 1, collectedStatus }) => {
  const resp = await fetch(
    `http://localhost:3000/api/movies/download?page=${page}&collected=${collectedStatus}`
  );
  const data = await resp.json();

  return (
    <>
      <CommonCardSection movies={data?.movies || []} />
      <MyPagination {...data?.pagination} />
    </>
  );
};

export default DownloadContentSection;
