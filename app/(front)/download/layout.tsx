import SharedLayout from "../../shared-layout/layout";
import DownloadActionPanel from "@/components/action-panel/theme2/DownloadActionPanel";

export const metadata = {
  title: "Movies Download",
};

interface DownloadLayoutProps {
  children: React.ReactNode;
}

export default function DownloadLayout({ children }: DownloadLayoutProps) {
  return (
    <SharedLayout>
      <DownloadActionPanel />
      {children}
    </SharedLayout>
  );
}
