import SearchBar from "@/components/SearchBar";
import ScreenLoading from "@/components/ScreenLoading";
import { Suspense } from "react";
import CrawlInfoAlert from "@/components/CrawlInfoAlert";
import SidesBar from "@/components/SidesBar";

export default function SharedLayout({ children }) {
  return (
    <div
      className={`px-4 sm:px-8 mx-auto sm:w-[90%] pt-6 no-scrollbar sm:h-screen sm:overflow-auto`}
    >
      <CrawlInfoAlert />
      <SidesBar />
      <SearchBar />
      <Suspense fallback={<ScreenLoading />}>
        <main>{children}</main>
      </Suspense>
    </div>
  );
}
