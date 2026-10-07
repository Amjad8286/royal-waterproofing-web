# Build plan — Royal Waterproofing Co. website

Companion to `docs/website-build-prompt.md` (the original brief). This file records how the site is built and every assumption or deviation.

- **Phase 1** built the full site with every business fact still unknown, using flagged sample content.
- **Phase 2 (October 2026)** turned it into the production site for a real Mumbai business: real contact details, Mumbai localisation, honest content, real photography with no people in it, and a design pass across every page.
- **Phase 3 (October 2026)** replaced the placeholder logo with the company's real logo everywhere, and turned the home hero into a photo slideshow (see "Home hero slideshow").
- **Phase 4 (October 2026)** rebuilt the colour system from the logo so the site and logo read as one brand, and redesigned the app icon (see "Brand colour system and app icon").
- **Phase 5 (October 2026)** added the home page client wall (see "Our clients").
- **Phase 6 (October 2026)** added the website assistant, a chat that answers from the site's own content at no running cost (see "Website assistant").
- **Phase 7 (October 2026)** connected the enquiry form to the ERP's lead API (see "Lead API").
- **Phase 8 (October 2026)** was an SEO and Core Web Vitals pass over the indexable build (see "SEO pass").

## Business facts

Confirmed and used as-is (`src/config/site.ts`):

| Fact | Value |
|---|---|
| Name | Royal Waterproofing Co. |
| Phone / WhatsApp | +91 97020 08187 (`tel:+919702008187`, `wa.me/919702008187`) |
| Email | info@royalwaterproofingco.com |
| Office | S-9, Adarsh Apartment, 7th Rd, Sen Nagar, Santacruz East, Mumbai, Maharashtra 400055 |
| Market | Mumbai, Thane and Navi Mumbai — India, Indian English, sq ft, monsoon |
| Inspection | Free ("Get Free Inspection" was requested as a CTA) |

Everything else is either `null` (hidden until provided — hours, response-time promise, year founded, map pin) or flagged `placeholder: true` (hidden on the live site). `pendingFacts` lists both; the ones marked `blocksLaunch` still affect what visitors see and need confirming (`npm run check:content`).

## Honest content (phase 2)

The brief said never to present invented data as real, and the phase 2 request said to remove anything placeholder-like. Both are satisfied by **hiding** sample content on the live site instead of badging it:

- The async getters in `src/lib/content.ts` drop `placeholder: true` records (projects, reviews, gallery items, team, stats, credentials, warranty FAQs) unless `NEXT_PUBLIC_PREVIEW_SAMPLES=true`.
- Sections render nothing when they have no real content (testimonials, stats, before/after, projects list, team, credentials, warranty block, unconfirmed hero facts and process timings).
- `/gallery`, `/reviews` and the sample case studies return 404 until real content exists; the navigation, footer and sitemap only link to pages that exist (`getAvailability()`).
- Preview mode (`npm run dev:preview`) shows everything with "Sample" badges for reviewing layouts. The e2e suite builds and tests both modes.
- Unconfirmed claims removed from visible copy: the "within 2 working hours" call-back promise, warranty lengths and the "written warranty" headline, the 4.9★ rating, the stats, and process timings. They come back automatically once confirmed in config.

## Sitemap

