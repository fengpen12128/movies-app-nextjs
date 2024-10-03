import ActressMoviesLayoutClient from "./ActressMoviesLayoutClient";
import { Suspense } from "react";
import ScreenLoading from "@/components/ScreenLoading";

export const metadata = {
  title: "演员作品",
};

export default function ActressMoviesLayout({ children }) {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <ActressMoviesLayoutClient>{children}</ActressMoviesLayoutClient>
    </Suspense>
  );
}
