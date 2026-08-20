"use client";


import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { XIcon } from "lucide-react";
import { useValidationMessage } from "@/src/core/i18n/validationMessages";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";
import { FiCalendar } from "react-icons/fi";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/src/core/utils/utils";

interface DatePickerFieldProps {
  required?: boolean;
  name: string;
  label?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  disabled?: boolean;
  classNameExtra?: string;
  defaultValue?: Date | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  minDate?: Date;
  maxDate?: Date;
  showYearDropdown?: boolean;
  datePickerIsClearable?: boolean;
  filterDate?: (date: Date) => boolean;
}

export function DatePickerField({
  required = false,
  name,
  label,
  placeholder,
  control,
  disabled = false,
  classNameExtra,
  defaultValue = null,
  error,
  minDate,
  maxDate,
  showYearDropdown = true,
  filterDate,
  // datePickerIsClearable = true,
  ...props
}: DatePickerFieldProps) {
  const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);
  const tError = useValidationMessage();

  // const pickLocale = locale === "ar" ? arEG : enUS;
  const pickLocale =  enUS;

  return (
    <div className="w-full mb-2">
      {label && (
        <Label className="mb-3" isActive={datePickerIsOpen}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => {
          // إذا كانت القيمة Date object اعرضها مباشرة، وإذا كانت string حولها إلى Date مؤقت للعرض
          const dateValue: Date | null =
            value instanceof Date
              ? value
              : value
                ? new Date(value) // تحويل string إلى Date للعرض في الزر
                : null;

          const handleClear = (e: React.PointerEvent | React.MouseEvent) => {
            e.stopPropagation();
            onChange(null); // إعادة القيمة إلى null
            setDatePickerIsOpen(false); // غلق الـ popover
          };
          return (
            <Popover open={datePickerIsOpen} onOpenChange={setDatePickerIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "file:text-foreground h-11 hover:bg-card placeholder:text-muted selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full min-w-0 rounded-lg border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm items-center justify-start!  !ps-3",
                    datePickerIsOpen ? "border-white" : "",
                    error?.message ? "border-destructive" : "",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ",
                    classNameExtra
                  )}
                  disabled={disabled}
                >
                  <span className="flex items-center gap-2 ">
                    <FiCalendar
                      className={`h-4 w-4 ${datePickerIsOpen ? "text-white" : "text-muted"
                        }`}
                    />
                    <div className="h-5 w-px bg-muted"></div>
                    {dateValue ? (
                      <span>{format(dateValue, "yyyy-MM-dd")}</span>
                    ) : (
                      <span className="text-muted">{placeholder}</span>
                    )}

                    {dateValue && !disabled && (
                      <div
                        className="flex items-center mx-2"
                        onPointerDown={handleClear}
                        onMouseDown={handleClear}
                        key={String(value)}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          className="cursor-pointer p-1"
                          aria-label="clear"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-2">
                <DatePicker
                  {...props}
                  filterDate={filterDate}
                  selected={dateValue}
                  isClearable
                  onChange={(date: Date | null) => {
                    if (date) {
                      // خزّن القيمة بصيغة string YYYY-MM-DD في react-hook-form
                      onChange(format(date, "yyyy-MM-dd"));
                    } else {
                      onChange(null);
                    }
                    setDatePickerIsOpen(false);
                  }}
                  inline
                  dateFormat="yyyy-MM-dd"
                  locale={pickLocale}
                  minDate={minDate}
                  maxDate={maxDate}
                  showYearDropdown={showYearDropdown}
                  showMonthDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={130}
                  disabled={disabled}
                  placeholderText={placeholder}
                  calendarClassName="dark-datepicker"
                  className={`w-full p-9 border rounded  ${classNameExtra} ${error ? "border-destructive" : "border-input"
                    }`}
                />
              </PopoverContent>
            </Popover>
          );
        }}
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
}
