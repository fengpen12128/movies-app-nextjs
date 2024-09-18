"use client";
import { Pagination } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
const MyPagination = ({ current, totalPage, totalCount }) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(current);

  useEffect(() => {
    setCurrentPage(current);
  }, [current]);

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page);
    replace(`${pathname}?${newSearchParams.toString()}`);
  };

  if (totalPage <= 1) {
    return null;
  }

  return (
    <div className="mt-8 mb-10 flex justify-between items-center">
      <div className="self-start">
        <span>共{totalCount || 0}条</span>
      </div>
      <div className="flex-grow flex justify-center">
        <Pagination
          onChange={handlePageChange}
          page={currentPage}
          total={totalPage}
          initialPage={1}
        />
      </div>
    </div>
  );
};

export default MyPagination;
