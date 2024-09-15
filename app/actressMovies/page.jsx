"use client";

import React from "react";
import { Suspense } from "react";
import ActressMovies from "./ActressMovies.jsx";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActressMovies />
    </Suspense>
  );
};

export default page;
