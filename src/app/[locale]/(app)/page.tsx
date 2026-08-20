import { MAIN_NAV } from "@/src/core/config/navigation";
import { Link } from "@/src/core/i18n/navigation";
import { AppLogo } from "@/src/shared/components/app-logo";
import { BasePage } from "@/src/shared/components/base-page";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tFeatures = await getTranslations("features");
  const locale = await getLocale();

  // Direction-agnostic "forward" arrow.
  const ForwardArrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <BasePage>
      <div className="flex w-full flex-col gap-10">
        {/* Notion's page header: a large icon above a 40px title. */}
        <header className="flex flex-col gap-3">
          <AppLogo size={52} priority />
          <h1 className="text-[40px] leading-tight font-bold tracking-tight">
            {t("greeting")}
          </h1>
          <p className="text-text-secondary notion-prose max-w-2xl">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {MAIN_NAV.map((item) => (
            <Link key={item.url} href={item.url} className="group">
              <Card className="hover:border-border-strong h-full gap-3 py-4 transition-colors hover:shadow-xs">
                <CardHeader>
                  <span className="bg-accent text-text-secondary group-hover:text-foreground mb-2 flex size-8 items-center justify-center rounded-sm transition-colors">
                    <item.icon className="size-4" />
                  </span>
                  <CardTitle className="flex items-center gap-1.5">
                    {tFeatures(`${item.titleKey}.title`)}
                    <ForwardArrow className="text-text-tertiary size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>
                    {tFeatures(`${item.titleKey}.description`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Notion's gray callout block — a quiet aside, not an alert. */}
        <p className="bg-tag-gray text-tag-gray-fg rounded-sm px-4 py-3 text-sm leading-relaxed">
          {t("disclaimer")}
        </p>
      </div>
    </BasePage>
  );
}
