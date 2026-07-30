"use server";

import { z } from "zod";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getTranslations } from "next-intl/server";

// --- Regex Definitions ---
// Permissive regex that allows Farsi, English, numbers, and common punctuation
const textRegex = /^[\u0600-\u06FF\u06F0-\u06F9a-zA-Z0-9\s.,!?'"()&\-\n\r]+$/;

// 1. Schema Factory
const createLocalizedSchema = (t: any) => {
  const textRegexMessage = t("validation.textOnly");

  // Shared fields for both forms
  const baseSchema = {
    name: z
      .string()
      .min(2, t("validation.nameRequired"))
      .refine((val) => textRegex.test(val), { message: textRegexMessage }),
    email: z.string().email(t("validation.emailInvalid")),
    phone: z.string().min(5, t("validation.phoneRequired")), // Basic length check
  };

  // Schema A: General Inquiry
  const generalInquirySchema = z.object({
    type: z.literal("general"),
    ...baseSchema,
    company: z.string().optional(),
    message: z
      .string()
      .min(10, t("validation.messageMin"))
      .refine((val) => textRegex.test(val), { message: textRegexMessage }),
    source: z.enum([
      "google",
      "social_media",
      "referral",
      "publication",
      "other",
    ]),
  });

  // Schema B: Architectural Project Inquiry
  const projectInquirySchema = z.object({
    type: z.literal("project"),
    ...baseSchema,
    // Project Specifics
    projectType: z.enum([
      "residential",
      "commercial",
      "cultural",
      "hospitality",
      "renovation",
      "masterplan",
    ]),
    services: z.object({
      architecture: z.boolean(),
      interior: z.boolean(),
      supervision: z.boolean(),
      consultancy: z.boolean(),
    }),
    location: z
      .string()
      .min(2, t("validation.locationRequired"))
      .refine((val) => textRegex.test(val), { message: textRegexMessage }),
    area: z.string().optional(), // Allow free text like "500 sqm" or "approx 200m"
    project_message: z
      .string()
      .optional()
      .refine((val) => !val || textRegex.test(val), {
        message: textRegexMessage,
      }),
  });

  return z.discriminatedUnion("type", [
    generalInquirySchema,
    projectInquirySchema,
  ]);
};

interface InquiryResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

export async function submitInquiry(
  prevState: any,
  formData: FormData,
): Promise<InquiryResult> {
  // 1. Extract raw data
  const rawData = Object.fromEntries(formData.entries());

  // 2. Handle Multi-select Checkboxes manually
  // FormData handling for checkboxes like 'services.architecture' needs care
  // We'll construct the object manually to match the Schema structure
  const type = rawData.type as "general" | "project";

  let payloadData: any = {
    ...rawData,
    // Ensure booleans are actually booleans, not "on" strings
    services:
      type === "project"
        ? {
            architecture: formData.get("services.architecture") === "on",
            interior: formData.get("services.interior") === "on",
            supervision: formData.get("services.supervision") === "on",
            consultancy: formData.get("services.consultancy") === "on",
          }
        : undefined,
  };

  // 3. Get Locale & Translations
  const locale = (formData.get("locale") as string) || "en";
  const t = await getTranslations({ locale, namespace: "ContactForm" });

  // 4. Validate
  const schema = createLocalizedSchema(t);

  // Honeypot check
  if (rawData["bot-field"]) {
    return { message: t("success.formSent"), success: true };
  }

  try {
    const validatedData = schema.parse(payloadData);

    const payload = await getPayload({ config: configPromise });

    await payload.create({
      collection: "alef-inquiries", // Ensure this matches your Payload Collection Slug
      data: validatedData,
    });

    return {
      message: t("success.formSent"),
      success: true,
    };
  } catch (error: unknown) {
    console.error("Submit error:", error);

    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return {
        success: false,
        message: t("error.validation"),
        fieldErrors: Object.fromEntries(errors.map((e) => [e.path, e.message])),
      };
    }

    return {
      success: false,
      message: t("error.generic"),
      fieldErrors: {},
    };
  }
}
