"use client";

import SidesBar from "@/components/SidesBar";
import { Card } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";

export default function ActressMoviesLayout({ children }) {
  const searchParams = useSearchParams();
  const actressName = searchParams.get("actressName");
  return (
    <div
      className={`px-4 no-scrollbar sm:px-8 container mx-auto  pt-6 sm:h-screen sm:overflow-auto`}
    >
      <SidesBar />
      <Card>
        <span className="text-2xl font-suse font-bold">{actressName}</span>
      </Card>
      <main>{children}</main>
    </div>
  );
}
