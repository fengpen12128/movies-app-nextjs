import SharedLayout from "../shared-layout/layout";
import HomeFilter from "@/components/SubFilterBar/HomeFilter2";
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
      <HomeFilter />
      {children}
    </SharedLayout>
  );
}
