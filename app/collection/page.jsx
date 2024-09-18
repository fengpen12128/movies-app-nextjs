import { Suspense } from "react";
import CollectionCardSection from "./CollectionCardSection.jsx";
import ScreenLoading from "@/components/ScreenLoading";
const page = ({ searchParams }) => {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <CollectionCardSection {...searchParams} />
    </Suspense>
  );
};

export default page;
