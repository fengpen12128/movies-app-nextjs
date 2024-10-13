import SharedLayout from "../shared-layout/layout";
import CollectionSettings from "@/components/SubFilterBar/CollectionFilter";
import { ReactNode } from 'react';

export const metadata = {
  title: "movies (我的收藏)",
};

export default function CollectionLayout({ children }: { children: ReactNode }) {
  return (
    <SharedLayout>
      <CollectionSettings />
      {children}
    </SharedLayout>
  );
}
