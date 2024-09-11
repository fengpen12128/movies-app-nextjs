"use client";

import { useEffect, useState, useCallback } from "react";
import { Pagination } from "@nextui-org/pagination";
import MovieDetailView from "@/components/MovieDetailView";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Card,
  TextField,
  Spinner,
  Button,
  Select,
  Flex,
} from "@radix-ui/themes";

import SiderBar from "@/components/SiderBar";
import CollectionCardSection from "./CollectionCardSection.jsx";

const Collections = () => {
  const [total, setTotal] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [silderOpen, setSilderOpen] = useState(false);
  const [clickMovie, setClickMovie] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { v, actress, prefix } = Object.fromEntries(searchParams.entries());

  const [searchCondition, setSearchCondition] = useState({
    keyword: "",
    page: 1,
    query: {
      collected: 0,
      downloaded: 0,
      actressName: "",
      prefix: "",
    },
  });

  const resetSearchCondition = useCallback(() => {
    setSearchKeyword("");
    setSearchCondition({
      keyword: "",
      page: 1,
      query: {
        collected: 0,
        downloaded: 0,
        actressName: "",
        prefix: "",
      },
    });
  }, []);

  useEffect(() => {
    if (v) {
      setSilderOpen(true);
      setClickMovie(v);
    }
    setSearchCondition((prev) => ({
      ...prev,
      page: currentPage,
      keyword: searchKeyword,
      query: {
        ...prev.query,
        actressName: actress || "",
        prefix: prefix || "",
      },
    }));
  }, [v, actress, prefix, currentPage, searchKeyword]);

  const handleSearch = useCallback(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleSiderClick = useCallback(
    (title) => {
      if (title === "资源匹配") {
        router.push("/matching");
        return;
      }
      resetSearchCondition();

      setSearchCondition((prev) => ({
        ...prev,
        query: {
          ...prev.query,
          collected: title === "我的收藏" ? 1 : 0,
          downloaded: title === "已下载" ? 1 : 0,
        },
      }));
    },
    [resetSearchCondition]
  );

  const displayDialog = `px-8 container mx-auto h-screen pt-6 no-scrollbar overflow-auto`;

  return (
    <>
      <SiderBar handleSiderClick={handleSiderClick} />

      <div className={displayDialog}>
        <Card className="mt-10 mb-5" size="4">
          {/* search input */}
          <div className="flex items-center justify-center">
            <div className="flex-grow  flex justify-center">
              <TextField.Root
                size="3"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-2/3"
                radius="medium"
                placeholder="Search the code..."
              >
                {/* <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot> */}
              </TextField.Root>
            </div>
          </div>
        </Card>

        <Card className="mb-5">
          <Flex gap="3" align="center">
            <label>Downloads</label>
            <Select.Root size="2" defaultValue="1">
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="1">全部</Select.Item>
                <Select.Item value="2">已下载</Select.Item>
                <Select.Item value="3">未下载</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        <CollectionCardSection />

        <div className="mt-8 mb-10 flex justify-between items-center">
          <div className="self-start">
            <span>共{totalCount}条</span>
          </div>
          <div className="flex-grow  flex justify-center">
            <Pagination
              page={currentPage}
              onChange={(page) => {
                setMovies([]);
                setCurrentPage(page);
              }}
              total={total}
              initialPage={1}
            />
          </div>
        </div>
      </div>

      <MovieDetailView
        open={silderOpen}
        setOpen={setSilderOpen}
        clickedMovie={clickMovie}
      />
    </>
  );
};

export default Collections;
