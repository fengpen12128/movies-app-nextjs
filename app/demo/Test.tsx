"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MoviesPreviewModalCustom2,
  MoviesPreviewModalCustom1,
  MoviesPreviewModalCustom3,
} from "./MoviesPreviewModal";

const Page = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  return (
    <>
      <MoviesPreviewModalCustom3 open={open3} setOpen={setOpen3}>
        {open3 && (
          <>
            <div className="w-[400px] h-[400px] ">this is a test demo</div>
          </>
        )}
      </MoviesPreviewModalCustom3>
      <div className=" bg-gray-100  text-gray-100 flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-ibmPlexMono font-bold">
          This is a demo page
        </h1>
        <h1 className="text-3xl  font-zenMaruGothic font-bold">
          这是一个测试页面
        </h1>

        <Button onClick={() => setOpen1(true)} variant="outline">
          样式一
        </Button>
        <br />
        <Button onClick={() => setOpen2(true)} variant="outline">
          样式二
        </Button>
        <br />
        <Button onClick={() => setOpen3(true)} variant="outline">
          样式三
        </Button>
      </div>
    </>
  );
};

export default Page;
