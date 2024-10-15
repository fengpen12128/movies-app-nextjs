import DownloadContentSection from "./DownloadContentSection";

interface DownloadProps {
  searchParams: any;
}

const Download: React.FC<DownloadProps> = ({ searchParams }) => {
  return <DownloadContentSection {...searchParams} />;
};

export default Download;
