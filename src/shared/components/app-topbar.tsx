"use client";

import { isNavItemActive, MAIN_NAV } from "@/src/core/config/navigation";
import { usePathname } from "@/src/core/i18n/navigation";
import { useTranslations } from "next-intl";
import { SidebarTrigger } from "./ui/sidebar";

/**
 * Notion's 45px topbar: the sidebar toggle and a breadcrumb, nothing else. It
 * replaces the old mobile-only header so the collapse control is reachable on
 * desktop too — previously the rail was the only way back once collapsed.
 */
export function AppTopbar() {
  const t = useTranslations("nav");
  const tApp = useTranslations("app");
  const pathname = usePathname();

  const current = MAIN_NAV.find((item) => isNavItemActive(pathname, item.url));

  return (
    <header className="bg-background/85 sticky top-0 z-20 flex h-[45px] shrink-0 items-center gap-1 border-b px-2 backdrop-blur-sm">
      <SidebarTrigger className="text-text-secondary" />

      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-1 text-sm"
      >
        <span className="text-text-secondary truncate rounded-sm px-1.5 py-0.5">
          {tApp("name")}
        </span>
        {current && (
          <>
            <span aria-hidden className="text-text-tertiary">
              /
            </span>
            <span
              aria-current="page"
              className="truncate rounded-sm px-1.5 py-0.5 font-medium"
            >
              {t(current.titleKey)}
            </span>
          </>
        )}
      </nav>
    </header>
  );
}
