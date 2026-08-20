"use client";

import { usePathname, useRouter } from "@/src/core/i18n/navigation";
import { setSide } from "@/src/core/utils/functions/helperServer";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { SidebarMenuButton } from "./ui/sidebar";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === "ar" ? "en" : "ar";
  const label = nextLocale === "ar" ? t("switchToArabic") : t("switchToEnglish");
  // The sidebar sits on the side the locale reads from, so the tooltip goes opposite.
  const tooltipSide = setSide(locale) === "right" ? "left" : "right";

  return (
    <SidebarMenuButton
      onClick={() =>
        startTransition(() => router.replace(pathname, { locale: nextLocale }))
      }
      disabled={isPending}
      tooltip={{ children: label, side: tooltipSide }}
    >
      <Languages className="size-4" />
      <span>{label}</span>
    </SidebarMenuButton>
  );
}
