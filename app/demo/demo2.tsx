"use client";

import React from "react";
import Image from "next/image";

// 定义导航项类型
type NavItem = {
  icon: React.ReactNode;
  label: string;
};

// 定义图片项类型
type ImageItem = {
  id: string;
  imageUrl: string;
  author: string;
  price: string;
  tags: string[];
};

import { useState } from "react";

const Demo2 = () => {
  // 导航选项
  const navItems: NavItem[] = [
    { icon: "📷", label: "Photo" },
    { icon: "🎥", label: "Video" },
    { icon: "✨", label: "Vectors" },
    { icon: "🔊", label: "Sound" },
    { icon: "🥽", label: "VR" },
    { icon: "👓", label: "AR" },
    { icon: "🎮", label: "Mini-games" },
  ];

  // 添加示例数据
  const imageItems: ImageItem[] = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1542931287-023b922fa89b",
      author: "Saudi Male",
      price: "500AED",
      tags: ["#saudi", "#Man", "#Riyadh", "#20-30"],
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1603775020644-eb8decd79994",
      author: "Ahmed Khan",
      price: "650AED",
      tags: ["#portrait", "#Man", "#Dubai", "#25-35"],
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33",
      author: "Maria Smith",
      price: "450AED",
      tags: ["#architecture", "#Dubai", "#modern"],
    },
    {
      id: "4",
      imageUrl: "https://images.unsplash.com/photo-1578895210405-907db486c111",
      author: "John Doe",
      price: "550AED",
      tags: ["#landscape", "#Desert", "#UAE"],
    },
  ];

  // 跟踪选中的图片ID
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  // 添加导航激活状态
  const [activeNav, setActiveNav] = useState<string>("Photo");

  // 同时更新主要展示区的图片
  const heroImage =
    "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699";
  const sideImages = [
    "https://images.unsplash.com/photo-1578722606160-3f88b0ee13e6",
    "https://images.unsplash.com/photo-1565967511849-76a60a516170",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">
      {/* 顶部搜索栏 */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">M</div>
          <div className="text-2xl font-bold">G</div>
          <div className="text-2xl font-bold">T</div>
          <div className="text-2xl font-bold">A</div>
          <div className="text-2xl font-bold">W</div>
          <div className="text-2xl font-bold">A</div>
        </div>
        <div className="flex-1 mx-12">
          <div className="relative">
            <input
              type="search"
              placeholder="Search high-resolution images..."
              className="w-full px-4 py-2 rounded-lg bg-zinc-800/50 pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Image
                src="/icons/search.svg"
                width={20}
                height={20}
                alt="Search"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-gray-300">Send a brief</button>
          <button className="px-4 py-2 bg-zinc-800 rounded-lg">
            Subscribe
          </button>
          <button className="p-2">
            <Image src="/icons/menu.svg" width={24} height={24} alt="Menu" />
          </button>
        </div>
      </header>

      {/* 主要展示区 */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        {/* 左侧大图 */}
        <div className="col-span-8 relative  overflow-hidden h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <Image
            src={heroImage}
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-8 left-8 z-20">
            <div className="text-sm mb-2">CELEBRITY STYLE</div>
            <h1 className="text-4xl font-bold mb-4">
              Affordable Visual
              <br />
              Library of Professional
              <br />
              Grade Images
            </h1>
            <button className="bg-white text-black px-6 py-2 rounded-full">
              Start now
            </button>
          </div>
        </div>

        {/* 右侧小图 */}
        <div className="col-span-4 space-y-4">
          {sideImages.map((image, index) => (
            <div key={index} className="relative h-[240px] overflow-hidden">
              <Image
                src={image}
                alt={`Sample ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-semibold">
                  Lorem ipsum dolor sit amet consectetur.
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 导航栏 */}
      <div className="flex justify-between items-center mb-8">
        <button className="text-gray-400 hover:text-white transition-colors">
          Following
        </button>
        <div className="flex gap-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${
                  activeNav === item.label
                    ? "bg-zinc-800/80"
                    : "text-gray-400 hover:text-white"
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          Filter
        </button>
      </div>

      {/* 图片网格 */}
      <div className="grid grid-cols-4 gap-4">
        {imageItems.map((item) => {
          const isSelected = selectedImageId === item.id;

          return (
            <div
              key={item.id}
              className="bg-zinc-900/50 rounded-md overflow-hidden" // 卡片整体背景
            >
              {/* 图片部分 */}
              <div
                onClick={() => setSelectedImageId(isSelected ? null : item.id)}
                className="relative cursor-pointer group"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={item.imageUrl}
                    alt={`Photo by ${item.author}`}
                    layout="fill"
                    className="object-cover"
                  />
                  {/* 渐变遮罩 */}
                  <div
                    className={`
                    absolute inset-0 transition-colors duration-200
                    ${
                      isSelected
                        ? "bg-black/40"
                        : "bg-gradient-to-b from-transparent to-black/60 group-hover:bg-black/30"
                    }
                  `}
                  />
                </div>

                {/* 作者名称标签 */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="w-5 h-5 rounded-full bg-gray-500" />
                    <span className="text-sm">Name</span>
                  </div>
                </div>

                {/* 价格标签 */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-sm">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* 描述部分 */}
              <div className="p-4 space-y-2">
                {/* 作者和价格 */}
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium">{item.author}</span>
                  <span className="text-base font-medium">{item.price}</span>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-zinc-800 rounded-md text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Demo2;
