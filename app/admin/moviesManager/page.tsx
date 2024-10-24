import { Metadata } from "next";
import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { movieSchema } from "./data/schema";
import { getMoviesList } from "@/app/actions/admin";
export const metadata: Metadata = {
  title: "Movies Manager",
  description: "A movies manager build using Tanstack Table.",
};

export default async function TaskPage() {
  const { data, pagination, code } = await getMoviesList({ page: 1 });
  const moviesData = z.array(movieSchema).parse(data);

  return (
    <div className="min-h-screen px-24">
      <div className="flex flex-col space-y-4">
        <DataTable data={moviesData} columns={columns} />
      </div>
    </div>
  );
}
