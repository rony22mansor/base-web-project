import { cn } from "@/src/core/utils/utils";
import { useValidationMessage } from "@/src/core/i18n/validationMessages";
import React from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { useIsActive } from "../../hooks/useIsActive";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ITextAreaFieldProps<T extends Record<string, any>> {
  register?: UseFormRegister<T>;
  label?: string;
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

  onClick?: React.MouseEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  value?: string | number;
  ref?: React.Ref<HTMLTextAreaElement>;
  required?: boolean;

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextAreaField = <T extends Record<string, any>>({
  label,
  name,
  placeholder,
  disabled,
  autoFocus,
  error,
  defaultValue,
  readOnly,
  register,
  maxLength,
  classNameInputExtra,
  labelExtraClassName,
  onClick,
  value,
  classNameWrapper,
  required = false,
  ...props
}: ITextAreaFieldProps<T>) => {
  const tError = useValidationMessage();
  const { isActive, handleFocus, handleBlur } = useIsActive(defaultValue);

  return (
    <div className={cn("w-full mb-2", classNameWrapper)}>
      {label && (
        <Label
          className={`mb-3   ${labelExtraClassName}`}
          isActive={isActive}
          htmlFor={String(name)}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Textarea
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        readOnly={readOnly}
        maxLength={maxLength}
        onClick={onClick}
        value={value}
        onFocus={() => {
          handleFocus(); // تغيير حالة isActive
        }}
        {...(register ? register(name) : {})}
        onBlur={handleBlur}
        className={`
        ${error?.message && "border-destructive"} 
        ${classNameInputExtra}`}
        {...props}
      />
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

export default TextAreaField;
