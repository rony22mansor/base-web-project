"use client";
import { InputModeType } from "@/src/core/types/InputModeType";
import { cn } from "@/src/core/utils/utils";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const { isActive, handleFocus, handleBlur } = useIsActive(defaultValue);
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
        "mb-3 w-full",
        type === "hidden" ? "hidden" : "",
        classNameWrapper,
      )}
    >
      {(type === "text" || type === "email" || type === "password") && (
        <div>
          {label && (
            <Label
              className={cn(
                `mb-1.5 block text-[13px] font-medium ${labelExtraClassName ?? ""} transition-colors`,
                isActive ? "text-foreground" : "text-text-secondary",
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
                    "pointer-events-none absolute h-4 w-4 start-3",
                    "text-text-tertiary",
                    disabled ? "opacity-50" : "",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "bg-border absolute start-10 h-5 w-px",
                    disabled ? "opacity-50" : "",
                  )}
                />
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
                aria-invalid={Boolean(error?.message)}
                className={cn(classNameInputExtra, Icon ? "ps-13" : "")}
                {...props}
              />
            }
            {isPasswordField && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-text-secondary hover:text-foreground absolute end-3 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        </div>
      )}
      {error && error.message && (
        <p className="text-destructive mt-1.5 text-[13px]">
          {tError(error.message)}
        </p>
      )}
    </div>
  );
};

export default InputField;
