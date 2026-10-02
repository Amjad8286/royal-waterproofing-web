# Royal Waterproofing Co. — website

Marketing and lead-generation website for Royal Waterproofing Co., a waterproofing and leakage-repair company in Santacruz East, Mumbai. Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

Every page is statically generated. The only server code is the Server Action behind the enquiry form, which currently simulates delivery (see [Connecting the enquiry form](#connecting-the-enquiry-form)), and the API behind the [website assistant](#website-assistant), a chat that answers questions from the site's own content at no running cost.

> **Only real content is shown.** The site uses the confirmed business details (phone, WhatsApp, email, office address, Mumbai, free inspection). Invented sample content — projects, reviews, gallery, stats, ratings, warranty terms, team — is hidden until you replace it with the real thing; preview it with `npm run dev:preview`. Search engines are blocked until you turn indexing on. Run `npm run check:content` to see what's left before launch.

## Quick start

Requires Node.js 20.9 or later (developed on Node 24).

```bash
npm install
cp .env.example .env.local    # optional; defaults work for local development
npm run dev                   # http://localhost:3000 — the live site
npm run dev:preview           # the same, with sample content shown (badged)
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server (live site: sample content hidden) |
| `npm run dev:preview` | Development server in preview mode: sample projects, reviews, gallery and stats shown with "Sample" badges |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint (Next.js + React rules) |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |
| `npm test` | Unit tests (Vitest): form validation incl. Indian phone numbers, WhatsApp links, SEO helpers, content integrity, sample content hidden |
| `npm run test:e2e` | Builds the live site and a preview copy, then runs Playwright: every page (status, one `h1`, title, canonical, JSON-LD, axe WCAG 2.2 AA, no console errors, no horizontal scrolling down to 320px), links, a site-wide image scan, real contact details everywhere, navigation, the lead form, and the sample-content features, at desktop and phone sizes |
| `npm run check:content` | Launch gate: lists launch blockers (exits with an error until they're cleared) and the content still to add |
| `npm run docs:content` | Regenerates `docs/CONTENT_CHECKLIST.md` and `docs/PHOTO_SHOT_LIST.md` from the data |
| `npm run images:stock` | Downloads and crops the licensed stock photos into `public/images/photos/` |
| `npm run images:clients` | Downloads the client logos in use from Wikimedia Commons into `public/images/clients/`, trimmed to their artwork |
| `npm run images:meta` | Records size, blur placeholder and highlight brightness for every file in `public/images` (run after adding photos) |
| `npm run images:illustrations` | Regenerates the sample before/after illustrations (used only in preview mode) |
| `npm run brand:icons` | Rebuilds `apple-icon.png`, `favicon.ico` and the web app manifest icons (`public/icons/`) from `src/app/icon.svg` |
| `npm run screenshots -- <url> <outDir> <routes> <widths>` | Full-page screenshots for visual review |

First time running e2e tests: `npx playwright install chromium`.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Production URL, no trailing slash. Used for canonical URLs, the sitemap, Open Graph and structured data |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | `true` lets search engines index the site. Turn on at launch |
| `NEXT_PUBLIC_PREVIEW_SAMPLES` | `false` | `true` shows the invented sample content with "Sample" badges. For reviewing layouts only — never in production |
| `LEAD_SUBMIT_MODE` | — | Server-only. `error` makes every form submission fail, to preview the error state |
| `CHAT_MODEL_URL`, `CHAT_MODEL` | — | Server-only, optional. A self-hosted language model for the website assistant, e.g. `http://localhost:11434/v1` and `qwen3:4b-instruct`. See [Website assistant](#website-assistant) |
| `CHAT_MODEL_API_KEY` | — | Server-only, optional. Bearer token, if the model server sits behind a proxy that checks one |
| `CHAT_MODEL_TIMEOUT_MS` | `20000` | Server-only, optional. How long to wait for the model before answering from the content instead |

`NEXT_PUBLIC_*` values are baked in at build time, so rebuild after changing them.

## Project structure

```
src/
  app/            Routes (one folder per page), layout, 404/error pages, sitemap, robots, manifest, OG images, api/chat
  components/
    layout/       Top bar, navbar + mega-menu, mobile menu, footer, mobile action bar, WhatsApp button, breadcrumbs
    sections/     Page sections: heroes, problem finder, services grid, Mumbai conditions, sectors, process, FAQ, CTA band…
    cards/        Service, project, testimonial and team cards
    media/        SiteImage, before/after slider, gallery + lightbox, map facade, Mumbai zone map
    forms/        Enquiry form (compact + full) and field primitives
    chat/         Website assistant: floating button, chat window (loaded on first use), messages
    ui/           Button, badges, icons, logo, rating stars, filters
    seo/          JSON-LD
  config/site.ts  Business facts, CTA labels, trust points, process, feature flags, pending facts
  content/        Services, problems, sectors, clients, projects, reviews, FAQs, areas, team, gallery, image manifest, chat
  lib/            Content getters, sample filtering, relations, validation, Server Action, lead delivery, analytics, SEO, schema
    chat/         Website assistant engine: knowledge, search, optional self-hosted model, fact check, rate limit
  types/          Content model
scripts/          Stock photos, client logos, illustrations, image metadata, brand icons, content report, screenshots, e2e build
e2e/              Playwright tests (e2e/preview/ runs against the preview build)
docs/             Brief, plan, content checklist, photo shot list
```

## Editing content

- **Business details** (name, phone, WhatsApp, email, address, inspection offer, hours, response promise, rating, warranty) all live in `src/config/site.ts`. No component hard-codes them. Optional facts are `null` until you fill them in — business hours, for example, appear in the header, footer, contact page and structured data as soon as you set `hours`. When a fact is real, also remove its entry from `pendingFacts`.
- **Services** — `src/content/services.ts`. Each service page is built from its entry: signs, causes, systems, benefits, process, applications, cost factors, warranty, FAQs and related services.
- **Areas** — `src/content/areas.ts`: ten areas across Mumbai, Thane and Navi Mumbai, each with its own copy. Add or remove areas there; the pages, navigation, form, sitemap and map follow.
- **Projects, reviews, team, FAQs, sectors** — the matching files in `src/content/`. Records link to each other by slug. Unit tests fail if a slug or image id doesn't resolve.
- **Clients** — `src/content/clients.ts`, shown on the home page as "Our clients" in the order listed (best-known first; phones show the first ten, then a "Show all" button). A client with a `logo` shows it in greyscale (full colour on hover); everyone else is shown by name. Only add a client's logo with their permission: save the file in `public/images/clients/`, add it to `src/content/images.ts` with `source` set to where it came from, and run `npm run images:meta`. `npm run images:clients` re-downloads the three logos in use (official files from Wikimedia Commons).
- Pages read content through the async getters in `src/lib/content.ts`, so moving to a CMS later only means changing those functions.

### Real content only

Every invented item carries `placeholder: true`. The content getters drop those items on the live site, and sections with nothing real to show don't render: the before/after slider, projects list, testimonials and stats appear on their own once you add real projects, reviews and figures, and `/gallery` and `/reviews` (404 until then) join the navigation and sitemap automatically.

`npm run dev:preview` (or `NEXT_PUBLIC_PREVIEW_SAMPLES=true`) shows the samples with "Sample" badges so you can see the layouts. `docs/CONTENT_CHECKLIST.md` lists everything still to provide.

Never publish invented reviews, ratings, stats or credentials as real. The site deliberately emits no review or rating structured data.

## Images

All images go through `SiteImage` (which wraps `next/image`) and the manifest in `src/content/images.ts`.

- **Photos** are licensed stock photos from Pexels (free for commercial use, no attribution required), chosen to show Mumbai buildings, the monsoon and the problems the company fixes. **None show people**, and none are presented as the company's own work. `npm run images:stock` downloads and crops them; each manifest entry records its source in `credit`.
- **Illustrations** are sample before/after pairs for the sample projects and gallery. They're hidden on the live site.
- **Client logos** (`public/images/clients/`) are the clients' trademarks, used only with permission; each manifest entry records where the file came from in `source`.
- **No people in any image** — not in photos, illustrations, icons or logos. The e2e image scan fails if any page shows an image that isn't in the manifest.

To use your own photo:

1. Put the photo in `public/images/` (any folder name).
2. In `src/content/images.ts`, point `src` at it, rewrite `alt` to describe the photo, and remove `credit` (for project before/after photos, set `placeholder: false`).
3. Run `npm run images:meta`.

`docs/PHOTO_SHOT_LIST.md` says what each photo should show. Before/after pairs must be taken from the same spot so the slider lines up.

### Home hero slideshow

The photos, their order and their labels are in `src/content/hero.ts`. Each slide has a wide 16:9 photo and a 4:5 crop of the same photo for phones held upright (both in the manifest). The first slide loads with the page, so keep the strongest photo first. Bright photos are toned down automatically so the text stays readable — run `npm run images:meta` after swapping one.

### Logo and icons

- Logo: `public/images/brand/royal-waterproofing-logo.svg` (light backgrounds) and `royal-waterproofing-logo-reversed.svg` (navy backgrounds), rendered by `src/components/ui/logo.tsx`. They're a vector trace of the supplied logo; if you have the original artwork, save it under the same names.
- App icon: `src/app/icon.svg` — the script "R" from the logo over the logo's two waves on a navy tile, drawn for the square rather than cropped from the wide logo (the R is slightly thickened so it holds up at 16–32 px). After changing it, run `npm run brand:icons` to rebuild `apple-icon.png`, `favicon.ico` and the manifest icons in `public/icons/` (including a maskable one for Android).
- Colours: every colour is a token in `src/app/globals.css`, derived from the logo's blues. The few places CSS can't reach (share cards, browser theme colour, manifest) read `src/config/brand.ts`; a unit test fails if it drifts from the CSS or if a component hard-codes a colour.
- Share cards (`opengraph-image`) use the reversed logo automatically.

## Connecting the enquiry form

All forms submit through the Server Action in `src/lib/actions.ts`, which validates with the same Zod schema the browser uses (`src/lib/validation.ts`) and calls `submitLead()` in `src/lib/leads.ts`. That function is the only integration point: replace the marked block with an email (Resend, Postmark, SES), a CRM record, or a WhatsApp Business API notification. Keep API keys in server-only environment variables. **Until you do, form submissions aren't delivered anywhere** — calls and WhatsApp messages go straight to +91 97020 08187.

Already handled:

- Phone validation for Indian mobiles and landlines (with or without +91 / 0), and international numbers with a country code
- Spam protection with a honeypot field and a minimum time-to-submit check
- First-touch UTM attribution and the source page, sent with each lead
- Analytics events: `cta_click`, `call_click`, `whatsapp_click`, `form_start`, `form_submit_success`, `form_submit_error` go to `window.dataLayer` if Google Tag Manager is added

The form asks people to send photos on WhatsApp, because uploads would need storage. To accept uploads on the form, add direct-to-storage uploads (S3, R2 or similar) and set `features.photoUploads` to `true` in `src/config/site.ts`.

## Website assistant

A round chat button at the bottom right opens an assistant that answers questions about the company: services, symptoms, cost factors, inspections, areas, clients and how to get in touch. Like the WhatsApp button and the phone bar, it appears once the hero's buttons have scrolled away. On phones it sits above the quick-contact bar and opens full screen; on desktop it opens as a panel beside the page, next to the WhatsApp button.

**It costs nothing to run.** There's no AI subscription, API key or outside service, and no new dependency: it runs inside this Next.js app, on whatever already hosts the site.

### How it answers

Every answer comes from the site's own content:

1. `src/lib/chat/knowledge.ts` turns the services, FAQs, areas, symptoms, sectors, client list and contact details into about 150 short answers, each linked to the page it came from.
2. A small search index (`src/lib/chat/search.ts`: BM25 ranking, typo tolerance, and the synonyms and Hinglish words in `src/content/chat.ts`) finds the answer that fits the question. Follow-ups such as "how much does it cost?" lean towards the service being discussed, or the page the visitor is reading.
3. The API (`src/app/api/chat/route.ts`) returns that answer word for word, with links and Call / WhatsApp / inspection buttons.
4. When nothing in the content covers the question, it says "Sorry, I don't have that information" and gives the phone number. This includes facts not confirmed yet, such as warranty terms, ratings and years in business. It never uses sample (`placeholder`) content, even in preview mode, because an answer can't carry a "Sample" badge.

| Part | Where |
|---|---|
| Button, chat window, messages | `src/components/chat/` (the window's code loads on first open) |
| API: validation, rate limit (30 questions a minute per visitor) | `src/app/api/chat/route.ts` |
| Engine: knowledge, search, optional model, fact check | `src/lib/chat/` |
| What it says, suggests and knows on top of the content | `src/content/chat.ts` |

Questions are never stored or logged. The conversation is kept in the visitor's browser (session storage) until they close the tab or press "New chat". The privacy policy says so.

### Changing what it knows

New services, FAQs and areas are picked up automatically. In `src/content/chat.ts` you can:

- change the welcome message and the suggested questions (`chatWidget`);
- add answers (`chatKnowledge`): confirmed facts only, and mark anything unconfirmed `placeholder: true`;
- add other ways people ask a question the site already answers, when the assistant picks the wrong answer (`chatAlsoAsked`);
- add words people use for things (`chatSynonyms`), including Hinglish.

Run `npm test` afterwards. It checks that every suggested question gets an answer, that no sample content gets in and that every link points to a real page. To switch the assistant off, set `features.chatAssistant` to `false` in `src/config/site.ts`.

### Optional: a self-hosted language model

Without a model, answers use the content's own wording. To have them worded conversationally, run an open-weights model yourself and point the site at it:

1. Install [Ollama](https://ollama.com) (free and open source) on a machine the site's server can reach, and download a model: `ollama pull qwen3:4b-instruct`. This model is Apache 2.0 licensed and about 2.5 GB. It needs roughly 4 GB of free memory and runs on an ordinary CPU, faster with a GPU or Apple Silicon.
2. Set `CHAT_MODEL_URL=http://localhost:11434/v1` and `CHAT_MODEL=qwen3:4b-instruct` in `.env.local` (or the host's environment), and restart. These are server-only and never reach the browser.
3. Check it: `curl -s localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"question":"Is the inspection free?"}'`.

Any OpenAI-compatible server works, such as llama.cpp's `llama-server`, LM Studio or vLLM. Use a model running on your own machine, not a provider's cloud-hosted models.

The model never answers on its own:

- It only sees the answers that match the question, plus the confirmed company facts in `chatCompanyFacts`.
- It is told to reply `NO_ANSWER` when they don't cover the question.
- Its reply is checked before anyone sees it (`src/lib/chat/grounding.ts`). Any number, price, email, link, name or claim (warranty, rating, certification…) that isn't in those answers rejects the reply, and the assistant shows the content's own wording instead. The visitor's own words don't count as a source, so "is it ₹500?" can't come back as a price.
- If the model is down or slower than `CHAT_MODEL_TIMEOUT_MS`, the assistant also falls back to the content.

Rejections are logged as `[chat] model answer not used: …`, without the question.

Where to run it: on the same server as the site if you self-host, or on a machine you already own (an office PC or mini PC) behind a tunnel or reverse proxy. Don't expose Ollama's port to the internet; if it has to be reachable, put it behind a proxy that checks the `CHAT_MODEL_API_KEY` bearer token. If the site is on Vercel, the model needs a machine of its own: that machine is the only cost, so it's free only if you already have one. If you ever connect an outside AI service instead, update the privacy policy first, because it says questions aren't sent to one.

### Why not a "free" AI API?

As checked in October 2026 (these terms change):

- **Hosted free tiers come with caps and conditions.**
  - The [Gemini API](https://ai.google.dev/gemini-api/docs/rate-limits) free tier allows about 100–1,000 requests a day depending on the model, and its terms let Google use free-tier prompts to improve its products.
  - [Groq](https://console.groq.com/docs/rate-limits) caps free use per organisation, per minute and per day.
  - [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/) includes 10,000 "neurons" a day, then needs the paid Workers plan.
  - Each of these can change or end, and each sends visitors' questions to a third party.
- **In-browser models (WebLLM, Transformers.js) need no server**, but they download hundreds of megabytes to gigabytes onto the visitor's phone. That's wrong for someone on mobile data with a leaking ceiling.
- **"Always free" cloud servers can be withdrawn.** Oracle Cloud's free Arm servers could host the model, but [Oracle reclaims idle ones](https://docs.oracle.com/en-us/iaas/Content/FreeTier/resourceref.htm): under 20% CPU, network and memory use over 7 days, which is typical for a small business's chatbot.

## SEO

- Metadata on every route: title template, description, canonical URL, Open Graph and Twitter tags, plus generated share images (one per service) showing the phone number and location.
- Titles and headings name Mumbai; area pages cover ten areas across Mumbai, Thane and Navi Mumbai.
- Structured data: `HomeAndConstructionBusiness` sitewide (real address, phone, email, areas served), `Service` on service pages, `FAQPage` on the FAQ, service and area pages, and `BreadcrumbList` on inner pages.
- `sitemap.xml` and `robots.txt` are generated from content (pages with no real content are left out).
- **Indexing guard:** unless `NEXT_PUBLIC_ALLOW_INDEXING=true`, every page is `noindex` and `robots.txt` blocks all crawlers.

## Deploying

The site needs a Node.js runtime because of the Server Action and the assistant's API, so a static export won't work.

- **Vercel:** import the repository and set the environment variables above for Production. Nothing else to configure.
- **Self-hosted:** `npm ci && npm run build && npm start` behind a reverse proxy (Node 20.9+). `sharp` is installed for image optimisation.

At launch: clear the launch blockers (`npm run check:content` passes), connect the form, then set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ALLOW_INDEXING=true`, and redeploy.

## Quality notes

- **Accessibility:** WCAG 2.2 AA, checked by axe on every page in the e2e suite. Covers keyboard support, visible focus, a skip link, native `<dialog>` and `<details>`, and reduced-motion support.
- **Performance:** pages are static, client JavaScript is minimal, the stylesheet is cached across pages, fonts are self-hosted, photos are responsive WebP with blur placeholders, the map loads only on click, the chat window's code loads only when someone opens it, and only the first hero photo loads with the page (prioritised; the slideshow fetches each next photo after the page has loaded).
- **Browser support:** current Chrome, Edge, Firefox and Safari 16.4+.
