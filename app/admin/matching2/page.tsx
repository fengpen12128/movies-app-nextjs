import { Suspense } from "react";

import ScreenLoading from "@/components/ScreenLoading";
import MatchResultTable from "../table/matchResultTable/Index";

export default function ResourceMatchingPage() {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <div className="w-[90%] mx-auto">
        <MatchResultTable />
      </div>
    </Suspense>
  );
}
