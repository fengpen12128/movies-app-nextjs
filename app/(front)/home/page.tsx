import HomeContent from "./HomeContent";

interface HomeProps {
  searchParams: Record<string, any>;
}

const Home: React.FC<HomeProps> = ({ searchParams }) => {
  return <HomeContent {...searchParams} />;
};

export default Home;
