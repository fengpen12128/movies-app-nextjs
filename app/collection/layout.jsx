import SharedLayout from "../shared-layout/layout";
import CollectionSettings from "@/components/SubFilterBar/CollectionFilter";
export default function CollectionLayout({ children }) {
  return (
    <SharedLayout>
      <CollectionSettings />
      {children}
    </SharedLayout>
  );
}
