"use client";

import { useState, useEffect } from "react";
import { Button, Table, Checkbox, Select, Card, Tabs } from "@radix-ui/themes";
import { CheckIcon, PlayIcon } from "@radix-ui/react-icons";
import { Pagination } from "@nextui-org/pagination";
import { useRequest } from "ahooks";
import { message } from "react-message-popup";
import { Spinner } from "@radix-ui/themes";
import { filesize } from "filesize";

export default function ResourceMatching() {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [unmatchedCurrentPage, setUnmatchedCurrentPage] = useState(1);
  const [filter, setFilter] = useState("unPaired");
  const itemsPerPage = 10;
  const [activeTab, setActiveTab] = useState("matched");

  const [pairMovies, setPairMovies] = useState([]);

  const {
    data: matchResult,
    loading,
    error,
  } = useRequest(
    async () => {
      const response = await fetch("/api/movies/match");
      return await response.json();
    },
    {
      onSuccess: (result, params) => {
        let allpairMovies = result?.filter((movie) => !movie.isPair) || [];
        setPairMovies(allpairMovies);
      },
    }
  );

  let allpairMovies = matchResult?.filter((movie) => movie.isPair) || [];
  const unPairMovies = matchResult?.filter((movie) => !movie.isPair) || [];

  useEffect(() => filterMovies(), [filter]);

  const filterMovies = () => {
    if (filter === "paired") {
      let t = allpairMovies.filter((movie) => movie.isMatched);
      setPairMovies(t);
    } else if (filter === "unPaired") {
      let t = allpairMovies.filter((movie) => !movie.isMatched);
      setPairMovies(t);
    } else {
      setPairMovies(allpairMovies);
    }
    // setFilteredMovies(filtered);
    // setCurrentPage(1);
  };

  const confirmMatch = (movie) => {
    setDownloadedMovies((prevMovies) =>
      prevMovies.map((m) => (m.id === movie.id ? { ...m, isMatched: true } : m))
    );
  };

  const confirmAllMatches = () => {
    setDownloadedMovies((prevMovies) =>
      prevMovies.map((movie) => ({ ...movie, isMatched: true }))
    );
  };

  const confirmSelectedMatches = () => {
    setDownloadedMovies((prevMovies) =>
      prevMovies.map((movie) =>
        selectedMovies.some((m) => m.id === movie.id)
          ? { ...movie, isMatched: true }
          : movie
      )
    );
    setSelectedMovies([]);
  };

  const handlePlay = (filePath) => {
    if (!filePath) {
      message.error("视频路径不存在");
      return;
    }

    const path = `${process.env.NEXT_PUBLIC_VIDEO_SERVER_PATH}${filePath}`;
    window.open(path, "_blank");
  };

  return (
    <div>
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-4">
          <Tabs.Trigger value="matched">已匹配资源</Tabs.Trigger>
          <Tabs.Trigger value="unmatched">未匹配资源</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="matched">
          <Card className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <Button
                color="crimson"
                variant="soft"
                onClick={confirmAllMatches}
              >
                全部确认
              </Button>
              <Select.Root value={filter} onValueChange={setFilter}>
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="all">全部</Select.Item>
                  <Select.Item value="paired">已确认</Select.Item>
                  <Select.Item value="unPaired">未确认</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <Table.Root className="h-[600px]  overflow-y-auto">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>电影名称</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>文件名</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>文件路径</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>文件大小</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>状态</Table.ColumnHeaderCell>
                  {filter !== "paired" && (
                    <Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {!pairMovies || pairMovies.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-4">
                      <div className="flex items-center justify-center h-full w-full">
                        <Spinner size="3" />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  pairMovies.map((movie) => (
                    <Table.Row key={movie.id}>
                      <Table.Cell>{movie.matchCode}</Table.Cell>
                      <Table.Cell>{movie.name}</Table.Cell>
                      <Table.Cell>{movie.path}</Table.Cell>
                      <Table.Cell>
                        {movie.size ? filesize(movie.size) : ""}
                      </Table.Cell>
                      <Table.Cell>
                        {movie.isMatched ? (
                          <span className="text-green-500">已匹配</span>
                        ) : (
                          <span className="text-yellow-500">未匹配</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {!movie.isMatched ? (
                          <Button
                            color="cyan"
                            variant="soft"
                            onClick={() => confirmMatch(movie)}
                          >
                            确认匹配
                          </Button>
                        ) : (
                          filter !== "paired" && (
                            <CheckIcon className="text-green-500" />
                          )
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="unmatched">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">未匹配的下载数据</h2>
            <Table.Root className="h-[600px]  overflow-y-auto">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>文件名</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>文件路径</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>大小</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>下载时间</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {unPairMovies?.map((movie) => (
                  <Table.Row key={movie.id}>
                    <Table.Cell>{movie.name}</Table.Cell>
                    <Table.Cell>{movie.path}</Table.Cell>
                    <Table.Cell>
                      {movie.size ? filesize(movie.size) : ""}
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell>
                      <Button
                        color="indigo"
                        variant="soft"
                        onClick={() => handlePlay(movie.path)}
                      >
                        <PlayIcon /> 播放
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
