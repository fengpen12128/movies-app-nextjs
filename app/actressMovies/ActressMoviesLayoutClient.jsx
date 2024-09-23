"use client";

import { Card, Button } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { saveActressFav } from "../actions";
import { message } from "react-message-popup";
export default function ActressMoviesLayoutClient({ children }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";

  const handleSaveFav = async () => {
    const [success, msg] = await saveActressFav(name);
    if (success) {
      message.success(msg);
    } else {
      message.error(msg);
    }
  };

  return (
    <div
      className={`px-4 no-scrollbar sm:px-8 sm:w-[90%] mx-auto pt-6 sm:h-screen sm:overflow-auto`}
    >
      <Card>
        <div className="flex justify-between">
          <span className="text-2xl font-suse font-bold">{name}</span>
          <Button color="gray" variant="outline" onClick={handleSaveFav}>
            收藏
          </Button>
        </div>
      </Card>
      <main>{children}</main>
    </div>
  );
}
