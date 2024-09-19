"use client";

import ScreenLoading from "@/components/ScreenLoading";
import SharedLayout from "../shared-layout/layout";
import DownloadSettings from "@/components/SubFilterBar/DownloadFilter";
import { Suspense } from "react";

export default function DownloadLayout({ children }) {
  return (
    <SharedLayout>
      <DownloadSettings />
      {children}
    </SharedLayout>
  );
}
