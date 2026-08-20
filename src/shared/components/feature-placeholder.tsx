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
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-tight font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-text-secondary max-w-2xl text-sm">{description}</p>
        </header>

        <div className="text-text-secondary flex flex-col items-center gap-3 rounded-md border border-dashed p-12 text-center">
          <Construction className="size-8" />
          <p className="font-medium">{t("comingSoon")}</p>
          <p className="text-sm">{t("comingSoonDescription")}</p>
        </div>
      </div>
    </BasePage>
  );
}
