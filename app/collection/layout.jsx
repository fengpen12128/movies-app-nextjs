import SharedLayout from "../shared-layout/layout";
import CollectionSettings from "@/components/SubFilterBar/CollectionFilter";
import { Suspense } from "react";
import ScreenLoading from "@/components/ScreenLoading";
export default function CollectionLayout({ children }) {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <SharedLayout>
        <CollectionSettings />
        {children}
      </SharedLayout>
    </Suspense>
  );
}
