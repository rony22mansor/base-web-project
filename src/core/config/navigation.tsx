import {
  FileSignature,
  Gavel,
  Landmark,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { AppRoutes } from "../routing/app_routes";

/**
 * Message keys for the four feature areas. Kept as a literal union (not
 * `string`) so next-intl's typed messages accept `features.${key}.title`.
 */
export type FeatureKey =
  | "rulingGenerator"
  | "lawSearch"
  | "caseSearch"
  | "contractTemplates";

export interface NavItem {
  /** key under both the `nav` and `features` namespaces */
  titleKey: FeatureKey;
  url: string;
  icon: LucideIcon;
}

/** The four Monsef feature areas, in sidebar order. */
export const MAIN_NAV: NavItem[] = [
  {
    titleKey: "rulingGenerator",
    url: AppRoutes.rulingGenerator,
    icon: Gavel,
  },
  {
    titleKey: "lawSearch",
    url: AppRoutes.lawSearch,
    icon: Scale,
  },
  {
    titleKey: "caseSearch",
    url: AppRoutes.caseSearch,
    icon: Landmark,
  },
  {
    titleKey: "contractTemplates",
    url: AppRoutes.contractTemplates,
    icon: FileSignature,
  },
];

/** True when `pathname` (locale already stripped) is inside `url`. */
export const isNavItemActive = (pathname: string, url: string): boolean => {
  if (url === AppRoutes.root) return pathname === AppRoutes.root;
  return pathname === url || pathname.startsWith(`${url}/`);
};
