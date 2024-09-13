"use client";

import React from "react";
import { Suspense } from "react";
import CollectionCardSection from './CollectionCardSection.jsx';

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionCardSection />
    </Suspense>
  );
};

export default page;
