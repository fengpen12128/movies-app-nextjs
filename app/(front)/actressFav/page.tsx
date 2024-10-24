import ActressCollectionMain from "./ActressCollectionMain";


interface PageProps {
  searchParams: Record<string, any>;
}

const Page: React.FC<PageProps> = ({ searchParams }) => {
  return <ActressCollectionMain {...searchParams} />;
};

export default Page;
