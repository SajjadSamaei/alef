# Alef Website

This repository contains the Alef Architecture Office website and CMS platform. Built with Next.js, Payload CMS, and bilingual content support for Persian (`fa`) and English (`en`), it serves the studio's portfolio, blog, team, and contact content.

## Features

- Next.js 16 App Router with React 19
- Payload CMS 3 with PostgreSQL backend
- `next-intl` localization for Persian and English
- S3-compatible media storage with public assets served from `https://storage.alef-office.ir`
- Custom Payload admin experience with grouped collections and global page settings
- Progressive Web App support, including `manifest.webmanifest`, `sw.js`, and offline fallback
- Image optimization, responsive media, and service-worker cache control

## Requirements

- Node.js 20+ (recommended)
- pnpm
- PostgreSQL database
- S3-compatible object storage (Liara-compatible in this project)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Copy `.env.example` or `.env` from the project root and set your environment values.

3. Start development:

```bash
pnpm dev
```

4. Open the application:

- Website: `http://localhost:3000`
- Payload admin: `http://localhost:3000/payload`

## Environment Variables

This project uses environment variables for database, storage, and email configuration. Typical values include:

- `POSTGRES_URL` / `DATABASE_URI`
- `PAYLOAD_SECRET`
- `S3_BUCKET`
- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_ENDPOINT`
- `S3_PUBLIC_URL`
- `NEXT_PUBLIC_S3_ENDPOINT`
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM`
- `NEXT_PUBLIC_SERVER_URL`
- `NEXT_PUBLIC_SITE_URL`
- `BASE_URL`

> Do not commit secrets to version control.

## Scripts

- `pnpm dev` — Run the Next.js development server
- `pnpm build` — Build the app for production
- `pnpm start` — Start the production server after build
- `pnpm lint` — Run ESLint
- `pnpm prod` — Build and start production

## Payload CMS

The CMS is mounted at `/payload` and supports the following content structure:

- Globals: `site-settings`, `landing-page`, `about-page`, `services-page`, `process-page`
- Collections: case studies, projects, team, blog posts, post authors, categories, media, and redirects
- Media collections for project images, team portraits, and shared page assets

The admin dashboard is configured with Persian and English labels, and content editors can work with either locale.

### Common Payload Tasks

Create or refresh management users:

```bash
ALEF_ADMIN_PASSWORD="a-strong-temporary-password" pnpm exec tsx scripts/create-management-users.ts
```

Seed site settings:

```bash
pnpm exec tsx scripts/seed-site-settings.ts
```

Verify media storage:

```bash
pnpm exec tsx scripts/verify-storage.ts
```

Optimize and prepare images:

```bash
node scripts/prepare-project-images.mjs
```

## Media Storage

Uploaded media is signed with the configured S3 endpoint and served publicly from the custom storage domain.

Example configuration:

```env
S3_ENDPOINT=https://storage.c2.liara.site
S3_PUBLIC_URL=https://storage.alef-office.ir
NEXT_PUBLIC_S3_ENDPOINT=https://storage.alef-office.ir
```

Public image URLs typically look like:

```text
https://storage.alef-office.ir/alef-cms/general-media/example.webp
```

## Localization

Supported locales:

- English: `en`
- Persian: `fa`

The website and Payload admin both support bilingual content. The site uses `next-intl` for runtime localization and message loading.

## PWA Support

The app includes:

- `manifest.webmanifest`
- service worker at `/sw.js`
- installable icons
- offline fallback page at `/offline.html`

The service worker excludes CMS and API routes from cache.

## Deployment

1. Ensure production environment variables are set:
   - `NEXT_PUBLIC_SERVER_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `BASE_URL`
   - `POSTGRES_URL`
   - `PAYLOAD_SECRET`
   - S3 storage values
2. Build the app:

```bash
pnpm build
```

3. Start the production server:

```bash
pnpm start
```

4. Verify the production site, assets, manifest, and offline fallback.

## Notes

- The app uses `@payloadcms/next` for integration with Next.js.
- `next.config.mjs` includes remote image patterns for `storage.alef-office.ir` and Liara storage hosts.
- `src/payload.config.ts` defines the CMS collections, globals, email adapter, and storage adapter.

## Documentation

Additional project documentation is available in `docs/payload-admin-guide-fa.md`.
