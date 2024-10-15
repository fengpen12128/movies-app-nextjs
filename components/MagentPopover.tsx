"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Flex, Text, Popover, Badge } from "@radix-ui/themes";
import { saveAs } from "file-saver";
import copy from "clipboard-copy";
import { useLocalStorage } from "usehooks-ts";

const MagentPopover: React.FC = () => {
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [links, setLinks] = useState<string[]>([]);
  const [savedLinks, setSavedLinks] = useLocalStorage<string[]>(
    "savedMagnetLinks",
    []
  );

  const updateLinks = useCallback(() => {
    setLinks(savedLinks);
  }, [savedLinks]);

  useEffect(() => {
    updateLinks();
  }, [updateLinks]);

  const handleDownload = () => {
    const content = links.join("\n");
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "saved_magnet_links.txt");
  };

  const handleCopy = () => {
    const content = links.join("\n");
    copy(content)
      .then(() => {
        setCopyStatus("已复制");
        setTimeout(() => setCopyStatus(""), 2000);
      })
      .catch((err) => {
        console.error("复制失败:", err);
        setCopyStatus("复制失败");
        setTimeout(() => setCopyStatus(""), 2000);
      });
  };

  const handleClearLinks = () => {
    setLinks([]);
    setSavedLinks([]);
    setCopyStatus("已清空");
    setTimeout(() => setCopyStatus(""), 2000);
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft" color="indigo" onClick={updateLinks}>
          Save Links
          <Badge color="indigo" variant="solid" style={{ marginLeft: "8px" }}>
            {links.length}
          </Badge>
        </Button>
      </Popover.Trigger>
      <Popover.Content
        style={{ width: "300px", maxWidth: "95vw" }}
        sideOffset={5}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          updateLinks();
        }}
      >
        <Flex direction="column" gap="2">
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {links.length > 0 ? (
              links.map((link, index) => (
                <Text
                  key={index}
                  size="1"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    padding: "4px 8px",
                    backgroundColor: "var(--gray-3)",
                    borderRadius: "4px",
                    color: "var(--blue-11)",
                  }}
                >
                  {link}
                </Text>
              ))
            ) : (
              <Text size="2" style={{ textAlign: "center", padding: "10px" }}>
                暂无保存的链接
              </Text>
            )}
          </div>

          <Flex
            gap="2"
            mt="3"
            style={{ borderTop: "1px solid var(--gray-5)", paddingTop: "8px" }}
          >
            <Button
              variant="soft"
              color="blue"
              onClick={handleDownload}
              style={{ flex: 1 }}
              disabled={links.length === 0}
            >
              下载链接
            </Button>
            <Button
              variant="soft"
              color="green"
              onClick={handleCopy}
              style={{ flex: 1 }}
              disabled={links.length === 0}
            >
              复制链接
            </Button>
          </Flex>
          <Button
            variant="soft"
            color="red"
            onClick={handleClearLinks}
            style={{ width: "100%" }}
            disabled={links.length === 0}
          >
            清空链接
          </Button>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default MagentPopover;
