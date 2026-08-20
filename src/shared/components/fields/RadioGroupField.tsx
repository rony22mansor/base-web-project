"use client";
import { SelectOption } from "@/src/core/types/interfaces/SelectOption";
import { cn } from "@/src/core/utils/utils";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { useValidationMessage } from "@/src/core/i18n/validationMessages";
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";
import { useIsActive } from "../../hooks/useIsActive";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";

interface RadioGroupFieldProps {
  name?: string;
  label?: string;
  labelExtraClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  options: SelectOption[];
  defaultValue?: string | number | boolean;
  disabled?: boolean;
  classNameWrapper?: string;
  classNameRadioGroupItem?: string;
  RadioGroupClassName?: string;
  value?: number | boolean;
  onChange?: (value: string | number | boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  required?: boolean;
}

export function RadioGroupField({
  name,
  label,
  labelExtraClassName,
  control,
  options,
  defaultValue,
  disabled = false,
  classNameWrapper,
  classNameRadioGroupItem,
  RadioGroupClassName,
  value,
  onChange,
  error,
  required = false,
}: RadioGroupFieldProps) {
  const tError = useValidationMessage();
  const { isActive } = useIsActive(defaultValue);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRadioGroup = (field?: any) => (
    <div className={cn("w-full mb-2   ", classNameWrapper)}>
      {label && (
        <Label className={cn("mb-3 block text-lg", labelExtraClassName)}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <RadioGroup
        defaultValue={defaultValue ? String(defaultValue) : undefined}
        value={field ? String(field.value) : value ? String(value) : undefined}
        onValueChange={(selectedValue) => {
          // تحويل القيمة المحددة إلى النوع الأصلي
          const originalOption = options.find(
            (option) => String(option.id) === selectedValue
          );
          const originalValue = originalOption
            ? originalOption.id
            : selectedValue;

          if (field) {
            field.onChange(originalValue);
          } else if (onChange) {
            onChange(originalValue);
          }
        }}
        disabled={disabled}
        className={`flex gap-4 w-fit bg-red ${RadioGroupClassName}`}
      >
        {options?.map((item) => (
          <div
            key={String(item.id)}
            className="flex items-center space-x-1 gap-2  "
          >
            <Label
              htmlFor={String(item.id)}
              isActive={isActive}
              className={cn(
                "cursor-pointer text-lg transition-colors",
                item.disabled
                  ? "cursor-not-allowed text-text-tertiary"
                  : "cursor-pointer",
                field?.value === item.id && "text-foreground",
                "text-sm"
              )}
            >
              {item.name}
            </Label>
            <RadioGroupItem
              value={String(item.id)} // تحويل إلى string فقط للـ DOM
              id={String(item.id)}
              className={`${classNameRadioGroupItem} ${
                error?.message ? `border-destructive` : ""
              } ${
                field?.value === item.id ? "!border-link" : "border-input"
              } `}
              disabled={item.disabled}
            />
          </div>
        ))}
      </RadioGroup>
      {error && error.message && (
        <p className="text-destructive mt-1.5 text-[13px]">
          {tError(error.message)}
        </p>
      )}
    </div>
  );

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderRadioGroup(field)}
      />
    );
  }

  return renderRadioGroup();
}
