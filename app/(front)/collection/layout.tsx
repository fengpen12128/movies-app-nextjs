import SharedLayout from "../../shared-layout/layout";
import CollectionActionPanel from "@/components/action-panel/theme2/CollectionActionPanel";
import { ReactNode } from "react";

export const metadata = {
  title: "Movies Collection",
};

export default function CollectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SharedLayout>
      <CollectionActionPanel />
      {children}
    </SharedLayout>
  );
}
