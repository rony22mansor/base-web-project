import { AppLogo } from "@/src/shared/components/app-logo";
import { getTranslations } from "next-intl/server";

export default async function HeaderSection() {
  const tApp = await getTranslations("app");
  const t = await getTranslations("login");

  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <AppLogo size={40} priority />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{tApp("name")}</h1>
        <p className="text-text-secondary text-sm">{t("subtitle")}</p>
      </div>
    </header>
  );
}
