"use client";

import { Pagination, Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import usePageStore from "@/store/commonStore";

const MyPagination = ({ current, totalPage, totalCount }: PaginationData) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(Number(current));
  const [gotoPage, setGotoPage] = useState<string>("");
  const setPagination = usePageStore((state) => state.setPagination);

  useEffect(() => {
    setPagination({ current, totalPage, totalCount, pageSize: 10 });
  }, [current, totalPage, totalCount, setPagination]);

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    setCurrentPage(page);
    push(`${pathname}?${newSearchParams.toString()}` as any);
  };

  const handleGotoPageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
