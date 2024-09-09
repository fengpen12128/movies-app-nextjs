import dynamic from "next/dynamic";

const MoviesDetailClient = dynamic(() => import("./MoviesDetail/Index"), {
  ssr: false,
});
const MoviesDetail = (props) => <MoviesDetailClient {...props} />;

export default MoviesDetail;
