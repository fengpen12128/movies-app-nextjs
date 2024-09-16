"use client";

import { useState, useEffect } from "react";
import { Button, Table, Card, Spinner } from "@radix-ui/themes";
import { PlayIcon } from "@radix-ui/react-icons";
import { useRequest } from "ahooks";
import { message } from "react-message-popup";
import { filesize } from "filesize";

export default function UnmatchedResources() {
  const {
    data: unPairMovies,
    loading,
    error,
    run: fetchUnmatchedMovies,
  } = useRequest(
    async () => {
      const response = await fetch("/api/movies/match/list");
      const data = await response.json();
      return data?.filter((movie) => !movie.isPair) || [];
    },
    {
      manual: false,
    }
  );

  const handlePlay = (filePath) => {
    if (!filePath) {
      message.error("视频路径不存在");
      return;
    }

    const path = `${process.env.NEXT_PUBLIC_VIDEO_SERVER_PATH}${filePath}`;
    window.open(path, "_blank");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">未匹配的下载数据</h2>
      <Table.Root className="h-[600px] overflow-y-auto">
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
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center py-4">
                <div className="flex items-center justify-center h-full w-full">
                  <Spinner size="3" />
                </div>
              </Table.Cell>
            </Table.Row>
          ) : unPairMovies?.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center py-4">
                暂无数据
              </Table.Cell>
            </Table.Row>
          ) : (
            unPairMovies?.map((movie) => (
              <Table.Row key={movie.id}>
                <Table.Cell>{movie.name}</Table.Cell>
                <Table.Cell>{movie.path}</Table.Cell>
                <Table.Cell>
                  {movie.size ? filesize(movie.size) : ""}
                </Table.Cell>
                <Table.Cell>{movie.createdTime}</Table.Cell>
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
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
