"use client";

import { Link } from "@/src/core/i18n/navigation";
import { AppRoutes } from "@/src/core/routing/app_routes";
import { Scale } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSidebar } from "./ui/sidebar";

export default function SidebarLogo() {
  const t = useTranslations("app");
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <Link
      href={AppRoutes.root}
      className="flex items-center gap-2 rounded-md px-2 py-3"
    >
      <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
        <Scale className="size-5" />
      </span>
      {!isCollapsed && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-base font-bold">{t("name")}</span>
          <span className="text-muted-foreground truncate text-xs">
            {t("tagline")}
          </span>
        </span>
      )}
    </Link>
  );
}
