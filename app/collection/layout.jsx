"use client";

import SharedLayout from "../shared-layout/layout";
import CollectionSettings from "@/components/CollectionSettings";
import { Suspense } from "react";

export default function CollectionLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SharedLayout>
        <CollectionSettings />
        {children}
      </SharedLayout>
    </Suspense>
  );
}
