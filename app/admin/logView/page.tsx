import { Suspense } from "react";
import ClawerLogView from "./ClawerLogView";

interface SearchParams {
  jobId: string;
}

const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ClawerLogView {...searchParams} />
    </Suspense>
  );
};

export default Page;
