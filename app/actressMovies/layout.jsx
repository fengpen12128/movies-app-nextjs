import ActressMoviesLayoutClient from "./ActressMoviesLayoutClient";
import { Suspense } from "react";
import ScreenLoading from "@/components/ScreenLoading";

export default function ActressMoviesLayout({ children }) {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <ActressMoviesLayoutClient>{children}</ActressMoviesLayoutClient>
    </Suspense>
  );
}
