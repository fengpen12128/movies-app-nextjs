import SearchBar from "@/components/SearchBar";
import ScreenLoading from "@/components/ScreenLoading";
import { Suspense } from "react";
import CrawlInfoAlert from "@/components/CrawlInfoAlert";

export default function SharedLayout({ children }) {
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
