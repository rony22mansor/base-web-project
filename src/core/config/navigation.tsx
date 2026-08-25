import {
  FileSignature,
  FileText,
  Gavel,
  Landmark,
  Scale,
  Tags,
  type LucideIcon,
} from "lucide-react";
import { AppRoutes } from "../routing/app_routes";

/**
 * Message keys for the six feature areas. Kept as a literal union (not
 * `string`) so next-intl's typed messages accept `features.${key}.title`.
 */
export type FeatureKey =
  | "rulingGenerator"
  | "lawSearch"
  | "caseSearch"
  | "contractTemplates"
  | "summarization"
  | "classification";

export interface NavItem {
  /** key under both the `nav` and `features` namespaces */
  titleKey: FeatureKey;
  url: string;
  icon: LucideIcon;
}

/**
 * The six MONSIF feature areas, in sidebar order: the three that reason over
 * the corpus first, then the templates, then the two instant text tools — which
 * sit last because they are utilities rather than places to work.
 */
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
  {
    titleKey: "summarization",
    url: AppRoutes.summarization,
    icon: FileText,
  },
  {
    titleKey: "classification",
    url: AppRoutes.classification,
    icon: Tags,
  },
];

/** True when `pathname` (locale already stripped) is inside `url`. */
export const isNavItemActive = (pathname: string, url: string): boolean => {
  if (url === AppRoutes.root) return pathname === AppRoutes.root;
  return pathname === url || pathname.startsWith(`${url}/`);
};
