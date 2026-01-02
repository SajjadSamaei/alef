"use client";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import {
  getFormatter,
  getMessages,
  getTranslations,
  getLocale,
} from "next-intl/server";
import { Vazirmatn, Inter } from "next/font/google"; // 1. Import Inter for English
import { Field, FieldSet } from "@/components/ui/shadcn/field";
import { Heading } from "@/components/ui/catalyst/heading";
import { Button } from "@/components/ui/shadcn/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useLocale, useTranslations, useMessages } from "next-intl"; // 2. Import i18n hooks
import { useDirection } from "@/utils/hooks/useDirection";
import { NextIntlClientProvider } from "next-intl";
import { AnimatedThemeToggler } from "@/components/ui/magicui/animated-theme-toggler";

const vazir = Vazirmatn({ subsets: ["arabic"] });
const inter = Inter({ subsets: ["latin"] }); // 3. Initialize Inter

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Error" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

// Root error components must be Client Components
// and receive 'error' and 'reset' props.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale(); // 4. Get the current locale
  const t = useTranslations("Error"); // 5. Get translations
  const messages = useMessages();

  // 6. Determine direction and font
  const direction = useDirection();
  const fontClassName =
    locale === "fa" || locale === "ar" ? vazir.className : inter.className;

  return (
    <html
      lang={locale}
      dir={direction}
      className={fontClassName}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <main
              dir={direction} // 7. Set dynamic direction
              className="flex min-h-dvh flex-col bg-neutral-950 p-2"
            >
              <div className="relative flex grow items-center justify-center rounded-[40px] bg-white p-6 ring-1 ring-zinc-950/5 lg:p-10 lg:shadow-xs dark:bg-zinc-900 dark:ring-white/10">
                <FieldSet className="grid place-items-center sm:py-32 lg:px-8">
                  <Field>
                    <div className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-rose-400/15 dark:bg-rose-400/10">
                      <ExclamationTriangleIcon
                        className="h-16 w-16 text-rose-700 dark:text-rose-400"
                        aria-hidden="true"
                      />
                    </div>
                    <Field className="text-center">
                      <Heading className="mt-4 text-2xl leading-9 font-black tracking-tight text-zinc-950 data-disabled:opacity-50 sm:text-xl dark:text-zinc-100">
                        {t("title")} {/* 8. Use translated text */}
                      </Heading>
                    </Field>
                  </Field>
                  <Field className="mt-8 flex grow items-center justify-center gap-2">
                    <Button
                      className="sm:w-auto"
                      onClick={() => reset()} // 9. Use the 'reset' function
                    >
                      {t("tryAgain")} {/* 8. Use translated text */}
                    </Button>
                    <Button
                      variant="outline"
                      className="sm:w-auto"
                      onClick={() => window.history.back()} // Use browser history to go back
                    >
                      {t("goBack")} {/* 8. Use translated text */}
                    </Button>
                  </Field>
                </FieldSet>
                <AnimatedThemeToggler className="absolute top-4 right-4" />
              </div>
            </main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
