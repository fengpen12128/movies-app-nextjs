"use client";

import { useState } from "react";
import { MdFavorite } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { IoDownload } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";

export default function SiderBar({ handleSiderClick }) {
  const list = [
    {
      title: "首页",
      icon: "home",
    },
    {
      title: "我的收藏",
      icon: "favorites",
      active: false,
    },
    {
      title: "已下载",
      icon: "download",
    },
    {
      title: "资源匹配",
      icon: "match",
    },
  ];

  const [currentTitle, setCurrentTitle] = useState(null);
  return (
    <>
      <div className="sidebar">
        <div className="navbar">
          {list.map((item) => {
            const { title, icon } = item;
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
                  handleSiderClick(title);
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
