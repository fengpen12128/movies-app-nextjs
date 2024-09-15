import { Suspense } from "react";
import ActressMoviesLayoutClient from "./ActressMoviesLayoutClient";

export default function ActressMoviesLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActressMoviesLayoutClient>
        {children}
      </ActressMoviesLayoutClient>
    </Suspense>
  );
}
