"use client";

import React from "react";
import { Home, Heart, Download, Folder, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ibmPlexMono } from "@/app/fonts";

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
      title: "Home",
      icon: "home",
      path: "/home",
    },
    {
      title: "Collection",
      icon: "favorites",
      active: false,
      path: "/collection",
    },
    {
      title: "Actresses",
      icon: "favorites",
      active: false,
      path: "/actressFav",
    },
    {
      title: "Downloaded",
      icon: "download",
      path: "/download",
    },
    {
      title: "Admin",
      icon: "admin",
      path: "/admin",
    },
  ];

  return (
    <>
      <div className="sidebar">
        <nav className="navbar">
          {list.map((item) => {
            const { title, icon, path } = item;
            const isActive =
              pathname === path || (path === "/" && pathname === "/home");

            return (
              <Link
                href={path as any}
                className={isActive ? "active sidebar__item" : "sidebar__item"}
                key={title}
                target={path === "/admin" ? "_blank" : undefined}
              >
                <div className="sidebar__icon">
                  {icon === "home" && <Home size={20} />}
                  {icon === "favorites" && <Heart size={20} />}
                  {icon === "download" && <Download size={20} />}
                  {icon === "match" && <Folder size={20} />}
                  {icon === "admin" && <Settings size={20} />}
                </div>
                <p className={`${ibmPlexMono.className} sidebar__title desktop-only`}>
                  {title}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default SidesBar;
