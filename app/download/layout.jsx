import SharedLayout from "../shared-layout/layout";
import DownloadSettings from "@/components/SubFilterBar/DownloadFilter";

export default function DownloadLayout({ children }) {
  return (
    <SharedLayout>
      <DownloadSettings />
      {children}
    </SharedLayout>
  );
}
