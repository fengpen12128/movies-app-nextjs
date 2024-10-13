import SearchBar from "@/components/SearchBar";
import ScreenLoading from "@/components/ScreenLoading";
import { Suspense, ReactNode } from "react";
import CrawlInfoAlert from "@/components/CrawlInfoAlert";

interface SharedLayoutProps {
  children: ReactNode;
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  return (
    <div
      className={`px-4 sm:px-8 mx-auto sm:w-[90%] pt-6 no-scrollbar sm:h-screen sm:overflow-auto`}
    >
      {/* <CrawlInfoAlert /> */}

      <Suspense fallback={<ScreenLoading />}>
        <SearchBar />
        <main>{children}</main>
      </Suspense>
    </div>
  );
}
