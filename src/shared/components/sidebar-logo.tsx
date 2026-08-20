"use client";

import { Link } from "@/src/core/i18n/navigation";
import { AppRoutes } from "@/src/core/routing/app_routes";
import { useTranslations } from "next-intl";
import { AppLogo } from "./app-logo";
import { useSidebar } from "./ui/sidebar";

/**
 * Notion's workspace switcher sits at the top of the sidebar: a small mark, the
 * workspace name, and nothing else. Deliberately quiet chrome.
 */
export default function SidebarLogo() {
  const t = useTranslations("app");
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <Link
      href={AppRoutes.root}
      className="hover:bg-sidebar-accent flex h-10 items-center gap-2 rounded-sm px-1.5 transition-colors"
    >
      <span className="flex size-6 shrink-0 items-center justify-center">
        <AppLogo size={18} priority />
      </span>

      {!isCollapsed && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-semibold tracking-tight">
            {t("name")}
          </span>
          <span className="text-text-secondary truncate text-[11px]">
            {t("tagline")}
          </span>
        </span>
      )}
    </Link>
  );
}
