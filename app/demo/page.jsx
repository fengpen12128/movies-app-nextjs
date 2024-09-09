"use client";

import { Card, Container, Flex, Text, Skeleton } from "@radix-ui/themes";
import { useState } from "react";
import { Divider } from "@nextui-org/divider";
import { NextUIProvider } from "@nextui-org/react";
import { MdFavorite } from "react-icons/md";
import { IoDownload } from "react-icons/io5";
import Image from "next/image";

export default function Demo() {
  const list = [
    {
      title: "favorites",
      icon: "/assets/images/icon-favorite-active.svg",
    },
    {
      title: "download",
      icon: "/assets/images/icon-framework.svg",
    },
  ];
  const [silderOpen, setSilderOpen] = useState(true);
  return (
    <div className="h-screen w-screen bg-30 flex items-center justify-center">
      <Container size="1">
        <Flex direction="column" gap="3">
          <Text>
            <Skeleton>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque felis tellus, efficitur id convallis a, viverra eget
              libero. Nam magna erat, fringilla sed commodo sed, aliquet nec
              magna.
            </Skeleton>
          </Text>

          <Skeleton>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque felis tellus, efficitur id convallis a, viverra eget
              libero. Nam magna erat, fringilla sed commodo sed, aliquet nec
              magna.
            </Text>
          </Skeleton>
        </Flex>
      </Container>

      <Card>
        <div>
          <Image
            width={500}
            height={500}
            src="/assets/p2.jpg"
            alt="icon-framework"
          ></Image>

          <div className="flex flex-col items-center">
            <h1>dddddddddd</h1>
            <h1>dddddddddd</h1>
            <h1>dddddddddd</h1>
            <h1>dddddddddd</h1>
            <h1>dddddddddd</h1>
          </div>
        </div>
      </Card>

      <div className="sidebar">
        <div className="navbar">
          {list.map((item) => {
            const { title } = item;
            return (
              <a
                href={`#${title}`}
                title={title.toUpperCase()}
                key={title}
                draggable={false}
                onClick={(e) => goToAnchor(e, title)}
              >
                <div>
                  {title === "favorites" && <MdFavorite />}
                  {title === "download" && <IoDownload />}
                </div>
                <div className="sidebar__title">{title.toUpperCase()}</div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
