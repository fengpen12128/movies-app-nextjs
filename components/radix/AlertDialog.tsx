import React from "react";
import {
  AlertDialog as RadixAlertDialog,
  Button as RadixButton,
} from "@radix-ui/themes";

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  actionText: string;
  onOpenChange: (open: boolean) => void;
  confirmAction: () => void;
}

const AlertDialogCommon: React.FC<AlertDialogProps> = ({
  isOpen,
  onOpenChange,
  confirmAction,
  title,
  description,
  actionText,
}) => {
  return (
    <RadixAlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <RadixAlertDialog.Content>
        <RadixAlertDialog.Title>{title}</RadixAlertDialog.Title>
        <RadixAlertDialog.Description>
          {description}
        </RadixAlertDialog.Description>
        <div className="flex justify-end gap-3 mt-4">
          <RadixAlertDialog.Cancel>
            <RadixButton variant="soft" color="gray">
              Cancel
            </RadixButton>
          </RadixAlertDialog.Cancel>
          <RadixAlertDialog.Action>
            <RadixButton variant="solid" color="red" onClick={confirmAction}>
              {actionText}
            </RadixButton>
          </RadixAlertDialog.Action>
        </div>
      </RadixAlertDialog.Content>
    </RadixAlertDialog.Root>
  );
};

export default AlertDialogCommon;
