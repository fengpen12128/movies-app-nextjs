import { Suspense } from "react";

import ResourceMatching from "./ResourceMatching";
import ScreenLoading from "@/components/ScreenLoading";

export default function ResourceMatchingPage() {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <ResourceMatching />
    </Suspense>
  );
}
