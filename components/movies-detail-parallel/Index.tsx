"use client";

import dynamic from 'next/dynamic';

const MoviesInfo = dynamic(() => import('./MoviesInfo'), { ssr: false });
const VideoPlayResource = dynamic(() => import('./VideoPlayResource'), { ssr: false });
const MediaPreview = dynamic(() => import('./MediaPreview'), { ssr: false });
const MagnetLinkTable = dynamic(() => import('./MagnetLinkTable'), { ssr: false });
const RelationMovies = dynamic(() => import('./RelationMovies'), { ssr: false });

const Index = ({ movieId }: { movieId: number }) => {
  return (
    <>
      <MoviesInfo movieId={movieId} />
      <VideoPlayResource movieId={movieId} />
      <MediaPreview movieId={movieId} />
      <MagnetLinkTable movieId={movieId} />
      <RelationMovies movieId={movieId} />
    </>
  );
};

export default Index;
