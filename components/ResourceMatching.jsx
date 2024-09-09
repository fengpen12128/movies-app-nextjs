"use client";

import { useState, useEffect } from "react";
import { Button, Table, Checkbox, Select, Card, Tabs } from "@radix-ui/themes";
import { CheckIcon, PlayIcon } from "@radix-ui/react-icons";
import { Pagination } from "@nextui-org/pagination";

export default function ResourceMatching() {
  const [downloadedMovies, setDownloadedMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [unmatchedCurrentPage, setUnmatchedCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const itemsPerPage = 10;
  const [activeTab, setActiveTab] = useState("matched");

  useEffect(() => {
    fetchDownloadedMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [downloadedMovies, filter]);

  const fetchDownloadedMovies = async () => {
    try {
      const response = await fetch("/api/movies/downloaded");
      const data = await response.json();
      setDownloadedMovies(
        data.map((movie) => ({ ...movie, isMatched: false }))
      );
    } catch (error) {
      console.error("Error fetching downloaded movies:", error);
    }
  };

  const filterMovies = () => {
    let filtered = downloadedMovies;
    if (filter === "matched") {
      filtered = downloadedMovies.filter((movie) => movie.isMatched);
    } else if (filter === "unmatched") {
      filtered = downloadedMovies.filter((movie) => !movie.isMatched);
    }
    setFilteredMovies(filtered);
    setCurrentPage(1);
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

  const toggleSelectMovie = (movie) => {
    setSelectedMovies((prevSelected) => {
      const isSelected = prevSelected.some((m) => m.id === movie.id);
      if (isSelected) {
        return prevSelected.filter((m) => m.id !== movie.id);
      } else {
        return [...prevSelected, movie];
      }
    });
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

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const unmatchedMovies = downloadedMovies.filter(movie => !movie.isMatched);
  const paginatedUnmatchedMovies = unmatchedMovies.slice(
    (unmatchedCurrentPage - 1) * itemsPerPage,
    unmatchedCurrentPage * itemsPerPage
  );

  const handlePlay = (filePath) => {
    // 这里添加播放逻辑
    console.log("Playing:", filePath);
  };

  return (
    <div className="w-4/5 mx-auto">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-4">
          <Tabs.Trigger value="matched">已匹配资源</Tabs.Trigger>
          <Tabs.Trigger value="unmatched">未匹配资源</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="matched">
          <Card className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <div className="space-x-2">
                <Button onClick={confirmAllMatches} className="bg-blue-500 text-white">
                  全部确认
                </Button>
                <Button
                  onClick={confirmSelectedMatches}
                  className="bg-green-500 text-white"
                  disabled={selectedMovies.length === 0}
                >
                  确认选中 ({selectedMovies.length})
                </Button>
              </div>
              <Select.Root value={filter} onValueChange={setFilter}>
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="all">全部</Select.Item>
                  <Select.Item value="matched">已确认</Select.Item>
                  <Select.Item value="unmatched">未确认</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>选择</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>电影名称</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>文件名</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>文件路径</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>文件大小</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>状态</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginatedMovies.map((movie) => (
                  <Table.Row key={movie.id}>
                    <Table.Cell>
                      <Checkbox
                        checked={selectedMovies.some((m) => m.id === movie.id)}
                        onCheckedChange={() => toggleSelectMovie(movie)}
                      />
                    </Table.Cell>
                    <Table.Cell>{movie.title}</Table.Cell>
                    <Table.Cell>{movie.fileName}</Table.Cell>
                    <Table.Cell>{movie.filePath}</Table.Cell>
                    <Table.Cell>{movie.size}</Table.Cell>
                    <Table.Cell>
                      {movie.isMatched ? (
                        <span className="text-green-500">已匹配</span>
                      ) : (
                        <span className="text-yellow-500">待确认</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {!movie.isMatched ? (
                        <Button
                          onClick={() => confirmMatch(movie)}
                          className="bg-blue-500 text-white"
                        >
                          确认匹配
                        </Button>
                      ) : (
                        <CheckIcon className="text-green-500" />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            <div className="mt-4 flex justify-center">
              <Pagination
                total={Math.ceil(filteredMovies.length / itemsPerPage)}
                initialPage={1}
                page={currentPage}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="unmatched">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">未匹配的下载数据</h2>
            <Table.Root>
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
                {paginatedUnmatchedMovies.map((movie) => (
                  <Table.Row key={movie.id}>
                    <Table.Cell>{movie.fileName}</Table.Cell>
                    <Table.Cell>{movie.filePath}</Table.Cell>
                    <Table.Cell>{movie.size}</Table.Cell>
                    <Table.Cell>{new Date(movie.downloadDate).toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      <Button
                        onClick={() => handlePlay(movie.filePath)}
                        className="bg-blue-500 text-white"
                      >
                        <PlayIcon /> 播放
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            <div className="mt-4 flex justify-center">
              <Pagination
                total={Math.ceil(unmatchedMovies.length / itemsPerPage)}
                initialPage={1}
                page={unmatchedCurrentPage}
                onChange={(page) => setUnmatchedCurrentPage(page)}
              />
            </div>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
