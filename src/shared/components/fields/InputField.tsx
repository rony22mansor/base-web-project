"use client";
import { InputModeType } from "@/src/core/types/InputModeType";
import { cn } from "@/src/core/utils/utils";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { useValidationMessage } from "@/src/core/i18n/validationMessages";
import { useState } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { IconType } from "react-icons/lib";
import { useIsActive } from "../../hooks/useIsActive";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface InputFieldProps<T extends Record<string, any>> {
  required?: boolean;

  register?: UseFormRegister<T>;
  label?: string;
  icon?: LucideIcon | IconType;
  type: "text" | "email" | "password" | "hidden";
  name: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  defaultValue?: string;
  maxLength?: number;
  readOnly?: boolean;
  classNameInputExtra?: string;
  labelExtraClassName?: string;
  classNameWrapper?: string;
  pattern?: string;
  dir?: string;
  inputMode?: InputModeType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number | boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFocus?: any;
  numbersOnly?: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputField = <T extends Record<string, any>>({
  required,
  label,
  name,
  type,
  placeholder,
  disabled,
  autoFocus,
  onFocus,
  error,
  defaultValue,
  readOnly,
  register,
  maxLength,
  classNameInputExtra,
  labelExtraClassName,
  icon: Icon,
  onClick,
  onChange,
  value,
  classNameWrapper,
  pattern,
  inputMode,
  numbersOnly = false,
  dir,
  ...props
}: InputFieldProps<T>) => {
  const tError = useValidationMessage();
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const { isActive, handleFocus, handleBlur } = useIsActive(defaultValue);
  const isRTL = locale === "ar";
  const isPasswordField = type === "password";
  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const replaceCharacter = (e: any) => {
    const onlyNumbersCommaDot = e.target.value.replace(/[^0-9,\.]/g, "");
    e.target.value = onlyNumbersCommaDot;
  };
  return (
    <div
      className={cn(
        "w-full mb-2 ",
        type === "hidden" ? "hidden" : "",
        classNameWrapper,
      )}
    >
      {(type === "text" || type === "email" || type === "password") && (
        <div>
          {label && (
            <Label
              className={cn(
                `mb-3 ${labelExtraClassName} transition-colors`,
                isActive ? "text-foreground/80" : "text-text-secondary",
              )}
              htmlFor={String(name)}
            >
              {label} {required && <span className="text-destructive">*</span>}

            </Label>
          )}
          <div className="relative flex items-center ">
            {Icon && (
              <>
                <Icon
                  className={cn(
                    "absolute h-4 w-4 mb-1 pt-[2px]",
                    isRTL ? "right-3" : "left-3",
                    "text-text-secondary/40",
                    disabled ? "text-text-secondary opacity-50" : "",
                  )}
                />
                <span
                  className={`absolute ${isRTL ? "right-10" : "left-10"
                    } bg-muted h-5 w-0.5  ${disabled ? "text-placeHolder opacity-50" : ""
                    }`}
                ></span>
              </>
            )}
            {
              <Input
                {...(register ? register(name) : {})}
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                name={String(name)}
                autoComplete="off"
                id={String(name)}
                readOnly={readOnly}
                maxLength={maxLength}
                onClick={onClick}
                pattern={pattern}
                inputMode={inputMode}
                dir={dir}
                onFocus={(e) => {
                  handleFocus(); // تغيير حالة isActive
                  onFocus?.(e); // تمرير الحدث لو تم تمريره
                }}
                onBlur={() => {
                  handleBlur(); // تحديث isActive حسب القيمة
                }}
                onChange={(e) => {
                  if (numbersOnly) {
                    replaceCharacter(e);
                  }
                  register?.(name).onChange(e);
                  onChange?.(e);
                }}
                defaultValue={defaultValue}
                value={typeof value === "boolean" ? "" : value}
                className={cn(
                  classNameInputExtra,
                  error?.message
                    ? "border-text-secondary"
                    : isActive
                      ? "border-black/35"
                      : "",
                  Icon ? "ps-13" : "",
                )}
                {...props}
              />
            }
            {isPasswordField && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute ${isRTL ? "left-4" : "right-4"
                  } text-text-secondary hover:text-gray-700`}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        </div>
      )}
      {error && error.message && (
        <p className="mt-2 text-sm font-medium text-destructive">
          {tError(error.message)}
        </p>
        // <p className="mt-2 text-sm font-medium text-destructive">
        //   {(error.message as string) ?? ""}
        // </p>
      )}
    </div>
  );
};

export default InputField;
