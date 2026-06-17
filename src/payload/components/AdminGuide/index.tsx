"use client";

import { useTranslation } from "@payloadcms/ui";
import React from "react";

const quickLinks = [
  {
    href: "/payload/collections/case-studies",
    en: ["Manage projects", "Add projects, imagery, specifications, and SEO"],
    fa: ["مدیریت پروژه‌ها", "افزودن پروژه، تصاویر، مشخصات و سئو"],
  },
  {
    href: "/payload/globals/landing-page",
    en: ["Edit homepage", "Headings, services, imagery, and studio introduction"],
    fa: ["ویرایش صفحه اصلی", "تیترها، خدمات، تصاویر و معرفی دفتر"],
  },
  {
    href: "/payload/collections/alef-inquiries",
    en: ["New inquiries", "Review messages and audience contact details"],
    fa: ["درخواست‌های جدید", "بررسی پیام‌ها و اطلاعات تماس مخاطبان"],
  },
  {
    href: "/payload/collections/posts",
    en: ["Blog posts", "Write, translate, and publish articles"],
    fa: ["مطالب وبلاگ", "نوشتن، ترجمه و انتشار مقاله"],
  },
  {
    href: "/payload/collections/team",
    en: ["Team members", "Profiles, roles, portraits, and employment status"],
    fa: ["اعضای تیم", "پروفایل، سمت، تصویر و وضعیت همکاری"],
  },
  {
    href: "/payload/collections/media",
    en: ["General images", "Media for services, about, and process pages"],
    fa: ["تصاویر عمومی", "رسانه‌های صفحات خدمات، درباره و فرآیند"],
  },
];

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: 6,
  color: "inherit",
  display: "block",
  padding: 16,
  textDecoration: "none",
};

export default function AdminGuide() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  return (
    <div dir={isFa ? "rtl" : "ltr"} style={{ marginBottom: 32 }}>
      <section style={{ marginBottom: 28 }}>
        <p
          style={{
            color: "var(--theme-elevation-600)",
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          {isFa ? "دفتر معماری الف" : "Alef Architecture Office"}
        </p>
        <h1 style={{ marginBottom: 10, marginTop: 0 }}>
          {isFa
            ? "امروز چه چیزی را می‌خواهید به‌روزرسانی کنید؟"
            : "What would you like to update today?"}
        </h1>
        <p
          style={{
            color: "var(--theme-elevation-700)",
            lineHeight: 1.9,
            margin: 0,
            maxWidth: 820,
          }}
        >
          {isFa
            ? "مسیرهای پرکاربرد در ابتدای داشبورد قرار گرفته‌اند. برای محتوای دوزبانه، ابتدا زبان را از نوار بالای فرم انتخاب کنید و نسخه فارسی و انگلیسی را جداگانه ذخیره کنید."
            : "Frequently used areas are placed first. For bilingual content, choose the content locale at the top of the form and save Persian and English separately."}
        </p>
      </section>

      <section
        aria-label={isFa ? "دسترسی سریع" : "Quick access"}
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: 28,
        }}
      >
        {quickLinks.map((link) => {
          const [title, description] = isFa ? link.fa : link.en;
          return (
          <a href={link.href} key={link.href} style={cardStyle}>
            <strong style={{ display: "block", marginBottom: 6 }}>
              {title}
            </strong>
            <span
              style={{
                color: "var(--theme-elevation-600)",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              {description}
            </span>
          </a>
          );
        })}
      </section>

      <section
        style={{
          background: "var(--theme-elevation-50)",
          border: "1px solid var(--theme-elevation-150)",
          borderRadius: 6,
          padding: 20,
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 12, marginTop: 0 }}>
          {isFa ? "راهنمای کوتاه انتشار محتوا" : "Publishing checklist"}
        </h2>
        <ol style={{ lineHeight: 2, marginBottom: 12, marginTop: 0 }}>
          {(isFa
            ? [
                "هنگام بارگذاری تصویر، «متن جایگزین» را کوتاه و توصیفی بنویسید.",
                "برای هر پروژه یا مطلب، عنوان و توضیح سئو و تصویر اشتراک‌گذاری را تکمیل کنید.",
                "پیش از انتشار، هر دو زبان فارسی و انگلیسی را بررسی و سپس وضعیت را روی «منتشرشده» قرار دهید.",
                "فایل‌های تصویری پروژه را در «تصاویر پروژه‌ها» و تصاویر صفحات را در «تصاویر عمومی» بارگذاری کنید.",
              ]
            : [
                "Add concise, descriptive alt text to every uploaded image.",
                "Complete the SEO title, description, and sharing image for projects and posts.",
                "Review Persian and English before changing content to Published.",
                "Use Project Images for project files and General Images for page media.",
              ]
          ).map((item) => <li key={item}>{item}</li>)}
        </ol>
        <p
          style={{
            color: "var(--theme-elevation-600)",
            fontSize: 13,
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {isFa
            ? "Draft یعنی پیش‌نویس، Published یعنی منتشرشده و SEO اطلاعاتی است که در گوگل و هنگام اشتراک‌گذاری لینک نمایش داده می‌شود."
            : "Draft content is not public. Published content is visible on the site. SEO controls how pages appear in search and link previews."}
        </p>
      </section>
    </div>
  );
}
