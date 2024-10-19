import SharedLayout from "../shared-layout/layout";
import CollectionSettings from "@/components/SubFilterBar/CollectionFilter2";
import { ReactNode } from 'react';

export const metadata = {
  title: "Movies Collection",
};

export default function CollectionLayout({ children }: { children: ReactNode }) {
  return (
    <SharedLayout>
      <CollectionSettings />
      {children}
    </SharedLayout>
  );
}
