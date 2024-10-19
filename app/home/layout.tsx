import SharedLayout from "../shared-layout/layout";
import HomeActionPanel from "@/components/action-panel/theme2/HomeActionPanel";
import { ReactNode } from "react";

interface CollectionLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Home",
};

export default function CollectionLayout({ children }: CollectionLayoutProps) {
  return (
    <SharedLayout>
      <HomeActionPanel />
      {children}
    </SharedLayout>
  );
}
