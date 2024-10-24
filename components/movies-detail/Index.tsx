import VideoPlayResource from "./VideoPlayResource";
import MoviesInfo from "./MoviesInfo";
import MoviesPreview from "./MediaPreview";
import MagnetLinkTable from "./MagnetLinkTable";
import RelationMovies from "./RelationMovies";

const Index = ({ movieId }: { movieId: number }) => {
  return (
    <>
      <MoviesInfo movieId={movieId} />
      <VideoPlayResource movieId={movieId} />
      <MoviesPreview movieId={movieId} />
      <MagnetLinkTable movieId={movieId} />
      <RelationMovies movieId={movieId} />
    </>
  );
};

export default Index;
