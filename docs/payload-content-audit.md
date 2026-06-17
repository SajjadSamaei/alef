# Payload Content Audit

## Content ownership

Use Payload for editorial content:

- Page heroes, introductions, body copy, statistics, quotes, calls to action
- Page-specific media
- Contact details and office information
- SEO titles, descriptions, and social images

Keep `next-intl` messages for interface language:

- Navigation labels
- Form labels, validation, loading and empty states
- Filter, sorting, pagination, search, and status labels
- Accessibility-only labels that describe controls
- Date and number terminology

Keep collections for repeatable records:

- Projects and case studies
- Blog posts and categories
- Team members
- Media and documents

## Performance model

Each static marketing page should read one localized Payload global through
`getCachedGlobal(slug, depth, locale)`.

The cache key includes:

- Global slug
- Locale
- Requested relationship depth

Payload `afterChange` hooks invalidate only the corresponding global tag.
Pages continue to use translation messages as fallback until a CMS field is
filled, which allows gradual migration without blank content.

## Route audit

### Home

Status: migrated.

Payload global: `landing-page`

Editable content now includes the hero, selected-project introduction, about
section, services introduction and labels, partners title, testimonial, and
existing media fields.

### Services

Status: migrated.

Payload global: `services-page`

Editable content now includes the hero, each service's title, subtitle,
description, detail heading, tags and image, plus the process CTA.

### Process

Status: migrated.

Payload global: `process-page`

Editable content now includes the hero and all four phase titles, subtitles,
paragraphs, detail headings, tags, and existing images.

### About

Status: next migration.

Create `about-page` global for:

- Hero
- Impact introduction and four statistics
- Values introduction and items
- Team introduction
- Culture introduction and items
- SEO

Team member records should remain in the `team` collection.

### Contact

Status: next migration.

Create `contact-page` global for:

- Hero and map heading
- Office description
- Email address
- Office locations and coordinates
- Social links
- SEO

Form labels and validation should remain in `next-intl`.

Hard-coded values currently include `info@chegall.com` and the accessibility
label `Email`.

### Blog

Status: partially dynamic already.

Posts and categories are correctly stored in collections. Add a small
`blog-page` global only for:

- Hero
- Latest-articles introduction
- Featured-series introduction and CTA
- SEO defaults

Search, archive, pagination, empty states, and relative-date labels should
remain translations.

### Portfolio

Status: partially dynamic already.

Case studies and project types are correctly stored in collections. Add a
`portfolio-page` global only for:

- Archive introduction
- Optional featured-project configuration
- SEO defaults

Filter, search, sorting, pagination, status, month, and year labels should
remain translations.

### Project, blog-post, and team detail pages

Status: already CMS-driven.

Primary content belongs to their existing collections. Only shared fallback
notices and interface labels should remain in translations.

### Header and footer

Status: partially CMS-driven.

Payload globals exist, but the public components still use many translation
messages and fixed contact/social values. Migrate organization-owned links,
contact details, and CTA copy into these globals while keeping control labels
translated.

## Remaining technical cleanup

- Resolve stale `.next/types` references to
  `PrefetchForTypeCheckInternal` so a clean `tsc --noEmit` succeeds.
- Add migrations for the new global fields before production deployment.
- Seed current English and Farsi translation values into Payload after the
  field structure is approved.
- Replace old `/work` links with the canonical portfolio/project routes.
