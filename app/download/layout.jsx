"use client";

import SharedLayout from "../shared-layout/layout";
import DownloadSettings from "@/components/DownloadSettings";
import { Suspense } from "react";

export default function DownloadLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SharedLayout>
        <DownloadSettings />
        {children}
      </SharedLayout>
    </Suspense>
  );
}