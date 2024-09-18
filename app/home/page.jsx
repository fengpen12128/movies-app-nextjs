import { Suspense } from "react";
import HomeContent from "./HomeContent";
import ScreenLoading from "@/components/ScreenLoading";

const Home = ({ searchParams }) => {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <HomeContent {...searchParams} />
    </Suspense>
  );
};

export default Home;
