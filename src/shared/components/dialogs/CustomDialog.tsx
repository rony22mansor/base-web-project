"use client";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import Spinner from "../ui/spinner";

export type DialogSize =
  | "sm:max-w-md"
  | "sm:max-w-lg"
  | "sm:max-w-xl"
  | "sm:max-w-2xl"
  | "sm:max-w-3xl"
  | "sm:max-w-4xl"
  | "sm:max-w-5xl"
  | "sm:max-w-6xl"
  | "sm:max-w-7xl"
  | "sm:max-w-5xl"
  | "sm:max-w-6xl"
  | "sm:max-w-7xl"
  | "sm:max-w-8xl"
  | "sm:max-w-9xl";

interface CustomDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  isTitle?: boolean;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  hideActions?: boolean;
  hideConfirm?: boolean;
  disabledBtn?: boolean;
  size?: DialogSize;
  onOpenChange?: (open: boolean) => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  setOpen,
  title,
  isTitle = true,
  children,
  confirmText,
  cancelText,
  loading = false,
  onConfirm,
  onCancel,
  disabledBtn,
  size = "sm:max-w-md",
  hideActions = false,
  hideConfirm = false,
  onOpenChange,
}) => {
  const t = useTranslations("general");

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`${size}  overflow-auto max-h-[80%]`}>
        {isTitle && (
          <AlertDialogHeader>
            {isTitle && <AlertDialogTitle>{title ?? t("titleconfirm")}</AlertDialogTitle>}
          </AlertDialogHeader>
        )}

        <div className="text-start space-y-2">{children}</div>

        {!hideActions && (
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={loading}>
              {cancelText ?? t("cancel")}
            </AlertDialogCancel>
            {!hideConfirm && (
              <AlertDialogAction
                className="bg-primary hover:text-white"
                onClick={handleConfirm}
                disabled={loading || disabledBtn}
              >
                {loading ? <Spinner /> : (confirmText ?? t("confirm"))}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomDialog;
