import { Metadata } from "next";
import MoviesManagerTable from "../table/moviesManager/Index";

export const metadata: Metadata = {
  title: "Movies Manager",
  description: "A movies manager build using Tanstack Table.",
};

export default async function TaskPage() {
  return (
    <div className="px-24">
      <MoviesManagerTable />
    </div>
  );
}
