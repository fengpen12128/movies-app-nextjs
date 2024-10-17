"use client";

import React, { useState } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import { TrainIcon } from "lucide-react";
import AlertDialogCommon from "@/components/radix/AlertDialog";
import { transformSourceData } from "@/app/actions/admin/script/sourceDataTran";
import { message } from "react-message-popup";
const TransformSourceDataButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleTransform = async () => {
    setIsLoading(true);
    try {
      await transformSourceData({ isFullData: true }); // 调用transformSourceData
    } catch (error) {
      console.error("Error transforming source data:", error);
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <>
      <Button
        color="primary"
        startContent={<TrainIcon size={28} />}
        onPress={onOpen}
        isLoading={isLoading}
        variant="solid"
        className="bg-slate-900 text-white"
      >
        Transform Source Data
      </Button>

      <AlertDialogCommon
        isOpen={isOpen}
        onOpenChange={onClose}
        confirmAction={handleTransform}
        title="Confirm Action"
        description="Are you sure you want to transform the source data? This action cannot be undone."
        actionText="Confirm"
      />
    </>
  );
};

const ScriptListBox: React.FC = () => {
  return (
    <div>
      <TransformSourceDataButton />
    </div>
  );
};

export default ScriptListBox;
