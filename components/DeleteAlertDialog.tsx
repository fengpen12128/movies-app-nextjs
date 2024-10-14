"use client";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { message } from "react-message-popup";
import React, { ReactNode } from "react";

const DeleteAlertDialog: React.FC<{ actressName: string; children: ReactNode }> = ({ actressName, children }) => {
  const handleDeleteFav = async () => {
    const res = await fetch(`/api/movies/actressFav/${actressName}`, {
      method: "DELETE",
    });
    const [success, msg] = await res.json();
    if (success) {
      message.success(msg, 1000);
    } else {
      message.error(msg, 1000);
    }
  };
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>确认删除</AlertDialog.Title>
        <AlertDialog.Description size="2">
          您确定要删除 {actressName} 吗？此操作无法撤销。
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              取消
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={handleDeleteFav}>
              删除
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteAlertDialog;
