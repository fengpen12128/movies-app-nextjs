"use client";

import { Card } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";

export default function ActressMoviesLayoutClient({ children }) {
  const searchParams = useSearchParams();
  const actressName = searchParams.get("actressName") || "";

  return (
    <div
      className={`px-4 no-scrollbar sm:px-8 sm:w-[90%] mx-auto pt-6 sm:h-screen sm:overflow-auto`}
    >
      <Card>
        <span className="text-2xl font-suse font-bold">{actressName}</span>
      </Card>
      <main>{children}</main>
    </div>
  );
}
