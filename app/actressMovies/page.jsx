import { Suspense } from "react";
import ActressMoviesClient from "./ActressMoviesClient";
import ScreenLoading from "@/components/ScreenLoading";

export default function ActressMoviesPage({ searchParams }) {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <ActressMoviesClient {...searchParams} />
    </Suspense>
  );
}
