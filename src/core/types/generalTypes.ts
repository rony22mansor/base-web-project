import { LucideIcon } from "lucide-react";
import { FieldError, FieldErrorsImpl, Merge, Path } from "react-hook-form";
import { IconType } from "react-icons/lib";
// import { modulesApi } from "./fetching/types";
import { InputModeType } from "./InputModeType";
import { SelectOption } from "./interfaces/SelectOption";
import { modulesApi } from "./modulesApi";

export interface InputItem {
  id: number;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
  createDate?: string;
  createTime?: string;
  rem?: string | null;
}
export type ValidationErrors = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IFormField<T extends Record<string, any>> {
  name: Path<T>;
  label?: string;
  type:
    | "text"
    | "userName"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "datetime"
    | "checkbox"
    | "radio"
    | "select"
    | "hidden"
    | "file"
    | "textarea"
    | "selectrequierd"
    | "multiselect"
    | "commandselect"
    | "autocomplete"
    | "amount"
    | "phoneNumber";
  placeholder?: string;
  urlQuery?: string;
  onOptionSelect?: (option: SelectOption) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformResponse?: (data: any) => SelectOption[]; // تحويل الاستجابة إلى خيارات
  minSearchLength?: number; //
  disabled?: boolean;
  autoFocus?: boolean;
  options?: SelectOption[];
  id?: string;
  defaultValue?: string;
  readOnly?: boolean;
  error?: ValidationErrors;
  maxLength?: number;
  accept?:
    | "image/.jpg, .jpeg, .png"
    | "video/.mp4,"
    | ".doc,.docx,.xml"
    | ".pdf"
    | ".jpg,.png,.pdf,.doc,.docx";
  multiple?: boolean;
  allowDecimals?: boolean;
  valueAsNumber?: boolean;
  withSeparator?: boolean;
  value?: string | number | boolean;
  icon?: LucideIcon | IconType;
  classNameInputExtra?: string;
  labelExtraClassName?: string;
  classNameSelectContent?: string;
  classNameWrapper?: string;
  classNameRadioGroupItem?: string;
  apiBody?: object;
  pattern?: string;
  inputMode?: InputModeType;
  dir?: "rtl" | "ltr";
  maxSizeMB?: number;
  onchangeFile?: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof T
  ) => void;
  fileName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetvalue?: boolean;
  stepMinutes?: number;
  numbersOnly?: boolean;
  // module?: modulesApi;
  loading?: boolean;
  urlParam?: string | number;
  showYearDropdown?: boolean;
  datePickerIsClearable?: boolean;
  maxDate?: Date;
  minDate?: Date;
  numberOfDecimals?: number;
  RadioGroupClassName?: string;
  required?: boolean;
  showClearIcon?: boolean;
  module?: modulesApi;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DynamicForm<T extends Record<string, any>> = {
  id?: string;
  title?: string;
  fields: Record<string, IFormField<T>>;
};

export type NavbarLink = {
  title: string;
  href?: string;
  id?: number | string;
  show?: boolean;
  preventNavigation?: boolean;
  preventActive?: boolean;
  subLinks?: {
    id?: number | string;
    title: string;
    href: string;
    show?: boolean;
  }[];
};

export enum RequestState {
  Init = "Init",
  Loading = "Loading",
  Error = "Error",
  Success = "Success",
}


export enum Languages {
  Arabic = "ar",
  English = "en",
}