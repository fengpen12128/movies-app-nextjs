"use client";

import { useState } from "react";
import { MdFavorite } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { IoDownload } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";
import { useRouter } from "next/navigation";

export default function SidesBar() {
  const router = useRouter();
  const list = [
    {
      title: "首页",
      icon: "home",
      path: "/",
    },
    {
      title: "我的收藏",
      icon: "favorites",
      active: false,
      path: "/collection",
    },
    {
      title: "已下载",
      icon: "download",
      path: "/download",
    },
    {
      title: "资源匹配",
      icon: "match",
      path: "/matching",
    },
  ];

  const [currentTitle, setCurrentTitle] = useState(null);
  return (
    <>
      <div className="sidebar">
        <div className="navbar">
          {list.map((item) => {
            const { title, icon, path } = item;
            return (
              <div
                className={
                  currentTitle === title
                    ? "active sidebar__item"
                    : "sidebar__item"
                }
                key={title}
                draggable={false}
                onClick={() => {
                  setCurrentTitle(title);
                  router.push(path);
                }}
              >
                <div>
                  {icon === "home" && <AiFillHome />}
                  {icon === "favorites" && <MdFavorite />}
                  {icon === "download" && <IoDownload />}
                  {icon === "match" && <GoFileDirectoryFill />}
                </div>
                <div className="font-ma sidebar__title">{title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
