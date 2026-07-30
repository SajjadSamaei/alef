"use client";

import { useState, useRef, useEffect } from "react";
import { useActionState } from "react";
import { submitInquiry } from "@/components/Forms/actions/chegall-inquiries-actions";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { ButtonCustomColor } from "@/components/ui/button";
import {
  TextInput,
  SelectInput,
  RadioInput,
  CheckboxInput,
} from "@/components/Forms/ui/FormInputs";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface InquiryState {
  message: string | null;
  success: boolean;
  fieldErrors?: Record<string, string>;
}

export function ContactForm() {
  const [formType, setFormType] = useState<"general" | "project">("project");
  const t = useTranslations("ContactForm");
  const locale = useLocale();

  // Reset form state when switching types
  const handleTypeChange = (type: "general" | "project") => {
    setFormType(type);
    // Optional: You could reset the server action state here if you wrap it in a context or similar,
    // but usually just swapping the view is enough.
  };

  const [state, formAction, isPending] = useActionState<InquiryState, FormData>(
    submitInquiry,
    { message: null, success: false },
  );

  // Scroll to top of form on Success to ensure they see the message
  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state.success]);

  // --- Options ---
  const sourceOptions = [
    "google",
    "social_media",
    "publication",
    "referral",
    "other",
  ];
  const projectTypes = [
    "residential",
    "commercial",
    "cultural",
    "hospitality",
    "renovation",
    "masterplan",
  ];
  const servicesOptions = [
    { key: "architecture", name: "services.architecture" },
    { key: "interior", name: "services.interior" },
    { key: "supervision", name: "services.supervision" },
    { key: "consultancy", name: "services.consultancy" },
  ];

  // --- Components ---

  const FormSwitcher = () => (
    <div className="mb-8 flex justify-center lg:justify-start">
      <div className="relative flex w-full max-w-sm rounded-full border border-neutral-200 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/80">
        <button
          type="button"
          onClick={() => handleTypeChange("project")}
          className={clsx(
            "relative z-10 w-1/2 rounded-full py-2.5 text-sm font-semibold transition-colors duration-300",
            formType === "project"
              ? "text-neutral-950 dark:text-white"
              : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
          )}
        >
          {t("switcher.project")}
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("general")}
          className={clsx(
            "relative z-10 w-1/2 rounded-full py-2.5 text-sm font-semibold transition-colors duration-300",
            formType === "general"
              ? "text-neutral-950 dark:text-white"
              : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
          )}
        >
          {t("switcher.general")}
        </button>
        <div
          className={clsx(
            "absolute inset-y-1.5 w-[calc(50%-6px)] rounded-full bg-white shadow-sm transition-transform duration-300 dark:bg-neutral-800",
            "start-1.5",
            formType === "general"
              ? "translate-x-full rtl:-translate-x-full"
              : "translate-x-0",
          )}
        />
      </div>
    </div>
  );

  const FormCard = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-neutral-50/50 dark:border-white/10 dark:bg-white/5">
      <div className="space-y-2 p-2 sm:p-4">{children}</div>
    </div>
  );

  // --- Success View (Prevents Layout Shift) ---
  const SuccessCard = () => (
    <div className="animate-in fade-in zoom-in-95 flex min-h-[500px] flex-col items-center justify-center rounded-[32px] border border-neutral-200 bg-neutral-50/50 p-8 text-center duration-500 dark:border-white/10 dark:bg-white/5">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircleIcon className="h-10 w-10" />
      </div>
      <h3 className="font-display text-2xl font-semibold text-neutral-950 dark:text-white">
        {t("success.title") || "Message Sent"}
      </h3>
      <p className="mt-4 max-w-md text-base text-neutral-600 dark:text-neutral-400">
        {t("success.description") || state.message}
      </p>

      {/* Optional: Button to reset/send another */}
      <button
        onClick={() => window.location.reload()} // Simple reload for now, or reset state if handling fully client-side
        className="mt-8 text-sm font-semibold text-neutral-950 underline decoration-2 underline-offset-4 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
      >
        {t("success.sendAnother") || "Send another message"}
      </button>
    </div>
  );

  const ProjectForm = () => (
    <FormCard>
      <input type="hidden" name="type" value="project" />
      <TextInput label={t("labels.name")} name="name" autoComplete="name" />
      <TextInput
        label={t("labels.email")}
        type="email"
        name="email"
        autoComplete="email"
      />
      <TextInput
        label={t("labels.phone")}
        type="tel"
        name="phone"
        autoComplete="tel"
      />
      <SelectInput label={t("labels.projectType")} name="projectType">
        {projectTypes.map((key) => (
          <option key={key} value={key}>
            {t(`options.projectTypes.${key}`)}
          </option>
        ))}
      </SelectInput>
      <TextInput label={t("labels.location")} name="location" />
      <TextInput label={t("labels.area")} name="area" />
      <div className="mt-4 border border-neutral-200 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
        <fieldset>
          <legend className="mb-4 text-sm font-semibold text-neutral-950 dark:text-white">
            {t("labels.servicesTitle")}
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {servicesOptions.map((opt) => (
              <CheckboxInput
                key={opt.key}
                label={t(`options.services.${opt.key}`)}
                name={opt.name}
              />
            ))}
          </div>
        </fieldset>
      </div>
      <TextInput
        label={t("labels.message")}
        name="project_message"
        className="mt-4"
      />
    </FormCard>
  );

  const GeneralForm = () => (
    <FormCard>
      <input type="hidden" name="type" value="general" />
      <TextInput label={t("labels.name")} name="name" autoComplete="name" />
      <TextInput
        label={t("labels.email")}
        type="email"
        name="email"
        autoComplete="email"
      />
      <TextInput
        label={t("labels.company")}
        name="company"
        autoComplete="organization"
      />
      <TextInput
        label={t("labels.phone")}
        type="tel"
        name="phone"
        autoComplete="tel"
      />
      <SelectInput label={t("labels.source")} name="source">
        {sourceOptions.map((key) => (
          <option key={key} value={key}>
            {t(`options.sources.${key}`)}
          </option>
        ))}
      </SelectInput>
      <TextInput label={t("labels.message")} name="message" className="mt-4" />
    </FormCard>
  );

  return (
    <FadeIn ref={formRef}>
      {/* Hide switcher if success */}
      {!state.success && <FormSwitcher />}

      {/* Show Error Message if exists (but not success) */}
      {state.message && !state.success && (
        <div className="animate-in fade-in zoom-in-95 mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
          {state.message}
        </div>
      )}

      {state.success ? (
        <SuccessCard />
      ) : (
        <form
          action={formAction}
          className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500"
        >
          <input type="hidden" name="locale" value={locale} />
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="px-1">
            <h2 className="font-display text-xl font-semibold text-neutral-950 dark:text-white">
              {formType === "project" ? t("project.title") : t("general.title")}
            </h2>
            <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
              {formType === "project"
                ? t("project.description")
                : t("general.description")}
            </p>
          </div>

          {formType === "project" ? <ProjectForm /> : <GeneralForm />}

          <div className="mt-8 flex justify-end">
            <ButtonCustomColor
              type="submit"
              disabled={isPending}
              className={clsx(
                "rounded-full bg-neutral-950 px-8 py-3 text-white transition-all hover:bg-neutral-800 disabled:opacity-50",
                "dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200",
              )}
            >
              {isPending ? t("labels.sending") : t("labels.submit")}
            </ButtonCustomColor>
          </div>
        </form>
      )}
    </FadeIn>
  );
}
