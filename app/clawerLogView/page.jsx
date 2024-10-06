import { Suspense } from "react";
import ClawerLogView from "./ClawerLogView";
const Page = ({ searchParams }) => {
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <ClawerLogView {...searchParams} />
      </Suspense>
    </>
  );
};

export default Page;
