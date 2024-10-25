import HomeContent from "./HomeContent";

interface HomeProps {
  searchParams: Record<string, any>;
}

//export const dynamic = "force-dynamic";

const Home: React.FC<HomeProps> = ({ searchParams }) => {
  return <HomeContent {...searchParams} />;
};

export default Home;
