import React from 'react'
import { AlertDialog as RadixAlertDialog, Button as RadixButton } from "@radix-ui/themes";

interface AlertDialogProps {
  showStopDialog: boolean;
  title: string;
  description: string;
  actionText: string;
  setShowStopDialog: (show: boolean) => void;
  confirmStopCrawling: () => void;

}

const AlertDialogCommon: React.FC<AlertDialogProps> = ({
  showStopDialog,
  setShowStopDialog,
  confirmStopCrawling,
  title,
  description,
  actionText
}) => {
  return (
    <RadixAlertDialog.Root open={showStopDialog} onOpenChange={setShowStopDialog}>
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
            <RadixButton
              variant="solid"
              color="red"
              onClick={confirmStopCrawling}
            >
              {actionText}
            </RadixButton>
          </RadixAlertDialog.Action>
        </div>
      </RadixAlertDialog.Content>
    </RadixAlertDialog.Root>
  )
}

export default AlertDialogCommon
