import "./globals.css";
import { ThemeProvider } from "next-themes";
import {
  getFormatter,
  getMessages,
  getTranslations,
  getLocale,
} from "next-intl/server";
import { Vazirmatn, Inter } from "next/font/google"; // 1. Import Inter for English
import { Field, Fieldset } from "@/components/ui/catalyst/fieldset";
import { Heading } from "@/components/ui/catalyst/heading";
import { MapIcon } from "@heroicons/react/24/outline";
import { getDirection } from "@/utils/hooks/useDirection";
import { NextIntlClientProvider } from "next-intl";
import { AnimatedThemeToggler } from "@/components/ui/magicui/animated-theme-toggler";
import { Suspense } from "react";

const vazir = Vazirmatn({ subsets: ["arabic"] });
const inter = Inter({ subsets: ["latin"] }); // 4. Initialize English font

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function GlobalNotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "NotFound" });
  const messages = await getMessages({ locale });
  const formatter = await getFormatter({ locale });
  const direction = getDirection(locale);

  const fontClassName = locale === "fa" ? vazir.className : inter.className;

  return (
    <html
      lang={locale}
      dir={direction}
      className={fontClassName}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Suspense fallback={null}>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <main
                dir={direction} // 8. Use dynamic direction
                className="flex min-h-dvh flex-col bg-neutral-950 p-2"
              >
                <div className="relative flex grow items-center justify-center rounded-[40px] bg-white p-6 ring-1 ring-zinc-950/5 lg:p-10 lg:shadow-xs dark:bg-zinc-900 dark:ring-white/10">
                  <Fieldset className="grid place-items-center sm:py-32 lg:px-8">
                    <Field className="">
                      <div className="mx-auto flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-amber-600/15 sm:h-24 sm:w-24 dark:bg-amber-400/10">
                        <MapIcon
                          className="h-20 w-20 text-amber-700 sm:h-16 sm:w-16 dark:text-amber-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-4 flex flex-col items-center justify-between gap-2 text-center">
                        <p className="text-4xl leading-9 font-black tracking-tight text-zinc-950 data-disabled:opacity-50 sm:text-xl dark:text-zinc-100">
                          {formatter.number(404)}
                        </p>
                        <p className="text-2xl leading-9 font-bold tracking-tight text-zinc-950 data-disabled:opacity-50 sm:text-xl dark:text-zinc-100">
                          {t("heading")} {/* 9. Use translated text */}
                        </p>
                      </div>
                    </Field>
                  </Fieldset>
                  <AnimatedThemeToggler className="absolute top-4 right-4" />
                </div>
              </main>
            </NextIntlClientProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
