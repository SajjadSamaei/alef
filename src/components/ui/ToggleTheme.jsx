"use client";
import { useTheme } from "next-themes";
import {
  DropdownItem,
  DropdownSection,
  DropdownLabel,
} from "@/components/ui/catalyst/dropdown";
import { MoonIcon, LightBulbIcon } from "@heroicons/react/16/solid";

const themes = [
  { name: "light", value: "تغییر رنگ پوسته به تاریک" },
  { name: "dark", value: "تغییر رنگ پوسته به روشن" },
];

export default function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const selectedThemeLabel = themes.find(
    (theme) => theme.name === resolvedTheme,
  )?.value;
  return (
    <DropdownItem
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <MoonIcon className="dark:hidden" />
      <LightBulbIcon className="hidden dark:block" />
      <DropdownLabel className="flex justify-start pr-2">
        {selectedThemeLabel}
      </DropdownLabel>
    </DropdownItem>
  );
}
