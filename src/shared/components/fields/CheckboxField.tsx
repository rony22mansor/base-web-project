'use client'
import { cn } from "@/src/core/utils/utils";
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";
import { useIsActive } from "../../hooks/useIsActive";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface CheckboxFieldProps {
  id?: string;
  name?: string;
  label?: string;
  labelExtraClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  disabled?: boolean;
  classNameWrapper?: string;
  classNameCheckboxItem?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  required?: boolean;
}

export function CheckboxField({
  id,
  name,
  label,
  labelExtraClassName,
  control,
  disabled = false,
  classNameWrapper,
  value,
  onChange,
  error,
  required = false,
}: CheckboxFieldProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RenderCheckbox = (field?: any) => {
    const checked = field ? field.value : value ?? false;

    const { isActive, handleFocus, handleBlur } = useIsActive(checked);

    const handleChange = (val: boolean) => {
      if (field) {
        field.onChange(val);
      }

      if (onChange) {
        onChange(val);
      }
    };


    return (
      <div
        className={cn("flex flex-col justify-center  mt-4", classNameWrapper)}
      >
        <div className="flex items-center  gap-2">
          <Checkbox
            id={id || name}
            checked={checked}
            onCheckedChange={handleChange}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${error?.message ? `border-destructive` : ""}`}
          />

          {label && (
            <Label
              htmlFor={id || name}
              isActive={isActive}
              className={cn(
                "cursor-pointer text-base pt-1",
                labelExtraClassName
              )}
            >
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
          )}
        </div>

        {error?.message && (
          <p className="mt-1 text-sm font-medium text-destructive">
            {String(error.message)}
          </p>
        )}
      </div>
    );
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => RenderCheckbox(field)}
      />
    );
  }

  return RenderCheckbox();
}
