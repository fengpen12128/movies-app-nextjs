"use client";

import React from "react";
import { Home, Heart, Download, Folder, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  title: string;
  icon: string;
  path: string;
  active?: boolean;
}

const SidesBar: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const list: NavItem[] = [
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
    {
      title: "后台管理",
      icon: "admin",
      path: "/admin",
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
                href={path as any}
                className={isActive ? "active sidebar__item" : "sidebar__item"}
                key={title}
              >
                <div>
                  {icon === "home" && <Home size={16} />}
                  {icon === "favorites" && <Heart size={16} />}
                  {icon === "download" && <Download size={16} />}
                  {icon === "match" && <Folder size={16} />}
                  {icon === "admin" && <Settings size={16} />}
                </div>
                <p className="font-ma sidebar__title">{title}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SidesBar;
