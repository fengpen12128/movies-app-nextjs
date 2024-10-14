import ActressMoviesPage from "./ActressMoviesPage";

interface PageProps {
  searchParams: {
    name: string;
  };
}

const Page: React.FC<PageProps> = ({ searchParams }) => {
  return <ActressMoviesPage {...searchParams} />;
};

export default Page;
