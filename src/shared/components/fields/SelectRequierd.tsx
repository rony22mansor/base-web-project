"use client";

import { SelectOption } from "@/src/core/types/interfaces/SelectOption";
import { cn } from "@/src/core/utils/utils";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { LucideIcon, LucideSearch, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useValidationMessage } from "@/src/core/i18n/validationMessages";
import { useEffect, useRef, useState } from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";
import { IconType } from "react-icons/lib";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import Spinner from "../ui/spinner";
import InputField from "./InputField";
// ========================================================================
// 1. واجهة الخصائص (Props)
// ========================================================================
interface SelectRequierdProps {
  required?: boolean;
  name: string;
  label?: string;
  labelExtraClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
  classNameInputExtra?: string;
  classNameSelectContent?: string;
  classNameWrapper?: string;
  dir?: "rtl" | "ltr";
  icon?: LucideIcon | IconType;
  value?: string;
  loading?: boolean;
  onChange?: (value: string | boolean | number | null) => void;
  onChangeValue?: (value: string | boolean | number | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  showClearIcon?: boolean;
}

interface InnerSelectProps
  extends Omit<SelectRequierdProps, "control" | "error"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: any;
  currentError?: string;
  required?: boolean;
}

// ========================================================================
// 2. المكون الداخلي (Logic & UI)
// ========================================================================
function InnerSelect({
  required = false,
  name,
  label,
  labelExtraClassName,
  options = [],
  placeholder,
  disabled,
  classNameInputExtra,
  classNameSelectContent,
  classNameWrapper,
  icon: Icon,
  onChange,
  onChangeValue,
  value,
  loading,
  field,
  currentError,
  showClearIcon = true,
}: InnerSelectProps) {
  const tError = useValidationMessage();
  const tr = useTranslations("common");
  const locale = useLocale();

  const [selectIsOpen, setSelectIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [localStateValue, setLocalStateValue] = useState<string | null>(
    value || null
  );

  const showSearch = options.length > 7;

  // 1. القيمة الخام الحالية
  const currentValue = field ? field.value : localStateValue;

  // 2. التحقق: هل القيمة موجودة ضمن الخيارات المتاحة حالياً؟
  const isValueValid = options.some(
    (opt) => String(opt.id) === String(currentValue)
  );

  // 3. القيمة الآمنة للعرض: إذا كانت غير صالحة نمرر "" لإظهار الـ Placeholder
  const displayValue = isValueValid ? String(currentValue) : "";

  const parseValue = (val: string): number | string => {
    if (val === "" || val == null) return "";
    const num = Number(val);
    return isNaN(num) ? "" : num;
  };

  const clearValue = () => {
    if (field) {
      field.onChange();
    } else {
      setLocalStateValue(null);
      onChange?.(null);
    }
    setSelectIsOpen(false);
  };

  // -----------------------------------------------------------------
  // مراقبة الخيارات: إذا تغيرت الخيارات والقيمة القديمة لم تعد موجودة
  // -----------------------------------------------------------------
  const hasOptionsLoaded = options.length > 0;

  // Options can reload (e.g. after a fetch) and no longer contain the selected
  // id, so the stale id must be cleared out of the form store. This reconciles
  // two external systems at once (the RHF field and the parent `onChange`) and
  // also closes the dropdown, none of which has a render-time equivalent — so
  // the effect stays, deliberately.
  useEffect(() => {
    if (!hasOptionsLoaded) return;

    if (currentValue && !isValueValid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      clearValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOptionsLoaded, currentValue, isValueValid]);

  // مزامنة القيمة الخارجية عند عدم استخدام Controller
  // Adjusted during render (React's documented pattern for reacting to a prop
  // change) instead of in an effect, which would cause a second render pass.
  const [prevValue, setPrevValue] = useState(value);
  if (!field && value !== undefined && value !== prevValue) {
    setPrevValue(value);
    setLocalStateValue(value);
  }

  useEffect(() => {
    if (selectIsOpen && showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchTerm, selectIsOpen, showSearch]);

  const handleValueChange = (val: string) => {
    const numericValue = parseValue(val);
    if (onChangeValue) onChangeValue(numericValue);
    if (field) {
      field.onChange(numericValue);
    } else {
      setLocalStateValue(val);
      if (onChange) onChange(val);
    }
    setSelectIsOpen(false);
  };

  const handleClearClick = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearValue();
  };

  const showClearButton = displayValue && !disabled && options.length > 0;

  return (
    <div className={cn("w-full mb-2", classNameWrapper)}>
      {typeof label === "string" && (
        <Label
          isActive={selectIsOpen}
          className={`mb-3 ${labelExtraClassName}`}
          htmlFor={String(name)}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <Select
        key={displayValue || "empty"} // إعادة الرسم عند العودة للـ Placeholder
        value={displayValue}
        onValueChange={handleValueChange}
        dir={locale === "ar" ? "rtl" : "ltr"}
        onOpenChange={(open) => setSelectIsOpen(open)}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "relative flex items-center",
            classNameInputExtra,
            currentError && "border-destructive",
            selectIsOpen ? "border-white" : ""
          )}
        >
          {Icon && (
            <>
              <Icon className={cn(selectIsOpen ? "text-white" : "")} />
              <span className="mx-1 bg-muted h-5 w-0.5" />
            </>
          )}

          <SelectValue placeholder={placeholder} className="flex-1" />

          {showClearButton && (
            <div
              className="flex items-center mx-2"
              onPointerDown={handleClearClick}
              onMouseDown={handleClearClick}
            >
              {showClearIcon && (
                <button
                  type="button"
                  className="cursor-pointer hover:text-destructive transition-colors"
                  aria-label="clear"
                >
                  <XIcon size={16} />
                </button>
              )}
            </div>
          )}
        </SelectTrigger>

        <SelectContent
          className={cn(classNameSelectContent)}
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          {showSearch && (
            <div className="px-2 py-1 sticky top-0 bg-background z-10">
              <InputField
                type="text"
                placeholder={tr("search")}
                value={searchTerm}
                autoFocus
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setTimeout(() => {
                    searchRef.current?.focus();
                  }, 0);
                }}
                name={"search"}
                classNameInputExtra="h-9"
                icon={LucideSearch}
                ref={searchRef}
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-2">
              <Spinner color="text-primary" size={24} />
            </div>
          ) : (
            <>
              {options
                ?.filter((item) =>
                  item?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
                )
                .map((item, index, arr) => (
                  <div key={String(item.id)}>
                    <SelectItem
                      value={String(item.id)}
                      disabled={item.disabled}
                    >
                      {item.name}
                    </SelectItem>
                    {index !== arr.length - 1 && (
                      <hr className="bg-application-gray_app w-full opacity-25 h-0.5" />
                    )}
                  </div>
                ))}

              {options.filter((item) =>
                item?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
              ).length === 0 && (
                <div className="py-2 ps-4 text-sm text-muted-foreground">
                  لا يوجد نتائج
                </div>
              )}
            </>
          )}
        </SelectContent>
      </Select>

      {currentError && (
        <p className="mt-2 text-sm font-medium text-destructive">
          {tError(currentError)}
        </p>
      )}
    </div>
  );
}

// ========================================================================
// 3. المكون الرئيسي (Wrapper)
// ========================================================================
export function SelectRequierd(props: SelectRequierdProps) {
  const { control, name, error, required = false, ...rest } = props;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InnerSelect
            {...rest}
            name={name}
            field={field}
            currentError={error?.message as string}
            required={required}
          />
        )}
      />
    );
  }

  return (
    <InnerSelect
      {...rest}
      name={name}
      currentError={error?.message as string}
      required={required}
    />
  );
}
