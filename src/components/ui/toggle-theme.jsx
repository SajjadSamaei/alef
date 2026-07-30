import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/chegall/studio/Button";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import {
  Listbox,
  ListboxLabel,
  ListboxOption,
} from "@/components/ui/chegall-listbox";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    // <select value={theme} onChange={(e) => setTheme(e.target.value)}>
    //   <option value="system">System</option>
    //   <option value="dark">Dark</option>
    //   <option value="light">Light</option>
    // </select>
    <Listbox
      className="bg-jarounTitleDark section-rounded border-none"
      name="tier-select"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <ListboxOption key={theme} value={theme}>
        <ListboxLabel>
          {theme === "dark" ? (
            <SunIcon className="h-4 w-4" />
          ) : (
            <MoonIcon className="h-4 w-4" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </ListboxLabel>
      </ListboxOption>
    </Listbox>
  );
};

export default ThemeSwitch;
