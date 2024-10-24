import CollectionCardSection from "./CollectionCardSection";

interface PageProps {
  searchParams: Record<string, any>;
}

const Page: React.FC<PageProps> = ({ searchParams }) => {
  return <CollectionCardSection {...searchParams} />;
};

export default Page;