| Route | Rendering | Notes |
|---|---|---|
| `/` | static | Home |
| `/services` | static | Grouped services, problem finder |
| `/services/[slug]` | SSG ×9, `dynamicParams = false` | One data-driven template |
| `/projects` | static | Sectors ("who we work for"), process; real case studies appear above them once added |
| `/projects/[slug]` | SSG, real projects only | Case study |
| `/gallery`, `/reviews` | static | 404 until real photos / reviews exist |
| `/service-areas` | static | Twenty areas grouped by zone, schematic Mumbai map |
| `/service-areas/[area]` | SSG ×20 | Unique copy per area; each covers a cluster of neighbouring localities named in its intro |
| `/about`, `/faq`, `/contact` | static | |
| `/thank-you` | static, noindex | |
| `/privacy-policy`, `/terms` | static | Written for India (DPDP Act 2023, Mumbai courts); legal review still needed |
| `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, OG images, icons | generated | |

## Navigation

- Desktop: utility bar (office · region · urgent-call line · email · WhatsApp) + sticky header that condenses on scroll. Items: Services (mega-menu, 3 groups) · Projects (dropdown with Gallery once it exists) · About · Service Areas · Reviews (once real) · Contact · phone number (full from 1180 px, icon below) · primary CTA.
- Mobile: logo · call button · menu button → full-height dialog with Services expandable, office address and email, and Call / WhatsApp / CTA pinned at the bottom. Sticky Call / WhatsApp / Free Inspection bar after the hero.
- Breadcrumbs on all inner pages; full footer with services, company links, contact block (phone, WhatsApp, email, address with directions) and all areas.

## Conversion

CTA labels follow the phase 2 request: **Get Free Inspection** (primary — amber until phase 4, now the logo's wave blue), **Request a Quote** (secondary, same form — quotations follow an inspection), **Call Now**, **WhatsApp Us**. Trust points beside CTAs are confirmed facts only: free site inspection, written itemised quotation, based in Santacruz East, flats/societies/businesses.

## Design system

Kept from phase 1 until phase 4 replaced the colours (see "Brand colour system and app icon"): deep navy (strength, reliability), royal blue (the brand name, and water), amber for the primary CTA (construction safety colour), concrete neutrals, Barlow Semi Condensed + Public Sans. It already met the phase 2 brief ("waterproofing, protection, strength, reliability, professionalism"; not bright, playful or SaaS-like), so phase 2 refined the system rather than replacing it:

- Real photography in the home hero (a slideshow since phase 3, opening on the Mumbai skyline under monsoon clouds), service heroes and cards, sector cards, About and page heroes.
- New sections: "Built for Mumbai" (monsoon, wind-driven rain, heat, salt air — general climate facts, no company claims) and "Who we work for" (sectors).
- Service cards switch to a compact photo-beside-text layout on phones; card hover lift; area index grouped by zone; schematic Mumbai map with the office pinned and the current area highlighted.
- Process-step number rings match their section background.

## Logo and brand colours (phase 3)

- The supplied logo ("Royal" in script over two waves, with the WATERPROOFING CO. wordmark) arrived as a 1536×1024 PNG. It was traced into vector paths (colour-separated, so each colour is a clean shape) and lives in `public/images/brand/`: `royal-waterproofing-logo.svg` for light backgrounds and `royal-waterproofing-logo-reversed.svg` (white script and wordmark) for navy ones. If the original vector artwork exists, drop it in under the same names.
- Icon: the script "R" over the waves on a deep-blue tile — `src/app/icon.svg`, with `apple-icon.png` and `favicon.ico` generated from it by `npm run brand:icons`. It also serves as the logo in the business structured data.
- Used in the header (shrinks as the header condenses), mobile menu, footer (reversed), Open Graph cards (reversed) and the browser/app icons. The old crown-and-droplet mark and its typed wordmark are gone. The site has no login pages or loading screens (every page is static), so there was nothing to rebrand there.
- Brand colours from the logo: the royal blue token scale was re-centred on the logo's blue (`#034B8C`, same contrast as before), and the two wave colours became `wave-500` / `wave-300` for brand graphics only (the hero form's top edge and the slideshow progress bar). Navy and amber are unchanged.

## Brand colour system and app icon (phase 4)

Requested: derive the colours from the logo, remove what was left of the old theme, and replace the favicon, which looked like a crop of the logo.

**Palette.** The logo is three blues, and every colour now comes from them (OKLCH steps on the logo's hue, about 253°):

| Role | Token | Value |
|---|---|---|
| Primary — the script and wordmark | `royal-700` | `#034B8C` |
| Secondary — the front wave | `wave-500` | `#0282D3` |
| Accent — the back wave | `wave-300` | `#76CCFC` |
| Dark sections — the logo blue at its deepest (was a grey near-black, `#0B1A2E`) | `navy-900` / `950` | `#021D3C` / `#00132B` |
| Primary button — the front wave deepened for white text | `wave-600` | `#0B6FB9` |
| Neutrals — tinted toward the logo blue (were warm beige) | `concrete-50…500` | `#F9FBFC` … `#87929E` |

- **Amber is gone.** It came from the phase 1 placeholder brand and appeared in about 50 places (the CTA, eyebrows, icons, links and numbers on navy, the active nav underline, map pins, check marks). The primary button is now `wave-600` with white text (5.3:1); on navy the accent is `wave-300` (9.5:1 on `navy-900`); on white, icons and markers use `royal-700`; decorative rules, stars and quote marks use `wave-500`. A semantic `warning` pair remains for status notices only (both preview-only today).
- **Eyebrow motif.** The three amber "membrane layer" lines became the logo's two waves in miniature (`.wave-mark`), in their logo colours on both white and navy, and on the share cards.
- **Contrast.** Checked for every text/background pair in use: muted text at least 4.9:1, white/60 on navy 6.8:1, the warning text 5.5:1. `navy-950` keeps the old navy's luminance, so the hero text contrast measured over the photos in phase 3 still holds (the eyebrow's new colour has the same luminance as the old amber). Form controls now have a 3:1 border (`concrete-500`, WCAG 1.4.11); they were 1.6:1.
- **Tokens only.** Shadows are tinted from `navy-950` via `color-mix()` and named (`shadow-header`, `shadow-dock`, `shadow-lift`, …) instead of inline `rgb()` values. Select arrows are now a `ChevronDown` icon in navy (`SelectWrap`); the old inline SVG background never rendered, so selects had no arrow. The share card, browser `theme-color` and manifest read `src/config/brand.ts`; `src/lib/brand.test.ts` fails if it drifts from the CSS, if any amber token comes back, or if a component hard-codes a colour.
- **Logo files unchanged.** Their colours are already the palette's source, and the reversed logo sits naturally on the new navy, so no colour adjustment was needed.
- **Not changed:** the sample before/after illustrations (preview mode only). Their phase 1 colours appear only as props in the scenes (a box on a shelf), not as branding.

