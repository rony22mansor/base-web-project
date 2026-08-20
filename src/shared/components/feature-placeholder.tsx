import { BasePage } from "./base-page";
import { getTranslations } from "next-intl/server";
import { Construction } from "lucide-react";

/**
 * Temporary body for a feature route that is scaffolded but not built yet.
 * Delete each usage as the corresponding feature lands.
 */
export async function FeaturePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const t = await getTranslations("common");

  return (
    <BasePage>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-0">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </header>

        <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <Construction className="size-8" />
          <p className="font-medium">{t("comingSoon")}</p>
          <p className="text-sm">{t("comingSoonDescription")}</p>
        </div>
      </div>
    </BasePage>
  );
}
