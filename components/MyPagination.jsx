"use client";

import React from "react";
import { Pagination } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";

const MyPagination = ({ current, totalPage, totleCount }) => {
  const router = useRouter();
  const pathname = usePathname();
  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page);
    router.push(`${pathname}?${searchParams.toString()}`);

  };

  return (
    <div className="mt-8 mb-10 flex justify-between items-center">
      <div className="self-start">
        <span>共{totleCount}条</span>
      </div>
      <div className="flex-grow  flex justify-center">
        <Pagination
          onChange={handlePageChange}
          page={current}
          total={totalPage}
          initialPage={1}
        />
      </div>
    </div>
  );
};

export default MyPagination;