**App icon.** The old `icon.svg` was the whole logo clipped to a 540-unit square, which left a cut-off R, a stray flourish and waves chopped at the edges. The new one is composed for the square: the complete script "R" taken from the logo's own vector paths (slightly thickened so its hairlines survive at 16–32 px) over the logo's two waves, proportioned for the tile, with a navy gap between letter and waves as in the logo, on a `navy-900` tile with even padding. `npm run brand:icons` now also writes `public/icons/icon-192.png`, `icon-512.png` and a maskable `icon-maskable-512.png` (mark scaled into Android's safe zone), all listed in the web manifest; `apple-icon.png` stays full-bleed for iOS to round.

## Our clients (phase 5)

The owner supplied 31 clients for an "Our clients" / "Trusted by" section on the home page.

- **Placement:** straight after Services ("what we do", then "who we've done it for"), before Built for Mumbai. It's white between the concrete Services section and the navy Mumbai section, so the alternating rhythm holds without changing any other section.
- **Presentation:** a hairline-divided grid of equal tiles (six columns on wide screens, five on laptops, three on tablets, two on phones). Clients with a reliable logo show it in greyscale, sized by optical weight rather than by box (a square emblem and a 5:1 lockup look equally prominent), with its own colours on hover. Everyone else is set as a wordmark in the heading face (uppercase, muted ink, navy on hover), so the two kinds of tile read as one set. No autoplay marquee, which the brief rules out (§5) and which would add motion further down an already moving page.
- **Phones:** the first five rows (ten clients) and a "Show all 50 clients" button (three columns and fifteen on tablets). Every tile is in the HTML and visible without JavaScript; it only collapses after hydration, below the fold.
- **Logos — 37 of 50** (October 2026). Two sources:
  - From Wikimedia Commons, each sourced from the company's own website (public domain as text logos; still trademarks): Adani, Tata, Godrej & Boyce, Mahindra (the Mahindra wordmark, without the "Rise" tagline).
  - From the company's own website (the logo it publishes for light backgrounds): Navneet, SPJIMR, Capacit'e, Parsvnath, P. D. Hinduja Hospital (the hospital logo without the "Mahim" branch label), MJ Shah, Rustomjee, Dosti, Piramal (the group mark, which Piramal Realty shares), Kolte-Patil, Chandigarh University, Chandak. Vectors where the site has one; otherwise its PNG at the published resolution (never enlarged). MJ Shah's only vector is the white header version, coloured in the blue of its own colour logo.
  - `npm run images:clients` downloads them all, strips editor metadata, and trims each to its artwork; `source` in the manifest is the exact file each came from.
  - **Supplied by the owner** (`client-logo/`, 21 files, all used): Abrol, Alpine Vistara, ARCONS, Avanish, Balaji, Banka Infracon, Chandiwala, Dipti, Duville, IBC Developers, JK Associates, M.I. Construction, Morya, P & P, Poonam Highrise, Rashi, Runwal, SVKM, Suvidha, Tropicana, Yashpal. Each was matched by file name and checked against the logo's own text; where they differ (Alpine Vistara → Alpinepeak Developers, IBC Developers → India Builders Corp., Poonam Highrise → Poonam Group, Runwal → Runwal Realty) it's listed for the owner to confirm. `tropicana.png` is the Tropicana juice brand's wordmark (PepsiCo); it's used at the owner's request, and that the client is that brand is on the launch checklist.
  - **Clean-up of supplied files** (one-off, outside the repo's scripts; `source` in the manifest notes what changed per file): trimmed to the artwork with a 1% margin and capped at 320 px tall (never enlarged by resampling). Opaque white backgrounds keyed out exactly (the inverse of compositing over white, so colours look identical on white). Logos supplied only as white lettering for dark backgrounds (Banka Infracon, Duville, Tropicana, JK Associates' tagline) had the white set in charcoal (#3d3d3d), other colours untouched. The six that were too small for high-density screens — Duville (100×50), Dipti, P & P, Poonam, M.I. Construction and ARCONS — were upscaled ×4 with Real-ESRGAN (anime model, best for flat graphics): colour and transparency upscaled separately, with the colours padded outward first so thin strokes keep their exact colour (checked against the originals). ARCONS' ~6 px "Infrastructures & Constructions (P) Ltd" line came out with wrong letters from every model, so that strip is a plain enlargement of the original instead. Runwal's SVG had an invalid empty-fill frame removed and its viewBox trimmed.
  - **SVKM** is shown although its emblem includes a reading figure: the owner chose to exempt client logos from the no-people rule (AGENTS.md).
  - **Lower resolution:** Parsvnath's PNG is 43 px tall and Kolte-Patil's 111 px square, so they are slightly soft on high-density screens; replace them if the clients supply vector files.
  - **Still shown by name** (no file yet): Miles Infra, Narvane School, Nakta, Jatin Agro, IBC Knowledge Park, Adrika, Goregaon Electrical, Delhi Tropicana, KBS, KVD, Nadkar, Puja Poonam, Shree Gopal.
- **List cleanup:** "Royal Waterproofing Office" left out (the company's own office); "Ghree Gopal Housing Plantations" shown as "Shree Gopal" (assumed typo); names supplied in capitals written in normal case (the wall uppercases them visually); "SPJMIR" and "Rutomjee" spelt as the organisations spell them (SPJIMR, Rustomjee), matching their logos; a duplicate "Runwal" removed. Display order puts the best-known names first, then alphabetical.
- **To confirm before launch** (`pendingFacts` → `clients`, a launch blocker): permission to show the names and logos; that the four supplied logos whose text differs from the listed name are the right clients; that Tropicana is the juice brand whose logo was supplied; whether Tropicana / Delhi Tropicana and IBC Knowledge Park / IBC Developers are different clients; the Shree Gopal spelling. `docs/CONTENT_CHECKLIST.md` lists the clients still shown by name.
- **Tests:** unit tests catch duplicate clients, the company listing itself and broken logo references; an e2e test checks every client appears and the phone collapse/expand; the site-wide image scan covers the logos.

## Home hero slideshow (phase 3)

Requested in phase 3; a deliberate change from the brief, which ruled out autoplay carousels (§5) and carousel libraries (§11). It's built in-house (no dependency) and designed around the reasons that rule exists:

- **Only the photos change.** The headline, intro, CTAs, trust points and the inspection form stay put, so the message and the form never move while someone reads or types. Each photo is labelled on the slide picker ("Terraces & roofs", "Wall cracks"…), which turns it into a quick index of what the company deals with rather than a generic slider.
- **Motion:** 7 s per photo; the next photo fades in over the last while settling from a slight zoom (1.4 s). It pauses while the pointer is on the controls, while someone is in the form, and while the hero is off screen or the tab hidden; using the controls or swiping stops it until the play button is pressed. It never starts for people who prefer reduced motion. A visible pause button meets WCAG 2.2.2.
- **Accessibility:** the controls form a labelled carousel group (pause/play, previous, next, five photo buttons with `aria-current`); arrow keys move along them; a live region describes the photo when it's changed by hand (silent while playing). Text contrast was measured over every photo at 320–1920 px: at least 4.8:1 for the small amber eyebrow and 5.9:1 for the intro.
- **Even exposure:** `npm run images:meta` records how bright each photo's light areas are, and the hero lays more navy over bright photos and less over dark ones, so one light scrim keeps the text readable on all of them — including photos swapped in later.
- **Performance:** only the first photo is in the page HTML (eager, high priority — it's the LCP image); the next loads after the page has finished loading, one ahead, and none with Data Saver on. Phones and tablets held upright get a 4:5 crop through `<picture>` art direction (`SiteImage`'s `portrait` prop), as the brief's §9 asked; wide screens get 16:9 at up to 2400 px.
- **Layout:** desktop keeps the text column and the form side by side with the slide controls along the bottom. Phones get the photo behind the text with the CTAs still in the first screen, then the controls (swipe works too), then the form — the inspection form is now in the hero on phones as well, not only on desktop.
- Slides are content (`src/content/hero.ts`); their images are checked by the content-integrity test.

## Website assistant (phase 6)

Requested: an AI chatbot that answers questions about the company, services, areas and contact details, with no recurring AI or API cost (no paid OpenAI, Anthropic or Gemini API; open-source or self-hosted where possible), branded, responsive, and unable to make up business information.

**Approach: answers come from the content, a model is optional.** The brief's honesty rules mean an answer may only state what the site states. A language model, even a good one, can make things up, and this site has many plausible-sounding facts it must not state yet (warranty lengths, ratings, years in business, call-back times). So the assistant is built in two layers:

1. **Content first, always on.** `src/lib/chat/knowledge.ts` turns the content into about 150 answers (FAQs, symptoms → services, each service's overview, cost factors, process and causes, each area, contact details). A BM25 search index with typo tolerance and Indian English and Hinglish synonyms finds the best match, and the answer is shown word for word.
   - When too little of the question is covered, the reply is an honest "I don't have that information" with the phone number. Coverage counts the rare words that matter, and words the content never uses count against it.
   - It needs no model, no service and no dependency, answers in milliseconds and runs wherever the site runs (including Vercel).
2. **A self-hosted model, optional.** With `CHAT_MODEL_URL` and `CHAT_MODEL` set, an open-weights model on the owner's own machine words the answer (Ollama with `qwen3:4b-instruct`, Apache 2.0, suggested; any OpenAI-compatible server works).
   - It only sees the matching answers and the confirmed company facts.
   - Its reply is fact-checked: numbers, prices, emails, links, names and claim words must appear in those sources, and the visitor's own words don't count. Otherwise it's discarded and the content's wording is shown.
   - An unreachable or slow model falls back the same way.

**Rejected:**

- Hosted "free tiers" (Gemini, Groq, Cloudflare Workers AI): daily caps, terms that can change, and visitors' questions sent to a third party. Gemini's free tier also lets Google use prompts to improve its products.
- In-browser models (WebLLM): hundreds of megabytes to gigabytes downloaded on a phone.
- "Always free" cloud VMs as the default: Oracle reclaims idle instances. The README records the details and sources.

**Honesty:**

- The assistant never uses `placeholder` content, even in preview mode, where the site shows samples with badges, because an answer can't carry a badge. A unit test builds the knowledge in preview mode and checks every invented value in the content is absent.
- Owner-added answers live in `src/content/chat.ts` and follow the same rule.
- No ratings, reviews or warranty terms are stated. Asked about them, it says it doesn't know and gives the phone number.

**Design:**

- **Placement.** The button follows the site's persistent-CTA rule: it appears once the hero's buttons have scrolled away, so it never covers the hero.
  - On phones it rides above the quick-contact bar and steps aside while a form field has focus. The focus logic was extracted from `MobileActionBar` into `useFieldFocus`.
  - On desktop the WhatsApp button moves left to sit beside it.
- **Button and window.** The button is navy (the `wave-600` fill stays reserved for the primary CTA). The avatar is the logo's two waves on a navy disc, like the app icon. Suggested questions are pills, which the system allows for chips; everything else keeps the 4–6 px radius.
- **The window is a native `<dialog>`:**
  - a full-screen modal sheet on phones, which shrinks with the on-screen keyboard via `visualViewport`;
  - a modal card on tablets;
  - a non-modal panel on desktop, so the page stays usable; Escape closes it and focus returns to the button.
- **Messages.** Answers render as paragraphs and lists. The company's own phone number and email become links; nothing else does. Each answer carries links to its source page, Call / WhatsApp / inspection buttons, related questions, timestamps, a typing indicator and retry on errors.
- **History** lasts for the tab (session storage). The chat window's code loads on first open, so pages ship only the small button.

**Legal:** the privacy policy now covers the assistant (questions aren't stored or sent to an outside AI service; the conversation stays in the browser). The terms note that its answers are general guidance like the rest of the site.

**Tests:**

- Unit tests:
  - Every suggested question is answered.
  - Contact details, symptoms, cost factors, areas, follow-ups, page context, typos and Hinglish.
  - Honest fallbacks for off-topic and unconfirmed questions.
  - No sample content (live and preview).
  - Every link points to a real page and section.
  - The fact check, and the model path against a mocked OpenAI-compatible server (grounded, ungrounded, unreachable, "no answer", prompt injection).
  - API validation and the rate limit.
- e2e (`e2e/chat.spec.ts`):
  - Answering and the honest fallback with real contact links.
  - History across a reload, and starting again.
  - Full screen on phones; Escape and focus return on desktop.
  - axe with the chat open.
  - The API never returns unconfirmed claims.

**Verified at handover:**

- `npm run lint` and `npm run typecheck`: clean.
- `npm test`: 88 unit tests.
- `npm run test:e2e`: 131 passed, 29 skipped by design.
- Every page is still statically prerendered; only `/api/chat` is dynamic.
- Answers come back in about 30 ms without a model.
- The chat window is a separate 5.6 KB (gzipped) chunk loaded on first open, and no server code reaches the browser.

## Lead API (phase 7)

Requested: send enquiries to the ERP's lead API, as in `docs/API_NOTIFICATION_ARCHITECTURE.md` §5.5. Django saves each enquiry and sends the email and WhatsApp alerts; the website's part is in `src/lib/leads.ts` (the only file that calls it), the Server Action, the form and the privacy policy. Without `LEADS_API_URL` the form keeps simulating delivery, so development and e2e tests don't need Django.

Where it departs from the §5.5 reference implementation:

- **The visitor's IP is read in the Server Action** and passed to `submitLead()`, so `leads.ts` doesn't touch `next/headers` and is unit-tested with a mocked `fetch` alone. It must parse as an IP (`net.isIP`); without one, nothing is sent, because Django would refuse it.
- **Service and area names are looked up on the server** from the content, not sent by the browser.
- **Errors the visitor can't fix aren't shown as field errors.** Django's 400s on `Idempotency-Key`, `X-Client-IP` or hidden fields would have shown "Please check the highlighted fields" with nothing highlighted. They're logged and shown as the generic error with Call and WhatsApp buttons.
- **A `rate-limited` result**, rather than `server`, so analytics can tell the two apart (`form_submit_error` → `reason`).
- **The per-IP limit reuses the chat limiter** through a shared `createRateLimit()`, instead of a copy. It allows 5 enquiries in 10 minutes. `LEAD_TEST_HOOKS` turns it off, because the e2e tests all submit from one address.
- **`submissionId` is replaced after a success**, so a form restored with Back can send a second, different enquiry. It falls back to `getRandomValues`, because `randomUUID` needs HTTPS or localhost.
- **Redirects aren't followed** (`redirect: "error"`): an `http://` API URL redirected to `https://` would otherwise turn the POST into a GET.

**No WhatsApp opt-in box** (owner's decision, 6 Oct 2026). The first version had an unticked "Send me updates about this request on WhatsApp" box, as §5.5 asked. The owner had it removed so the form stays short and every customer gets the confirmation. The site now sends `whatsappOptIn: true` with every enquiry, controlled by `features.customerWhatsApp`. The privacy policy now names the enquiry system, the email provider and Meta (WhatsApp) as processors; says every enquiry gets a WhatsApp confirmation and that replying STOP ends it; mentions the IP address kept with each enquiry; and says enquiries are kept until deleted on request, as the owner decided.

## SEO pass (phase 8)

An audit of the indexable build (`NEXT_PUBLIC_ALLOW_INDEXING=true` with the production URL) found the foundations in place: every page static, one `h1` each, canonical URLs, clean URL variants (trailing slashes redirect, query strings canonicalise), no broken internal links and no orphan pages. It also found these problems, now fixed:

- **Duplicate title.** The home page and `/services` were both "Waterproofing Services in Mumbai". The home page is now "Waterproofing Company in Mumbai", the About page's own wording.
- **Wrong cities in structured data.** `areaServed` put Thane and Navi Mumbai inside Mumbai: the code compared the zone with "Thane", but the zone is "Thane & Navi Mumbai". It now lists the three cities (`site.market.cities`) as `City`, then each area page under its published name, without guessing a city for it (Dahisar & Mira Road spans two). `Service` lists the cities, since every service is offered in every area.
- **The per-service share cards were never used.** `buildMetadata()` hard-coded the site-wide image, which beats an `opengraph-image` in the page's own folder. A page's `openGraph` also replaces the image it would inherit, so leaving `images` out leaves most pages with none. `buildMetadata()` now takes a page's own card as `image` (service pages, with the service name as alt text) and uses the site-wide card otherwise.
- **Long area descriptions.** All twenty were 163–218 characters. `describeList()` keeps as many of the area's common problems as fit in 165, then the call to action if there's room.
- **Sitemap dates.** Every `lastmod` was the build time, which search engines learn to ignore. Each page's `lastmod` is now the day its content last changed.
  - `scripts/page-dates.mjs` fingerprints the live build: title, description, and the text, image alt text, links and structured data in `<main>`. The site URL is removed first, so local and production builds match.
  - It records the fingerprints and dates in `src/content/generated/page-dates.json`, which `sitemap.ts` reads. `npm run sitemap:dates` updates the file, and the e2e suite fails while it's out of date.
  - The first dates are 7 October 2026, the day this started, except for the legal pages, which use the "Last updated" dates they show.
  - `changefreq` and `priority` are gone: Google and Bing ignore both.
- **Image entries** in the sitemap list the company's own photos (no stock, samples or client logos) for the pages that show them. There are none yet, so they appear with the first real project photos.
- **robots.txt.** `/thank-you` was disallowed, so crawlers couldn't see its `noindex`. It's crawlable now, `/api/` is excluded, and the obsolete `Host:` line is gone.
- **Contradictory robots tags on 404s.** The layout's `index, follow` sat next to the `noindex` Next.js adds; `not-found.tsx` now sets `noindex` itself.
- **The floating WhatsApp button had no accessible name** (icon only). axe missed it because the button is `inert` until the hero scrolls away, so a navigation test checks it.
- **Indexing guard hardened.** Preview mode is never indexable, even with `NEXT_PUBLIC_ALLOW_INDEXING=true`, and `next.config.ts` stops an indexable build unless `NEXT_PUBLIC_SITE_URL` is an `https://` domain; otherwise canonicals and the sitemap would point at localhost.

Also added: `WebSite` structured data on the home page (the site name in search results); a 512px PNG as the business logo instead of the SVG app icon; AVIF images, which Next.js encodes to match WebP's visual quality and which came out 22–60% smaller for the photos measured (the phone hero photo: 83 → 48 KB); a FAQ `h1` that names waterproofing; an areas `h1` that names all three cities; and "Contact Us" at the start of the contact page title.

Decisions:

- **Area titles over 60 characters are kept** (10 of 20, up to 69). Every title carries the brand, which the e2e suite checks, and the area name comes first, so only the brand gets cut off in results.
- **No further robots.txt rules.** Router prefetch URLs (`?_rsc=`) return the page with its canonical tag, and so do query-string links such as `/contact?service=…`. Blocking either would stop crawlers seeing that canonical. AI crawlers are allowed, since being cited by AI assistants can bring enquiries; blocking them is the owner's call.
- **The e2e builds pin indexing off**, whatever `.env` says, because the suite tests the indexing guard.
- **`FAQPage` markup is kept.** Since 2023 Google shows FAQ rich results only for well-known government and health sites, but the markup is valid and describes the page.
- **Not changed:** the zod validation core is the largest script (35 KB gzipped), but the Server Action shares it by design. Next.js's own polyfills, which Lighthouse flags as legacy JavaScript, can't be removed. Hidden static pages (`/gallery`, `/reviews`) render their 404 in the browser from an empty initial body; that only affects visitors without JavaScript, on URLs nothing links to.

Verification: `npm run lint` and `npm run typecheck` clean; 122 unit tests pass; `npm run test:e2e`: 157 passed, 33 skipped by design. Page fingerprints matched across two builds and between a production build and a localhost build with indexing off, and editing one area's intro flagged only that area's page. A crawl of the indexable build found 39 pages with no duplicate titles or descriptions, every description at most 165 characters, a share image on every page, no JSON-LD errors and 73 internal links, all returning 200. Lighthouse (mobile) with DevTools throttling: LCP 1.6–1.9 s (home 2.1 → 1.9 s, home page weight 1,046 → 756 KiB), TBT about 0, CLS about 0. With simulated throttling, Performance went from 84 to 90 on the home page, 86 to 93 on About and 89 to 93 on Services, with the rest unchanged within noise. Accessibility, Best Practices and SEO score 100 on every page. Simulated LCP on localhost (3.1–3.7 s) overstates the real figure: every script finishes before first paint locally, so the simulation counts them as LCP dependencies.

## Images (phase 2)

- **No people anywhere.** Every photo was checked at full resolution for small figures on balconies, rooftops and streets; three candidates were dropped and the hero was cropped above a road. The illustration generator's figure drawings and the people/hands icons were removed. `e2e/images.spec.ts` fails if any page shows an image outside the reviewed manifest.
- **Stock photos** (Pexels licence: free commercial use, no attribution required) show Mumbai buildings, the monsoon and the problems the company fixes — damp walls, cracks with seepage stains, a leaking pipe, a wet basement car park. They illustrate services and are never presented as the company's own projects; the terms page says so. `scripts/stock-photos.mjs` re-creates them; each manifest entry has a `credit`.
- **Illustrations** remain only as sample before/after pairs for preview mode.
- **Phase 3 re-check:** the terrace service photo (Pexels 32809620, older Mumbai buildings with tarpaulins) turned out, at full size, to show a person on a balcony and another sitting in a window. It was removed everywhere and replaced with Pexels 27566315 (water tanks on a terrace under a grey sky), which also became the hero's terrace slide. Every hero crop was checked at full size.

## Content model

Defined in `src/types/content.ts`; data in `src/content/*`; read through async getters in `src/lib/content.ts`. Phase 2 added `Sector`, `ImageAsset.credit`, `FAQ.placeholder`, and made `ProcessStep.timing` optional. Relations are slug references; `src/lib/relations.ts` resolves them and is unit-tested so a broken reference fails the tests.

## Dependencies

Unchanged. Runtime: `next`, `react`, `lucide-react`, `react-hook-form`, `@hookform/resolvers`, `zod` (as `zod/mini`), `clsx`, `tailwind-merge`, `server-only`. Dev: `vitest`, `@playwright/test`, `@axe-core/playwright`, `tsx`, `sharp`. The website assistant (phase 6) added none: search, fact check and the optional model client are a few hundred lines in `src/lib/chat/`. Nor did the lead API (phase 7), which uses `fetch`.

## Assumptions and deviations

1. **Phase 0 approval pause skipped** (phase 1) — the owner asked to implement the plan directly.
2. **Sample content hidden, not badged** (phase 2) — see "Honest content". Showing it unbadged would mislead customers; badged, it looks unfinished.
3. **Projects page shows sectors until real case studies exist.** The request asked for project and gallery patterns, but publishing invented jobs as real isn't acceptable. The page describes the kinds of buildings the company works on and how each job runs (capabilities, not claims); the case-study explorer, slider and gallery are built and tested, and switch on with real content.
4. **WhatsApp assumed to be on the mobile number** (+91 97020 08187) — a launch blocker to confirm.
5. **Service areas** — twenty areas across Mumbai, Thane and Navi Mumbai, inferred from the Santacruz East office. A launch blocker to confirm. Seventeen Delhi areas were added on request as samples (`placeholder: true`): hidden on the live site until the owner confirms Delhi work, since the market is Mumbai-only and the map, `areaServed` and region copy would need Delhi versions.
6. **Urgent-leak call line kept** ("Leaking right now? Call us") — it only invites a call, but it's listed as a launch blocker to confirm.
7. **Photo uploads switched off** on the form (`features.photoUploads`) until the backend stores files; the form points people to WhatsApp instead, which does reach the business.
8. **Phone validation** accepts Indian mobiles and landlines (with or without +91 / 0) and international numbers with a country code (NRI owners of Mumbai flats).
9. **Business hours unknown** — hidden everywhere (top bar, footer, contact page, structured data) until set.
10. **CSS is no longer inlined** (phase 1 used `experimental.inlineCss`). Inlining also copies the CSS into every page's React payload; with the richer phase 2 pages, an external, cacheable stylesheet measured the same or better in Lighthouse.
11. **Form pre-fill reads `window.location.search` in an effect**, `zod/mini`, absolute home title, Next.js 16 APIs — unchanged from phase 1.
12. **Production domain** assumed to match the email domain (royalwaterproofingco.com) — set `NEXT_PUBLIC_SITE_URL` once confirmed.
13. **Autoplay hero slideshow** (phase 3) — requested by the owner, against the brief's no-autoplay-carousel rule. Built to the constraints in "Home hero slideshow": a fixed message and form, a pause button, pauses on interaction, nothing for reduced-motion users, no library.
14. **Logo traced from a PNG** (phase 3) — the vector files are a faithful trace of the supplied image, not the designer's originals. Replace them if the original artwork turns up.
15. **Primary CTA is blue, not amber** (phase 4) — the brief (§5) reserved amber for the primary CTA. The owner asked for a palette drawn from the logo with the old theme's colours removed, so the CTA uses the logo's wave blue. It stays the only `wave-600` fill on the page, and it's the most saturated element on white sections, so it still stands out.
16. **A chat widget** (phase 6) — the brief didn't include one. It follows the brief's persistent-CTA rules (appears after the hero, never covers the hero's CTAs, clear of the quick-contact bar) and its honesty rules (answers only from confirmed content; see "Website assistant").

## Verification at handover (phase 2)

- `npm run lint`, `npm run typecheck`: clean.
- `npm test`: 36 unit tests passing (validation incl. Indian numbers, WhatsApp links, SEO helpers, content integrity, sample content hidden on the live site).
- `npm run test:e2e`: 107 passed, 21 skipped by design (viewport-specific or run-once checks). Live build: every route (status, one `h1`, title, canonical, JSON-LD, axe WCAG 2.2 AA, no console errors), links, the site-wide image scan, real contact details on every call/WhatsApp/email link, the old placeholder details and invented claims absent from every page, hidden pages returning 404, navigation, lead form, SEO guards. Preview build: filters, slider, lightbox, badges and its own image scan.
- Lighthouse (mobile, simulated throttling): Performance — home 89, services 94, service page 90–92, projects 91–94, area page 94, about 91, contact 95, FAQ 94. Accessibility and Best Practices 100 on every page; CLS 0. SEO shows 66–69 only because indexing is deliberately blocked until launch (the single failing audit is "page is blocked from indexing").
- `npm run check:content`: exits with an error while the six launch blockers above remain.
