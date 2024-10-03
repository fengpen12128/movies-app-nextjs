import SharedLayout from "../shared-layout/layout";
import HomeFilter from "@/components/SubFilterBar/HomeFilter";

export default function CollectionLayout({ children }) {
  return (
    <SharedLayout>
      <HomeFilter />
      {children}
    </SharedLayout>
  );
}
