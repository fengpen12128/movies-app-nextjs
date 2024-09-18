import { Suspense } from "react";
import DownloadContentSection from "./DownloadContentSection.jsx";
import ScreenLoading from "@/components/ScreenLoading";

const Download = ({ searchParams }) => {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <DownloadContentSection {...searchParams} />
    </Suspense>
  );
};

export default Download;
