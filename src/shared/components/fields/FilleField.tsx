"use client";
import { cn } from "@/src/core/utils/utils";
import { LucideIcon, Upload } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useValidationMessage } from "@/src/core/i18n/validationMessages";
import React, { useRef, useState } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IconType } from "react-icons/lib";
import { toast } from "react-toastify";
import { useIsActive } from "../../hooks/useIsActive";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FilleFieldProps<T extends Record<string, any>> {
  register?: UseFormRegister<T>;
  label?: string;
  name: Path<T>;
  placeholder?: string;
  classNameWrapper?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  defaultValue?: string;
  readOnly?: boolean;
  inputRefExternal?: React.RefObject<HTMLInputElement>;
  hideTrigger?: boolean; // hides the visible field, input still exists
  onchangeFile?: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof T,
  ) => void;
  fileName?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  icon?: LucideIcon | IconType;
  labelExtraClassName?: string;
  classNameInputExtra?: string;
  hidden?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FilleField = <T extends Record<string, any>>({
  name,
  disabled,
  autoFocus,
  error,
  readOnly,
  register,
  onchangeFile,
  placeholder,
  fileName,
  accept,
  multiple,
  labelExtraClassName,
  classNameInputExtra,
  classNameWrapper,
  label,
  maxSizeMB = 5,
  hidden,
}: FilleFieldProps<T>) => {
  const locale = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUploaded, setIsUploaded] = useState(false);
  const t = useTranslations("validationErrors");
  const tError = useValidationMessage();
  const isRTL = locale === "ar";
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isActive } = useIsActive(fileName);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    const isValid = validateFile(files);

    if (!isValid) return;

    if (files && files.length > 0) {
      setIsUploaded(true);
    } else {
      setIsUploaded(false);
    }

    if (onchangeFile) {
      onchangeFile(e, name);
    }
  };

  const validateFile = (files: FileList | null) => {
    if (!files || files.length === 0) return true;

    for (const file of Array.from(files)) {
      if (file.size === 0) {
        toast.error(t("file_is_empty"));
        return false;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(t("file_too_large", { size: maxSizeMB }));
        return false;
      }

      if (accept) {
        const allowedTypes = accept.split(",").map((t) => t.trim());
        const isValidType = allowedTypes.some((type) => {
          if (type.startsWith(".")) return file.name.endsWith(type);
          return file.type === type;
        });

        if (!isValidType) {
          toast.error(t("invalid_file_type"));
          return false;
        }
      }
    }

    return true;
  };

  const mergeRefs =
    (...refs: Array<React.Ref<HTMLInputElement>>) =>
    (el: HTMLInputElement | null) => {
      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") {
          ref(el);
        } else {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
        }
      });
    };

  const labelAsInputStyle = `${
    error?.message ? "border-destructive" : ""
  }  h-11 !ps-13  flex w-full min-w-0 rounded-lg border  `;

  return (
    <div className={cn("w-full mb-2 relative", classNameWrapper)}>
      {!hidden && (
        <>
          {label && (
            <Label
              className={cn(
                `mb-3 ${labelExtraClassName} transition-colors`,
                isActive ? "text-white" : "text-muted",
              )}
            >
              {label}
            </Label>
          )}

          <div
            onClick={() => inputRef.current?.click()}
            className={cn(
              "cursor-pointer items-center",
              disabled ? "text-placeHolder opacity-50" : "text-muted",
              labelAsInputStyle,
            )}
          >
            <span className={cn(`text-sm `)}>{fileName || placeholder}</span>

            {fileName ? (
              <IoIosCheckmarkCircleOutline
                className={cn(
                  "absolute text-white h-5 w-5 mb-1",
                  isRTL ? "right-3" : "left-3",
                )}
              />
            ) : (
              <Upload
                className={cn(
                  "absolute text-muted h-4 w-4 mb-1",
                  isRTL ? "right-3" : "left-3",
                )}
              />
            )}

            <span
              className={`absolute ${
                isRTL ? "right-10" : "left-10"
              } bg-muted h-5 w-0.5`}
            ></span>
          </div>
        </>
      )}
      {register ? (
        (() => {
          const { ref: rhfRef, ...rest } = register(name as Path<T>, {
            onChange: handleFileChange,
          });

          return (
            <Input
              size={0}
              height={0}
              hidden={hidden}
              ref={inputRef ? mergeRefs(inputRef, rhfRef) : null}
              className={cn(
                "hidden",
                classNameInputExtra,
                error?.message ? "border-destructive" : "",
              )}
              disabled={disabled}
              autoFocus={autoFocus}
              readOnly={readOnly}
              accept={accept}
              multiple={multiple}
              type="file"
              id={String(name)}
              {...rest}
            />
          );
        })()
      ) : (
        <Input
          hidden={true}
          ref={inputRef}
          className={cn(
            "hidden",
            classNameInputExtra,
            error?.message ? "border-destructive" : "",
          )}
          name={name}
          onChange={handleFileChange}
          disabled={disabled}
          autoFocus={autoFocus}
          readOnly={readOnly}
          accept={accept}
          multiple={multiple}
          type="file"
          id={String(name)}
        />
      )}

      {error?.message && (
        <p className="text-destructive mt-2 text-sm font-medium">
          {tError(error.message)}
        </p>
      )}
    </div>
  );
};

export default FilleField;
