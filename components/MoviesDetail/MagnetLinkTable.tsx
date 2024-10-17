"use client";

import React from "react";
import { IconButton, Table, Button } from "@radix-ui/themes";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { message } from "react-message-popup";
import { CopyIcon } from "@radix-ui/react-icons";
import { useLocalStorage } from "usehooks-ts";
import dayjs from "dayjs";

interface MagnetLinkTableProps {
  links: MagnetLink[];
}

const MagnetLinkTable: React.FC<MagnetLinkTableProps> = ({ links }) => {
  const [savedLinks, setSavedLinks] = useLocalStorage<string[]>(
    "savedMagnetLinks",
    []
  );

  const showMagLinkName = (link: string) => {
    const dnMatch = link.match(/dn=([^&]*)/);
    return dnMatch ? dnMatch[1] : link.split("&")[0];
  };

  const handleSaveLink = (linkUrl: string) => {
    if (!savedLinks.includes(linkUrl)) {
      setSavedLinks([...savedLinks, linkUrl]);
      message.success("Saved successfully", 1000);
    } else {
      message.info("Already in the list", 1000);
    }
  };

  return (
    <div className="w-full mt-10 bg-base-100 rounded p-2">
      <div className="pb-2 flex justify-between">
        <div className="text-xl ">Magnet Links ({links.length})</div>
      </div>
      <div className="overflow-x-auto mt-2">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row align="center">
              <Table.ColumnHeaderCell justify="center">
                链接名称
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center">
                大小
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center">
                添加时间
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center">
                操作
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body className="overflow-x-auto">
            {links.map((link, index) => (
              <Table.Row key={index}>
                <Table.RowHeaderCell width={"50%"} maxWidth={"250px"}>
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <a
                      className="hover:underline truncate"
                      href={link.linkUrl!}
                      title={showMagLinkName(link.linkUrl!)}
                    >
                      {showMagLinkName(link.linkUrl!)}
                    </a>
                    <CopyToClipboard
                      text={link.linkUrl!}
                      onCopy={() => {
                        message.success("复制成功", 1000);
                      }}
                    >
                      <IconButton
                        size="1"
                        aria-label="Copy value"
                        color="gray"
                        variant="ghost"
                      >
                        <CopyIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </div>
                </Table.RowHeaderCell>
                <Table.Cell
                  width={"25%"}
                  justify="center"
                  className="whitespace-nowrap"
                >
                  {link.size}
                </Table.Cell>
                <Table.Cell
                  width={"25%"}
                  justify="center"
                  className="whitespace-nowrap"
                >
                  {dayjs(link.uploadTime).format("YYYY-MM-DD")}
                </Table.Cell>
                <Table.Cell
                  width={"25%"}
                  justify="center"
                  className="whitespace-nowrap"
                >
                  <Button
                    variant="soft"
                    color="blue"
                    size="1"
                    onClick={() => handleSaveLink(link.linkUrl!)}
                  >
                    Save to List
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default MagnetLinkTable;
