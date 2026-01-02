"use client";
import React, { useState, ReactNode } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useDirection } from "@/utils/hooks/useDirection";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

// --- Types ---
interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  className?: string; // Added for extra flexibility
}

export const TextInput = ({
  label,
  name,
  type = "text",
  autoComplete,
  className,
}: TextInputProps) => {
  const direction = useDirection();
  return (
    <div
      dir={direction}
      className={cn(
        "group relative z-0 transition-all focus-within:z-10",
        className,
      )}
    >
      <input
        id={name}
        name={name}
        type={type}
        placeholder=" "
        autoComplete={autoComplete}
        className={cn(
          // Base Layout & Typography
          "peer block w-full pt-12 pb-4 text-base text-neutral-950 placeholder:text-transparent focus:outline-none",
          // Logical Properties for RTL
          "ps-6 text-start",
          // AESTHETIC UPDATE:
          // 1. Lighter Border (neutral-200)
          // 2. Subtle Background (neutral-50/50)
          // 3. Dark Mode Support
          "border border-neutral-200 bg-neutral-50/50 dark:border-white/10 dark:bg-white/5 dark:text-white",
          // Focus State
          "focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950/5 dark:focus:border-white dark:focus:ring-white/10",
          // Group Radius Logic (Kept from original, ensures stacked inputs look connected)
          "group-first-of-type:rounded-t-[32px] group-last-of-type:rounded-b-[32px]",
        )}
      />
      <label
        htmlFor={name}
        className={cn(
          "pointer-events-none absolute top-1/2 -mt-3 text-base text-neutral-500 transition-all duration-200",
          // Logical Positioning
          "origin-start start-6",
          // Dark Mode Text
          "dark:text-neutral-400",
          // Floating Label Logic
          "peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-neutral-950 dark:peer-not-placeholder-shown:text-white",
          "peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950 dark:peer-focus:text-white",
        )}
      >
        {label}
      </label>
    </div>
  );
};

// --- Types ---
interface SelectInputProps {
  label: string;
  name: string;
  children: ReactNode;
}

export const SelectInput = ({ label, name, children }: SelectInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const direction = useDirection();
  const t = useTranslations("ContactForm");

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setValue(e.target.value);

  return (
    <div
      dir={direction}
      className="group relative z-0 transition-all focus-within:z-10"
    >
      <select
        id={name}
        name={name}
        required
        className={cn(
          "peer block w-full appearance-none pt-12 pb-4 text-base text-neutral-950 focus:outline-none",
          "ps-6 text-start",
          // Aesthetic Update (Matches TextInput)
          "border border-neutral-200 bg-neutral-50/50 dark:border-white/10 dark:bg-white/5 dark:text-white",
          "focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950/5 dark:focus:border-white",
          "group-first:rounded-t-[32px] group-last:rounded-b-[32px]",
        )}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      >
        <option value="" disabled hidden>
          {isFocused ? t("selectPlaceholder") : ""}
        </option>
        {children}
      </select>

      <label
        htmlFor={name}
        className={cn(
          "pointer-events-none absolute top-1/2 -mt-3 text-base text-neutral-500 transition-all duration-200",
          "origin-start start-6",
          "dark:text-neutral-400",
          "peer-valid:-translate-y-4 peer-valid:scale-75 peer-valid:font-semibold peer-valid:text-neutral-950 dark:peer-valid:text-white",
          "peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950 dark:peer-focus:text-white",
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 flex items-center",
          "end-0 pe-6", // Increased padding for cleaner look
        )}
      >
        {isFocused ? (
          <ChevronUpIcon className="h-5 w-5 text-neutral-950 dark:text-white" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-neutral-400" />
        )}
      </div>
    </div>
  );
};

// --- Types ---
interface RadioInputProps {
  label: string;
  name: string;
  value: string | number;
}

export const RadioInput = ({ label, name, value }: RadioInputProps) => (
  <div className="flex items-center gap-x-3">
    <input
      id={`${name}-${value}`}
      name={name}
      type="radio"
      value={value}
      className={cn(
        "h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900",
        "dark:border-neutral-600 dark:bg-white/5 dark:checked:bg-white dark:focus:ring-white",
      )}
    />
    <label
      htmlFor={`${name}-${value}`}
      className="block text-sm leading-6 font-medium text-neutral-900 dark:text-neutral-200"
    >
      {label}
    </label>
  </div>
);

// --- Types ---
interface CheckboxInputProps {
  label: string;
  name: string;
}

export const CheckboxInput = ({ label, name }: CheckboxInputProps) => (
  <div className="relative flex items-start">
    <div className="flex h-6 items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900",
          "dark:border-neutral-600 dark:bg-white/5 dark:checked:bg-white dark:focus:ring-white",
        )}
      />
    </div>
    <div className="ms-3 text-sm leading-6">
      <label
        htmlFor={name}
        className="font-medium text-neutral-900 dark:text-neutral-200"
      >
        {label}
      </label>
    </div>
  </div>
);
