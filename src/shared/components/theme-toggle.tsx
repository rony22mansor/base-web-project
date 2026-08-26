"use client";

import { setSide } from "@/src/core/utils/functions/helperServer";
import { Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { SidebarMenuButton } from "./ui/sidebar";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("common");
  const locale = useLocale();
  const tooltipSide = setSide(locale) === "right" ? "left" : "right";

  return (
    <SidebarMenuButton
      className="h-9"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      tooltip={{ children: t("theme"), side: tooltipSide }}
    >
      {/*
        Which state shows is driven by the `dark` class next-themes puts on
        <html>, so this needs no mounted guard and cannot hydrate mismatched.
      */}
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
      <span className="hidden dark:inline leading-relaxed">
        {t("lightMode")}
      </span>
      <span className="dark:hidden leading-relaxed">{t("darkMode")}</span>
    </SidebarMenuButton>
  );
}
