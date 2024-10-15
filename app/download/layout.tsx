import SharedLayout from "../shared-layout/layout";
import DownloadFilter from "@/components/SubFilterBar/DownloadFilter";

export const metadata = {
  title: "Movies Download",
};

interface DownloadLayoutProps {
  children: React.ReactNode;
}

export default function DownloadLayout({ children }: DownloadLayoutProps) {
  return (
    <SharedLayout>
      <DownloadFilter />
      {children}
    </SharedLayout>
  );
}
