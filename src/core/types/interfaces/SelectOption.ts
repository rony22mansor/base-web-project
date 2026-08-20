import { ReactNode } from "react";
import { Key } from "readline";

export interface SelectOption {
  value?: Key | null | undefined;
  label?: ReactNode;
  id: string | number | boolean;
  name: string;
  disabled?: boolean;
  extraProps?: number | string;
  type?: string | number;
}
