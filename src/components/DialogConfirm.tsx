import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, ShieldQuestionMark } from 'lucide-react';

interface Props {
  openDialog: boolean;
  onOpenChangeDialog: () => void;
  handleConfirm: () => void;
  loading: boolean;
  dialogTitle: string;
  variant: "warning" | "danger";
  message: string;
  confirmLabel: string
}

const DialogConfirm = ({
  openDialog, 
  onOpenChangeDialog, 
  handleConfirm, 
  loading, 
  dialogTitle, 
  variant, 
  confirmLabel,
  message
}: Props) => {
  const bgColor = {
    warning: "bg-warning-500",
    danger: "bg-error-500"
  }
  const darkBgColor = {
    warning: "bg-warning-700",
    danger: "bg-error-700"
  }
  const btnVariant = {
    warning: "default",
    danger: "destructive"
  }

  return (
    <Dialog open={openDialog} onOpenChange={onOpenChangeDialog}>
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center">
            <div
              className={`rounded-full text-white p-4 flex items-center justify-center ${bgColor[variant]} dark:${darkBgColor[variant]}`}
            >
             {variant === "warning" && (
                <ShieldQuestionMark
                  height={28}
                  width={28}
                  className="text-gray-800 dark:text-gray-200" // Adjusting the color for dark mode
                />
              )}
              {variant === "danger" && (
                <Info
                  height={28}
                  width={28}
                  className="text-gray-800 dark:text-gray-200" // Adjusting the color for dark mode
                />
              )}

            </div>
          </div>
          <div className="text-gray-900 dark:text-white">{message}</div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onOpenChangeDialog}>
            Cancel
          </Button>
          <Button
            variant={btnVariant[variant] as "default" | "destructive" | "link" | "outline" | "secondary" | "ghost" | "brand"}
            onClick={handleConfirm}
            disabled={loading}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogConfirm;
