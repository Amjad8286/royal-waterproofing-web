<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project conventions — Royal Waterproofing Co.

Read `docs/website-build-prompt.md` (the brief) and `docs/PLAN.md` (decisions and deviations) before changing anything substantial.

## Content and honesty
- Business facts live only in `src/config/site.ts`; content lives in `src/content/*`. Components never hard-code business details, prices or claims.
- Real contact details: +91 97020 08187, info@royalwaterproofingco.com, S-9, Adarsh Apartment, 7th Rd, Sen Nagar, Santacruz East, Mumbai 400055. Market: Mumbai, Thane and Navi Mumbai (Indian English, "flat", "society", "monsoon").
- Anything invented is flagged `placeholder: true` (or kept `null` / listed in `pendingFacts`). The content getters hide it on the live site; it only appears, badged, in preview mode (`NEXT_PUBLIC_PREVIEW_SAMPLES=true`). Sections and pages without real content render nothing (or 404) rather than look empty. Never present sample data as real, and never invent ratings, reviews, stats, warranties, certifications or years in business. No `Review`/`AggregateRating` structured data.
- After changing content, run `npm test` (catches broken slug/image references) and `npm run docs:content` (keeps the checklist and shot list in sync).

## Images
- No people anywhere: no workers, staff, customers, hands or human figures — not in photos, illustrations or icons. Use buildings, surfaces, materials, tools and Mumbai architecture. Check stock photos at full size for small figures on balconies, rooftops and streets before adding them.
- Client logos are third-party trademarks: add one only for a confirmed client, from an official source, with permission, recorded in `source`. Clients without a reliable logo are shown by name — never guess a logo for an ambiguous name.
- Every image goes through `SiteImage` and the manifest in `src/content/images.ts`. Stock photos carry a `credit`, are downloaded and cropped by `scripts/stock-photos.mjs`, and are never presented as the company's own work. `e2e/images.spec.ts` fails if a page shows an image that isn't in the manifest.
- Run `npm run images:meta` after adding files to `public/images/` (it also records each photo's highlight brightness, which the home hero uses to even out its photos).
- The logo is `Logo` (`src/components/ui/logo.tsx`) over the SVGs in `public/images/brand/`; never re-create it in code. The app icon is `src/app/icon.svg` (the logo's "R" over its two waves, composed for a square tile, not cropped from the logo); run `npm run brand:icons` after changing it.
- Home hero slides are content in `src/content/hero.ts`: each needs a 16:9 photo and a 4:5 portrait crop of it, both in the manifest.

## Code
- Server Components by default; `"use client"` only for interactive leaves. Client components must not import `@/lib/content` (it pulls all content into the bundle). Pass data or pre-rendered nodes as props instead.
- Pages read content through the async getters in `src/lib/content.ts`.
- Next.js 16: `params`/`searchParams` are Promises; images use `preload`/`loading`/`fetchPriority`, not `priority`; error boundaries receive `retry`, not `reset`. Filters read the URL with `useSearchParams` inside `<Suspense>` so pages stay static.
- Forms: one Zod (`zod/mini`) schema in `src/lib/validation.ts` is shared by React Hook Form and the Server Action (Indian phone numbers, or international with a country code). Lead delivery is isolated in `src/lib/leads.ts`.

## Website assistant (chat)
- It answers only from the site's content: `src/lib/chat/knowledge.ts` derives its answers from `src/content/*` and `src/config/site.ts`, and `src/content/chat.ts` holds its wording, suggestions and extra answers. Never put an unconfirmed fact there; mark it `placeholder: true`. The assistant ignores placeholder content even in preview mode, because an answer can't carry a "Sample" badge.
- When a question isn't covered, it must say so and give the phone number. Don't lower the confidence thresholds in `src/lib/chat/engine.ts` to make it answer more; add `chatAlsoAsked` phrasings or synonyms instead.
- No paid or hosted AI APIs. The optional model is self-hosted, configured only by server-only `CHAT_MODEL_*` env vars, and every reply must pass the fact check in `src/lib/chat/grounding.ts`. The privacy policy says questions aren't sent to an outside AI service.
- The client widget (`src/components/chat/`) gets its text as props from the layout and talks only to `/api/chat`; it must not import `@/lib/chat/knowledge` or `@/lib/content`.

## Design system
- Tokens are defined once in `src/app/globals.css` (`@theme`) and come from the logo's three blues: `royal-700` (script and wordmark), `wave-500` (front wave) and `wave-300` (back wave); navy is the same blue at its deepest and concrete neutrals are tinted toward it. Tailwind's default palette is removed, so use brand tokens only (navy, royal, wave, concrete, ink, plus success/warning/danger for status messages). No colour values in components: share images and theme colours read `src/config/brand.ts`, which `src/lib/brand.test.ts` keeps in step with the CSS.
- The primary conversion button is `wave-600` with white text (`Button` variant `primary`); don't use a `wave-600` fill for anything else. WhatsApp green only on WhatsApp controls.
- On white: links, icons and markers in `royal-700`. On navy: the accent is `wave-300` (eyebrows, icons, links, small markers with navy text). `wave-500` is for brand graphics only (wave mark, rules, active underline) and is never text; `wave-300` is never text on white.
- Eyebrows start with the wave mark (the logo's two waves in miniature, `.wave-mark`).
- Radius 4px (6px max; pills only for chips and badges). Headings use Barlow Semi Condensed; body text uses Public Sans.
- Sections on navy add `tone-navy` so the focus ring switches to `wave-300`.

## Before finishing a change
`npm run lint && npm run typecheck && npm test && npm run test:e2e` — the e2e suite builds the live site and a preview copy first, then checks every page (including axe accessibility and the image scan) and the sample-content features.
