"use client";

import { Card, Button } from "@radix-ui/themes";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { getActressFavStatus, toggleActressFav } from "@/app/actions";

import { message } from "react-message-popup";
import ActressMoviesActionPanel from "@/components/action-panel/ActressMoviesActionPanel";
import { zenMaruGothic } from "@/app/fonts";

interface DescriptionBarProps {
  children: React.ReactNode;
}

export default function DescriptionBar({ children }: DescriptionBarProps) {
  const [name] = useQueryState("name");
  const [isFav, setIsFav] = useState(false);

  const handleSaveFav = async () => {
    if (name) {
      const { code, msg } = await toggleActressFav(name);
      if (code === 200) {
        message.success(msg!);
        setIsFav(!isFav);
      } else {
        message.error(msg!);
      }
    }
  };

  useEffect(() => {
    const fetchFavStatus = async () => {
      const { code, data, msg } = await getActressFavStatus(name!);
      if (code !== 200) {
        message.error(msg!);
      }
      setIsFav(data!);
    };
    if (name) {
      fetchFavStatus();
    }
  }, [name]);

  return (
    <div
      className={`px-4 no-scrollbar sm:px-8 sm:w-[90%] mx-auto pt-6 sm:h-screen sm:overflow-auto`}
    >
      <Card>
        <div>
          <div className={`flex justify-between ${zenMaruGothic.className}`}>
            <span className="text-3xl font-bold">{name}</span>
            <Button
              color={isFav ? "red" : "cyan"}
              variant="outline"
              onClick={handleSaveFav}
              radius="large"
            >
              {isFav ? "已收藏" : "收藏"}
            </Button>
          </div>
          <div className="mt-4">
            <ActressMoviesActionPanel />
          </div>
        </div>
      </Card>
      <main>{children}</main>
    </div>
  );
}
