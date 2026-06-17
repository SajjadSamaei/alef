# Alef Architecture Office

The bilingual website and content platform for Alef Architecture Office. It presents the studio's projects, services, design process, team, and contact information in Persian and English.

## Stack

- Next.js 16 App Router and React 19
- Payload CMS 3 with PostgreSQL
- `next-intl` localization for Persian and English
- S3-compatible Liara object storage with `storage.alef-office.ir` as the public media domain
- Tailwind CSS and motion-based UI components
- Installable Progressive Web App with offline fallback

## Local Development

The app expects PostgreSQL and the S3 environment variables defined in `.env`.

```powershell
pnpm install
pnpm dev -- -p 4000
```

Open:

- Website: `http://localhost:4000`
- Payload admin: `http://localhost:4000/payload`

The admin dashboard is organized into Persian editorial groups for page content, projects and team, magazine content, media, and audience messages. Empty legacy collections remain registered for compatibility but are hidden from editors. Management users can edit site content but cannot manage user roles.

The Persian handover guide is available at `docs/payload-admin-guide-fa.md`. To create or repair the standard management accounts:

```powershell
$env:ALEF_ADMIN_PASSWORD="a-strong-temporary-password"
pnpm exec tsx scripts/create-management-users.ts
```

Payload accepts either the account email address or its unique username on the
admin login screen. The standard usernames are `admin`, `homayoun`, and
`shima`.

Self-service password reset requires a working email provider so the one-time
reset link can be delivered securely. This project uses the configured Resend
adapter. If email delivery is unavailable, an administrator must reset the
password directly from the Users collection or rerun the account provisioning
script with temporary passwords supplied through environment variables.

## Content Architecture

Fixed pages use Payload Globals:

- `site-settings`: contact details, social profiles, page availability, and static-page SEO
- `landing-page`: homepage copy, service images, about image, partners, testimonial, and social image
- `about-page`: the main studio/design-process image
- `services-page`: five service descriptions and images
- `process-page`: four process phases and their images

Repeatable content uses Payload Collections:

- `case-studies`: bilingual architecture projects and SEO
- `case-study-media`: project galleries and responsive image sizes
- `team` and `team-media`: staff profiles
- `posts` and blog collections: editorial content
- `media`: shared page imagery

Localized content is cached independently by global slug, locale, and depth. Payload `afterChange` hooks invalidate the relevant cache tags after editors save a page.

Payload labels and descriptions follow the admin-interface language. The content locale selector remains independent, so editors can use an English dashboard while editing Persian content, or vice versa.

Page switches in `site-settings` remove disabled pages from the main navigation and return a 404 for their index, archive, and detail routes. Redirects are managed in the visible `Redirects` collection under Site Settings and are compiled into Next.js routing during the production build. Rebuild and deploy after changing redirects.

Seed the current company details and page defaults with:

```powershell
pnpm exec tsx scripts/seed-site-settings.ts
```

## Media Storage

Uploads are signed against the private S3-compatible endpoint:

```env
S3_ENDPOINT=https://storage.c2.liara.site
```

Public URLs are generated against the custom bucket-root domain:

```env
S3_PUBLIC_URL=https://storage.alef-office.ir
NEXT_PUBLIC_S3_ENDPOINT=https://storage.alef-office.ir
```

The bucket name is deliberately omitted from public URLs. A stored image URL should look like:

```text
https://storage.alef-office.ir/alef-cms/general-media/example.webp
```

Run the end-to-end upload check with:

```powershell
$env:POSTGRES_URL="postgresql://..."
pnpm exec tsx scripts/verify-storage.ts
```

## Preparing Images

Project originals can be optimized with:

```powershell
node scripts/prepare-project-images.mjs
```

The script limits images to 2200 px and exports WebP files at an appropriate portfolio quality. Payload then creates thumbnail, card, medium, social, and large responsive variants.

Use descriptive alt text. Do not upload raw 30-50 MB renders directly to Payload.

## Progressive Web App

The app includes:

- Dynamic manifest at `/manifest.webmanifest`
- 192 px and 512 px install icons
- Standalone display mode and shortcuts
- Service worker at `/sw.js`
- Network-first page navigation
- Cached static assets, fonts, and public Alef media
- Offline fallback at `/offline.html`

Payload admin, API, and GraphQL routes are intentionally excluded from service-worker caching.

When changing caching behavior, update `CACHE_VERSION` in `public/sw.js` so existing installations discard the previous caches.

## Deployment Checklist

1. Set `NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_SITE_URL`, and `BASE_URL` to `https://alef-office.ir`.
2. Configure the PostgreSQL connection and Payload secret.
3. Configure the S3 endpoint, bucket, credentials, region, and public URL.
4. Confirm `https://storage.alef-office.ir` permits public reads and CORS access.
5. Run `pnpm exec payload migrate`.
6. Run `pnpm build`.
7. Verify the manifest, service worker, offline fallback, canonical metadata, sitemap, and robots file.
8. Upload a test image and confirm its public URL with `scripts/verify-storage.ts`.

## Editorial Guide

The Persian handoff guide for the company team is available at:

```text
docs/payload-admin-guide-fa.md
```
