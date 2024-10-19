import SharedLayout from "../shared-layout/layout";
import DownloadFilter from "@/components/SubFilterBar/DownloadFilter";
import DownloadFilter2 from "@/components/SubFilterBar/DownloadFilter2";

export const metadata = {
  title: "Movies Download",
};

interface DownloadLayoutProps {
  children: React.ReactNode;
}

export default function DownloadLayout({ children }: DownloadLayoutProps) {
  return (
    <SharedLayout>
      <DownloadFilter2 />
      {children}
    </SharedLayout>
  );
}
