import { IconButton, Table } from "@radix-ui/themes";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { message } from "react-message-popup";
import { CopyIcon } from "@radix-ui/react-icons";

import { showMagLinkName } from "@/utils/commonUtils.js";

export default function MagnetLinkTable({ links = [] }) {
  return (
    <div className="w-full mt-10 bg-base-100 rounded p-2">
      <div className="pb-2 flex justify-between">
        <div className="text-xl font-ma">磁力链接({links.length})</div>
      </div>
      <div className="overflow-x-auto mt-2">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row align="center">
              <Table.ColumnHeaderCell>链接名称</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>大小</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>添加时间</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body className="overflow-x-auto">
            {links.map((link, index) => (
              <Table.Row key={index}>
                <Table.RowHeaderCell>
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <a
                      className="hover:underline truncate"
                      href={link.linkUrl}
                      title={showMagLinkName(link.linkUrl)}
                    >
                      {showMagLinkName(link.linkUrl)}
                    </a>
                    <CopyToClipboard
                      text={link.linkUrl}
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
                <Table.Cell className="whitespace-nowrap">
                  {link.size}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  {link.uploadTime}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
}
