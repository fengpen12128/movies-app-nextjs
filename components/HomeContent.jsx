"use client";

import { useEffect, useState, useCallback } from "react";
import { Pagination } from "@nextui-org/pagination";

import MoviesCard from "@/components/MoviesCard";
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
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import SiderBar from "@/components/SiderBar";

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
      {movies.map((x, index) => (
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
        // fetch("/api/common/image").then((resp) => {
        //   return resp.json();
        // }),
      ]);

      // const updatedMovies = data?.movies.map((x, index) => ({
      //   ...x,
      //   coverUrl: `${process.env.NEXT_PUBLIC_TEST_PATH}/${
      //     wallpapers[index % wallpapers.length]
      //   }`,
      // }));
      //   const updatedMovies = data?.movies.map((x, index) => ({
      //     ...x,
      //     coverUrl: `${
      //       wallpapers.wallpapers[index % wallpapers.wallpapers.length]
      //     }`,
      //   }));

      const updatedMovies = data?.movies.map((x) => ({
        ...x,
        coverUrl: `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`,
      }));

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

  const [filterOptions, setFilterOptions] = useState([]);

  const getFilterOptions = async () => {
    const resp = await fetch("/api/tags/list");
    console.log("resp", resp);
    const filters = await resp.json();
    setFilterOptions(filters);
  };

  useEffect(() => {
    getFilterOptions();
  }, []);

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
      }
      if (title === "我的收藏") {
        router.push("/collection");
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

  const handleCloseSilder = useCallback(() => {
    setSilderOpen(false);
  }, []);

  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  const toggleFilterOptions = (title, tag) => {
    setSelectedTags((prev) =>
      prev[title].includes(tag)
        ? prev[title].filter((t) => t !== tag)
        : prev[title].push(tag)
    );
  };

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

            <div className=" self-end">
              <Button
                variant="surface"
                size="sm"
                color="indigo"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {showFilters}
                {showFilters ? <ChevronDownIcon /> : <ChevronUpIcon />}
              </Button>
            </div>
          </div>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: showFilters ? "1000px" : "0px" }}
          >
            <div className="space-y-6 pt-9">
              {filterOptions.map((x) => (
                <div key={x.title} className=" space-y-2  ">
                  <label className="font-suse font-medium text-gray-300 ">
                    {x.title}
                  </label>
                  <div key={x.title} className="flex flex-wrap gap-2">
                    {x.options.map((tag) => (
                      <>
                        {selectedTags.includes(tag) ? (
                          <Button
                            key={tag}
                            color="cyan"
                            onClick={() => toggleFilterOptions(tag)}
                            variant="outline"
                            size="sm"
                          >
                            {tag}
                          </Button>
                        ) : (
                          <Button
                            key={tag}
                            onClick={() => toggleFilterOptions(tag)}
                            variant="outline"
                            size="sm"
                          >
                            {tag}
                          </Button>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              ))}
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

      {/* movies detail 展示 */}
      <MovieDetailView
        open={silderOpen}
        setOpen={setSilderOpen}
        clickedMovie={clickMovie}
      />
    </>
  );
};

export default HomeContent;
