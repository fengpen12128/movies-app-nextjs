"use client";

import { Suspense } from "react";
import HomeContent from "./HomeContent";

const Home = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
};

export default Home;
