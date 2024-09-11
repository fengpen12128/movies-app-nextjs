import React from "react";
import Collections from "./components/Collections";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Collections />
    </Suspense>
  );
};

export default page;
