"use client";

import { Pagination, Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import usePageStore from "@/store/commonStore";

const MyPagination = ({ current, totalPage }) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(current));
  const [gotoPage, setGotoPage] = useState("");
  const setPagination = usePageStore((state) => state.setPagination);
  setPagination({ current, totalPage });

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page);
    setCurrentPage(page);
    replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleGotoPageKeyDown = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(gotoPage, 10);
      if (page >= 1 && page <= totalPage) {
        handlePageChange(page);
        setGotoPage("");
      }
    }
  };

  if (totalPage <= 1) {
    return null;
  }

  return (
    <div className="my-10 flex justify-center items-center">
      {/* <div className="self-start">
        <span>共{totalCount || 0}条</span>
      </div> */}
      <Pagination
        onChange={handlePageChange}
        page={currentPage}
        total={totalPage}
        initialPage={1}
      />
      <Input
        className="ml-8 w-20"
        placeholder="GOTO"
        type="text"
        value={gotoPage}
        onChange={(e) => setGotoPage(e.target.value)}
        onKeyDown={handleGotoPageKeyDown}
      />
    </div>
  );
};

export default MyPagination;
