"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MoviesPreviewModalCustom2,
  MoviesPreviewModalCustom1,
} from "./MoviesPreviewModal";
import Detail from "./Detail";

const Page = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <>
      <MoviesPreviewModalCustom1 open={open1} setOpen={setOpen1}>
        {open1 && <Detail />}
      </MoviesPreviewModalCustom1>

      <MoviesPreviewModalCustom2 open={open2} setOpen={setOpen2}>
        {open2 && <Detail />}
      </MoviesPreviewModalCustom2>
      <div className="  text-gray-500 flex flex-col items-center justify-center h-screen">
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
      </div>
    </>
  );
};

export default Page;
