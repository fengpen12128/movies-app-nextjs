"use client";

import { useEffect, useState, useCallback } from "react";
import { Pagination } from "@nextui-org/pagination";

import MoviesCard from "@/components/MoviesCard";
import MoviesDetail from "@/components/MoviesDetail";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card, TextField, Spinner } from "@radix-ui/themes";
import SiderBar from "@/components/SiderBar";
import { getImages } from "@/api/commonApi";
import FilterBar from "@/components/FilterBar";
const CardContent = ({ movies, setSilderOpen, setClickMovie }) => {
  const router = useRouter();
  const pathName = usePathname();

  // 处理点击电影卡片
  const handleClickMoviesCard = useCallback(
    (code) => {
      //router.push(`${pathName}?v=${code}`);
      setSilderOpen(true);
      setClickMovie(code);
    },
    [router, pathName]
  );

  const colClassDia = `grid gap-5 grid-cols-1 sm:grid-cols-4`;

  return (
    <section className={colClassDia}>
      {movies.map((x) => (
        <MoviesCard
          onClick={() => handleClickMoviesCard(x.id)}
          key={x.id}
          coverUrl={x.coverUrl}
          //coverUrl={`http://192.168.1.37:9000/movies/${x.coverUrl}`}
          code={x.code}
          rate={x.rate}
          releaseDate={x.releaseDate}
          viewCount={10}
          collected={x.collected}
          downloaded={x.downloaded}
        ></MoviesCard>
      ))}
    </section>
  );
};

const HomeContent = () => {
  const [movies, setMovies] = useState([]);
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

  const getMovies = useCallback(async () => {
    try {
      setMovies([]);
      const [data, wallpapers] = await Promise.all([
        fetch(`/api/movies`, {
          method: "POST",
          body: JSON.stringify(searchCondition),
        }).then((resp) => resp.json()),
        fetch("/api/common/image").then((resp) => {
          return resp.json();
        }),
      ]);

      // const updatedMovies = data?.movies.map((x, index) => ({
      //   ...x,
      //   coverUrl: `${process.env.NEXT_PUBLIC_TEST_PATH}/${
      //     wallpapers[index % wallpapers.length]
      //   }`,
      // }));
      const updatedMovies = data?.movies.map((x, index) => ({
        ...x,
        coverUrl: `${wallpapers.wallpapers[index % wallpapers.wallpapers.length]}`,
      }));

      //   const updatedMovies = data?.movies.map((x) => ({
      //     ...x,
      //     coverUrl: `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`,
      //   }));

      setMovies(updatedMovies || []);
      setTotal(data.total);
      setTotalCount(data.count);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, [searchCondition]);

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

  useEffect(() => {
    getMovies();
  }, [getMovies]);

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

  const displayCol = `px-8 h-screen pt-6 no-scrollbar overflow-auto ${
    silderOpen ? "w-1/2" : ""
  }`;

  const displayDialog = `px-8 container mx-auto h-screen pt-6 no-scrollbar overflow-auto`;

  const handleCloseSilder = useCallback(() => {
    setSilderOpen(false);
  }, []);

  return (
    <>
      <SiderBar handleSiderClick={handleSiderClick} />

      <div className={displayDialog}>
        <Card className="my-10" size="4">
          <div className="flex items-center justify-center">
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

          {/* <FilterBar /> */}
        </Card>

        {!movies.length && (
          <div className="flex items-center justify-center h-full w-full">
            <Spinner size="3" />
          </div>
        )}

        <CardContent
          setSilderOpen={setSilderOpen}
          open={silderOpen}
          movies={movies}
          setClickMovie={setClickMovie}
        />

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
      <div
        onClick={(e) => {
          handleCloseSilder();
        }}
        className="no-scrollbar fixed inset-0 bg-black bg-opacity-60 h-screen w-screen flex items-center justify-center z-50"
        style={{ display: silderOpen ? "flex" : "none" }}
      >
        <Card
          className="w-full sm:w-1/2 h-[80vh] sm:h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full overflow-y-auto no-scrollbar">
            {silderOpen && <MoviesDetail code={clickMovie} />}
          </div>
        </Card>
      </div>
    </>
  );
};

export default HomeContent;
