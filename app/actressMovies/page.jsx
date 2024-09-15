import { Suspense } from "react";
import ActressMoviesClient from "./ActressMoviesClient";

export default function ActressMoviesPage({ searchParams }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActressMoviesClient
        initialPage={searchParams.page}
        initialActressName={searchParams.actressName}
      />
    </Suspense>
  );
}
