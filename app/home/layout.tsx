import SharedLayout from "../shared-layout/layout";
import HomeFilter from "@/components/SubFilterBar/HomeFilter";
import { ReactNode } from "react";

interface CollectionLayoutProps {
  children: ReactNode;
}

export default function CollectionLayout({ children }: CollectionLayoutProps) {
  return (
    <SharedLayout>
      <HomeFilter />
      {children}
    </SharedLayout>
  );
}
