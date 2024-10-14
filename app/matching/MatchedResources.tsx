"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Table, Select, Card, Spinner } from "@radix-ui/themes";
import { CheckIcon } from "@radix-ui/react-icons";
import { message } from "react-message-popup";
import { filesize } from "filesize";
import { nanoid } from "nanoid";
import { getResourceList, saveResourceList } from "@/app/actions/resource";
import dayjs from "dayjs";

export default function MatchedResources() {
  const [filter, setFilter] = useState<string>("unPaired");
  const [confirmAllLoading, setConfirmAllLoading] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<MovieResource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMatchResult = useCallback(async () => {
    setLoading(true);
    try {
      const { data, code, msg } = await getResourceList("is");
      if (code !== 200) {
        message.error(msg!);
        return;
      }
      setMatchResult(data!);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatchResult();
  }, [fetchMatchResult]);

  const pairMovies = useMemo(() => {
    if (!matchResult) return [];
    switch (filter) {
      case "paired":
        return matchResult.filter((movie) => movie.isMatched);
      case "unPaired":
        return matchResult.filter((movie) => !movie.isMatched);
      default:
        return matchResult;
    }
  }, [matchResult, filter]);

  const handleConfirmMatch = useCallback(async (movies: MovieResource | MovieResource[]) => {
    setConfirmAllLoading(true);
    try {
      const movieList = Array.isArray(movies) ? movies : [movies];
      const { code, msg } = await saveResourceList(movieList);
      if (code !== 200) {
        message.error(msg!);
        return;
      }
      message.success(msg!);
      fetchMatchResult();
    } catch (error) {
      message.error("保存失败");
    } finally {
      setConfirmAllLoading(false);
    }
  }, [fetchMatchResult]);

  return (
    <Card className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <div className="w-32">
          {filter === "unPaired" && (
            <Button
              color="crimson"
              variant="soft"
              onClick={() => handleConfirmMatch(pairMovies.filter((movie) => !movie.isMatched))}
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

      <Table.Root className="h-[600px] overflow-y-auto">
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
              <Table.Row key={nanoid()}>
                <Table.Cell>{movie.matchCode}</Table.Cell>
                <Table.Cell>{movie.path}</Table.Cell>
                <Table.Cell>
                  {movie.size ? filesize(movie.size) : ""}
                </Table.Cell>
                <Table.Cell>
                  {dayjs(movie.createdTime).format("YYYY-MM-DD HH:mm:ss")}
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
                      onClick={() => handleConfirmMatch(movie)}
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
