import SharedLayout from "../shared-layout/layout";
import DownloadFilter from "@/components/SubFilterBar/DownloadFilter";

export const metadata = {
  title: "movies (我的下载)",
};

export default function DownloadLayout({ children }) {
  return (
    <SharedLayout>
      <DownloadFilter />
      {children}
    </SharedLayout>
  );
}
