"use client";

import { MdFavorite } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { IoDownload } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SidesBar() {
  const pathname = usePathname();
  const list = [
    {
      title: "首页",
      icon: "home",
      path: "/home",
    },
    {
      title: "我的收藏",
      icon: "favorites",
      active: false,
      path: "/collection",
    },
    {
      title: "收藏演员",
      icon: "favorites",
      active: false,
      path: "/actressFav",
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

  return (
    <>
      <div className="sidebar">
        <div className="navbar">
          {list.map((item) => {
            const { title, icon, path } = item;
            const isActive =
              pathname === path || (path === "/" && pathname === "/home");

            return (
              <Link
                href={path}
                className={isActive ? "active sidebar__item" : "sidebar__item"}
                key={title}
              >
                <div>
                  {icon === "home" && <AiFillHome />}
                  {icon === "favorites" && <MdFavorite />}
                  {icon === "download" && <IoDownload />}
                  {icon === "match" && <GoFileDirectoryFill />}
                </div>
                <p className="font-ma sidebar__title">{title}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
