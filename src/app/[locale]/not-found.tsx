import { Link } from "@/src/core/i18n/navigation";
import { AppRoutes } from "@/src/core/routing/app_routes";
import { Button } from "@/src/shared/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function CustomNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">{t("title")}</h2>
        <p className="text-muted-foreground mb-8">{t("description")}</p>
        <Link href={AppRoutes.root}>
          <Button>{t("button")}</Button>
        </Link>
      </div>
    </div>
  );
}
