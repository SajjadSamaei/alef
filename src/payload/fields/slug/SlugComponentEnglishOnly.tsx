// src/payload/fields/slug/SlugComponent.tsx
"use client";

import React, { useCallback, useEffect } from "react";
import { useField, useFormFields, useLocale } from "@payloadcms/ui"; // Payload 3 UI hooks
import { formatSlug } from "./formatSlugEnglishOnly"; // Import your formatting logic
import { TextInput } from "@payloadcms/ui"; // Or your preferred input component

type Props = {
  fieldToUse: string;
  checkboxFieldPath: string;
  path: string; // The path of the slug field itself
  readOnly?: boolean;
};

export const SlugComponent: React.FC<Props> = ({
  fieldToUse,
  checkboxFieldPath,
  path,
  readOnly,
}) => {
  const { value, setValue } = useField<string>({ path });
  const { value: checkboxValue } = useField<boolean>({
    path: checkboxFieldPath,
  });
  const locale = useLocale(); // <--- 1. Get the current Admin Locale

  // Watch the "Title" field (or whatever fieldToUse is)
  const targetFieldValue = useFormFields(([fields]) => {
    return fields[fieldToUse]?.value as string;
  });

  useEffect(() => {
    // 2. CRITICAL FIX: Stop auto-generating if we are NOT in English
    // Change 'en' to your default locale code if it's different
    if (locale.code !== "en") {
      return;
    }

    // 3. Standard Logic: If locked and target exists, update slug
    if (checkboxValue) {
      if (targetFieldValue) {
        const formattedSlug = formatSlug(targetFieldValue);
        if (value !== formattedSlug) setValue(formattedSlug);
      } else {
        if (value !== "") setValue("");
      }
    }
  }, [targetFieldValue, checkboxValue, setValue, value, locale.code]);

  // Render the standard text input
  return (
    <div className="field-type text">
      <label className="field-label">Slug</label>
      <TextInput
        path={path}
        value={value || ""}
        onChange={(e: any) => setValue(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
};
