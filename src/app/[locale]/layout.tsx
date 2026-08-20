import { Assets } from "@/src/assets/assets";
import { routing } from "@/src/core/i18n/routing";
import QueryProvider from "@/src/core/providers/QueryProvider";
import { ThemeProvider } from "@/src/core/providers/ThemeProvider";
import { setDirection } from "@/src/core/utils/functions/helperServer";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "../../globals.css";
import "../../shared/styles/FormAnimation.css";
import "../../shared/styles/datepicker.css";
import "../../shared/styles/scrollbar.css";
import "../../shared/styles/toast.css";

const cairoSans = Cairo({
  variable: "--font-cairo-sans",
  subsets: ["latin", "arabic"],
});

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = BASE_PATH ? `/${BASE_PATH}` : "";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app");

  return {
    title: t("name"),
    description: t("tagline"),
    icons: {
      icon: `${basePath}/logo.svg`,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cairoSans.className}
      dir={setDirection(locale)}
      style={{ backgroundImage: `url(${Assets.basebgImage.src})` }}
    >
      <body className="relative flex h-screen flex-col overflow-y-hidden">
        <QueryProvider>
          <NextIntlClientProvider locale={locale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                closeButton={false}
                rtl={setDirection(locale) === "rtl"}
                theme="dark"
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
