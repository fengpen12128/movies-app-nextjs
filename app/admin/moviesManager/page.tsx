import { Metadata } from "next";
import { DataTable } from "./components/data-table";

export const metadata: Metadata = {
  title: "Movies Manager",
  description: "A movies manager build using Tanstack Table.",
};

export default async function TaskPage() {
  return (
    <div className="min-h-screen px-24">
      <div className="flex flex-col space-y-4">
        <DataTable />
      </div>
    </div>
  );
}
