import { Suspense } from "react";
import VideoPlayResource from "./VideoPlayResource";
import MoviesInfo from "./MoviesInfo";
import MoviesPreview from "./MediaPreview";
import MagnetLinkTable from "./MagnetLinkTable";
import RelationMovies from "./RelationMovies";

const Index = ({ movieId }: { movieId: number }) => {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <MoviesInfo movieId={movieId} />
      </Suspense>

      <Suspense fallback={<>Loading...</>}>
        <VideoPlayResource movieId={movieId} />
      </Suspense>

      <Suspense fallback={<>Loading...</>}>
        <MoviesPreview movieId={movieId} />
      </Suspense>

      <Suspense fallback={<>Loading...</>}>
        <MagnetLinkTable movieId={movieId} />
      </Suspense>

      <Suspense fallback={<>Loading...</>}>
        <RelationMovies movieId={movieId} />
      </Suspense>
    </>
  );
};

export default Index;
