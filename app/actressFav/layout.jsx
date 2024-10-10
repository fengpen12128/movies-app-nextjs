import SharedLayout from "../shared-layout/layout";
import { Suspense } from "react";
import ScreenLoading from "@/components/ScreenLoading";

export const metadata = {
  title: "收藏演员",
};

export default function ActressCollectionMain({ children }) {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <SharedLayout>{children}</SharedLayout>
    </Suspense>
  );
}
