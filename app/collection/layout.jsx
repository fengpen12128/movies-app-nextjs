import SharedLayout from "../shared-layout/layout";
import CollectionSettings from "@/components/SubFilterBar/CollectionFilter";

export const metadata = {
  title: "movies (我的收藏)",
};
export default function CollectionLayout({ children }) {
  return (
    <SharedLayout>
      <CollectionSettings />
      {children}
    </SharedLayout>
  );
}
