"use client";
import { Suspense } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars2Icon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Link } from "@/src/i18n/routing"; // Standard i18n Link
import { Logo } from "./logo";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./plus-grid";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";
import {
  HeaderLocaleSwitcher,
  HeaderLocaleSwitcherDesktop,
} from "@/components/chegall/locale-switch";
import { GeneralSearchBar } from "@/components/chegall/search/general-search";

// Define the structure
const navItems = [
  { href: "/portfolio", key: "portfolio" },
  { href: "/services", key: "services" },
  { href: "/process", key: "process" },
  { href: "/about", key: "aboutUs" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "workWithUs" },
];

function DesktopNav() {
  const t = useTranslations("Navigation");

  return (
    <nav className="relative hidden lg:flex">
      {navItems.map(({ href, key }) => (
        <PlusGridItem key={href} className="relative flex">
          <Link
            href={href}
            className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply hover:bg-black/2.5 data-hover:bg-black/2.5 dark:text-white dark:data-hover:bg-white/[2.5%]"
          >
            {t(key)}
          </Link>
        </PlusGridItem>
      ))}

      {/* Locale Switcher (Desktop) */}
      <PlusGridItem className="relative flex items-center">
        <HeaderLocaleSwitcher />
      </PlusGridItem>
      <PlusGridItem className="relative flex items-center">
        <GeneralSearchBar variant="header" />
      </PlusGridItem>
    </nav>
  );
}

function MobileNavButton() {
  return (
    <div className="flex flex-row-reverse items-center gap-2 lg:hidden">
      <DisclosureButton
        className="flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-black/5 lg:hidden dark:text-white dark:data-hover:bg-white/10"
        aria-label="Open main menu"
      >
        <Bars2Icon className="size-6" />
      </DisclosureButton>

      <GeneralSearchBar variant="mobile" />
    </div>
  );
}

function MobileNav() {
  const t = useTranslations("Navigation");

  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        {navItems.map(({ href, key }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: "easeInOut",
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={href}
          >
            <Link
              href={href}
              className="text-base font-medium text-gray-950 dark:text-white"
            >
              {t(key)}
            </Link>
          </motion.div>
        ))}

        {/* Locale Switcher (Mobile) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border-t border-black/5 pt-6 dark:border-white/5"
        >
          <HeaderLocaleSwitcher />
        </motion.div>
      </div>

      {/* Separator Lines */}
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5 dark:border-white/5" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5 dark:border-white/5" />
      </div>
    </DisclosurePanel>
  );
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  const locale = useLocale();
  const direction = getDirection(locale);

  return (
    <Suspense fallback={null}>
      <Disclosure as="header" className="pt-12 sm:pt-16" dir={direction}>
        <PlusGrid>
          <PlusGridRow className="relative flex justify-between">
            <div className="relative flex gap-6">
              <PlusGridItem className="py-3">
                <Link href="/" title="Home">
                  <Logo className="h-9" />
                </Link>
              </PlusGridItem>

              {banner && (
                <div className="relative hidden items-center py-3 lg:flex">
                  {banner}
                </div>
              )}
            </div>

            <DesktopNav />
            <MobileNavButton />
          </PlusGridRow>
        </PlusGrid>

        <MobileNav />
      </Disclosure>
    </Suspense>
  );
}
