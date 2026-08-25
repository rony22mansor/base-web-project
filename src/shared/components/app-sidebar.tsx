"use client";

import { isNavItemActive, MAIN_NAV } from "@/src/core/config/navigation";
import { Link, usePathname } from "@/src/core/i18n/navigation";
import { setSide } from "@/src/core/utils/functions/helperServer";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { LocaleSwitcher } from "./locale-switcher";
import SidebarLogo from "./sidebar-logo";
import { ThemeToggle } from "./theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const side = setSide(locale) as "left" | "right";
  const tooltipSide = side === "right" ? "left" : "right";

  // Only the mobile sheet should close on navigation; the desktop rail stays put.
  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar side={side} collapsible="icon" {...props}>
      <SidebarHeader className="p-1.5">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-1.5">
          {/* Notion labels its sidebar sections in small uppercase type. */}
          <SidebarGroupLabel>{tCommon("workspace")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) => {
                const label = t(item.titleKey);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isNavItemActive(pathname, item.url)}
                      tooltip={{ children: label, side: tooltipSide }}
                    >
                      <Link
                        href={item.url}
                        onClick={closeOnMobile}
                        className="py-5"
                      >
                        <item.icon className="size-4 opacity-70" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter className="p-1.5">
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          <SidebarMenuItem>
            <LocaleSwitcher />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
