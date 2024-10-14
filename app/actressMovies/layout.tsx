import DescriptionBar from "./DescriptionBar";
import { Suspense, ReactNode } from "react";
import ScreenLoading from "@/components/ScreenLoading";

export const metadata = {
  title: "Actress Movies",
};

interface ActressMoviesLayoutProps {
  children: ReactNode;
}

export default function ActressMoviesLayout({
  children,
}: ActressMoviesLayoutProps) {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <DescriptionBar>{children}</DescriptionBar>
    </Suspense>
  );
}
