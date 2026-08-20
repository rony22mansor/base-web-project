import { MAIN_NAV } from "@/src/core/config/navigation";
import { Link } from "@/src/core/i18n/navigation";
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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-4 md:p-0">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("greeting")}</h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {MAIN_NAV.map((item) => (
            <Link key={item.url} href={item.url} className="group">
              <Card className="hover:border-primary/60 h-full gap-4 transition-colors">
                <CardHeader>
                  <span className="bg-primary/10 text-primary mb-3 flex size-10 items-center justify-center rounded-lg">
                    <item.icon className="size-5" />
                  </span>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {tFeatures(`${item.titleKey}.title`)}
                    <ForwardArrow className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>
                    {tFeatures(`${item.titleKey}.description`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <p className="text-muted-foreground border-t pt-4 text-xs">
          {t("disclaimer")}
        </p>
      </div>
    </BasePage>
  );
}
