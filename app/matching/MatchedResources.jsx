"use client";

import { useState, useEffect } from "react";
import { Button, Table, Select, Card, Spinner } from "@radix-ui/themes";
import { CheckIcon } from "@radix-ui/react-icons";
import { useRequest } from "ahooks";
import { message } from "react-message-popup";
import { filesize } from "filesize";

export default function MatchedResources() {
  const [filter, setFilter] = useState("unPaired");
  const [pairMovies, setPairMovies] = useState([]);
  const [confirmAllLoading, setConfirmAllLoading] = useState(false);

  const {
    data: matchResult,
    loading,
    error,
    run: fetchMatchResult,
  } = useRequest(
    async () => {
      const response = await fetch("/api/movies/match/list");
      return await response.json();
    },
    {
      onSuccess: (result, params) => {
        let allPairMovies =
          result
            ?.filter((movie) => movie.isPair)
            .filter((movie) => !movie.isMatched) || [];
        setPairMovies(allPairMovies);
      },
    }
  );

  let allpairMovies = matchResult?.filter((movie) => movie.isPair) || [];

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
  };

  const submitConfirmMatch = async (movie) => {
    const resp = await fetch("/api/movies/match/save", {
      method: "POST",
      body: JSON.stringify({
        matchList: [movie],
      }),
    });

    if (resp.ok) {
      message.success("提交成功");
      fetchMatchResult();
    } else {
      message.error("提交失败");
    }
  };

  const confirmAllMatches = async () => {
    setConfirmAllLoading(true);
    const unMatch = allpairMovies.filter((movie) => !movie.isMatched);
    const resp = await fetch("/api/movies/match/save", {
      method: "POST",
      body: JSON.stringify({
        matchList: unMatch,
      }),
    });

    if (resp.ok) {
      message.success("提交成功");
      fetchMatchResult();
    } else {
      message.error("提交失败");
    }
    setConfirmAllLoading(false);
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <div className="w-32">
          {" "}
          {/* Fixed width container for the button */}
          {filter === "unPaired" && (
            <Button
              color="crimson"
              variant="soft"
              onClick={confirmAllMatches}
              disabled={pairMovies.length === 0 || confirmAllLoading}
            >
              {confirmAllLoading && <Spinner size="1" />} 全部确认
            </Button>
          )}
        </div>
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
            <Table.ColumnHeaderCell>文件路径</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>文件大小</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>下载时间</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>状态</Table.ColumnHeaderCell>
            {filter !== "paired" && (
              <Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center py-4">
                <div className="flex items-center justify-center h-full w-full">
                  <Spinner size="3" />
                </div>
              </Table.Cell>
            </Table.Row>
          ) : pairMovies.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center py-4">
                暂无数据
              </Table.Cell>
            </Table.Row>
          ) : (
            pairMovies.map((movie) => (
              <Table.Row key={movie.id}>
                <Table.Cell>{movie.matchCode}</Table.Cell>
                <Table.Cell>{movie.path}</Table.Cell>
                <Table.Cell>
                  {movie.size ? filesize(movie.size) : ""}
                </Table.Cell>
                <Table.Cell>{movie.createdTime}</Table.Cell>
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
                      onClick={() => submitConfirmMatch(movie)}
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
  );
}
