<!-- Fill in section 1 (replace every TBD you can), then give this whole file to your coding agent, e.g. "Read docs/website-build-prompt.md and follow it." -->

# Royal Waterproofing Co. — Website Build Brief

## 0. Role, goal, scope

You are a senior Next.js engineer and conversion-focused UI/UX designer who has shipped websites for construction and home-service companies.

Build the complete, production-quality marketing website for **Royal Waterproofing Co.**, a waterproofing contractor serving homeowners, housing societies and property managers, commercial buildings, builders, and industrial facilities.

The site's job is to **turn visitors into booked inspections** while making the company look established, competent, and trustworthy. Use this test for every decision: a visitor with a leaking ceiling, on a phone, should understand what we fix, believe we're good at it, and be able to call, WhatsApp, or send a request within 30 seconds — from any page.

**Scope:** frontend and content structure only. No real backend, CMS, auth, or payments. Use typed local content and a mocked lead-submission function designed to be swapped for a real integration later.

## 1. Business facts (single source of truth)

```yaml
# Replace TBD values where you can. Anything left TBD becomes flagged placeholder data (§8).
business_name: Royal Waterproofing Co.
legal_name: TBD
country: TBD                 # drives copy, phone/address formats, units, currency, seasons
primary_city: TBD
areas_served: [TBD]          # only areas genuinely served — each gets a landing page
phone: TBD
whatsapp_number: TBD         # international format, digits only
email: TBD
office_address: TBD
google_maps_link: TBD
business_hours: TBD
urgent_leak_service: TBD     # yes/no, and hours
inspection_offer: TBD        # e.g. "Free site inspection" — only if it really is free
response_time_promise: TBD   # e.g. "We call back within 2 working hours"
founded_year: TBD
stats: TBD                   # projects completed, area treated, etc.
warranty_terms: TBD          # per service: duration, what's covered, conditions
certifications_licences_insurance: TBD
material_brands_used: TBD    # brand names/logos appear only if confirmed and permitted
google_business_profile_url: TBD
social_links: TBD
languages: [English]
currency_and_units: TBD      # e.g. currency + sq ft or m²
production_domain: TBD
existing_logo_or_brand_colours: none
```

Rules:
- Put all of this in one typed config (`src/config/site.ts`). No component hard-codes business details.
- For TBD contact details, use obviously fake values (`hello@example.com`, `+00 0000 000000`) — never a plausible real phone number.
- If `primary_city` or `areas_served` is TBD, use neutral copy ("in your area") and six flagged sample areas with generic names.
- Adapt terminology, phone and address formats, units, currency, and seasonal messaging (e.g., getting ready before the rainy season) to `country`.

## 2. Audience and conversion strategy

### Who visits (design for all; optimize for the first)
1. **Urgent homeowner:** active leak or damp, on mobile, usually landing on a service or area page from search. Needs a phone number and WhatsApp right away, reassurance, and a fast response.
2. **Planning homeowner:** preventive work before the rains or during renovation. Needs to understand what's wrong, how we fix it, the process, warranty, cost factors, and proof.
3. **Property manager, housing society, or commercial owner:** needs credibility, relevant projects, written quotes, and minimal disruption.
4. **Builder or industrial client:** needs methods and systems, capacity, safety, and new-construction and industrial experience.

### Turn the brand attributes into visible evidence
| Attribute | Show it with |
|---|---|
| Trust | Real project photos, reviews with name/area/service context, full address and hours, written warranty, no-obligation language |
| Professionalism | Consistent design system, precise copy, structured process, written quotes, crews in safety gear |
| Durability | Warranty terms, materials and systems explained, water test before handover, maintenance guidance |
| Expertise | Diagnosis-first approach, technical "how we fix it" sections, case studies (challenge → solution → result), detailed FAQs |
| Fast response | Phone always visible, WhatsApp, response-time promise near every CTA, short form, urgent-leak call-out (if offered) |

### CTA hierarchy (identical labels site-wide; labels come from config)
- **Primary:** "Book a Free Inspection" ("Free Inspection" where space is tight) → the lead form. If the inspection isn't free, the config changes the label everywhere.
- **Secondary:** "Call Now" (`tel:`) and "WhatsApp Us" (`https://wa.me/<number>?text=…` with a pre-filled message naming the current service or area, e.g., "Hi, I'd like an inspection for bathroom waterproofing in [Area].").
- **Tertiary:** "See Our Projects", "How It Works", related-service links.
- "Request a Quote" is not a separate flow, because quotes follow an inspection. Quote links go to the same form, and the UI says so: "We inspect first, then give you a written quote."

### Conversion rules
- Phone number visible in the header on every page; click-to-call on mobile.
- Every page has a primary CTA above the fold, at least one mid-page, and a closing CTA band before the footer (except `/contact` and `/thank-you`).
- **Mobile:** sticky bottom action bar (Call | WhatsApp | Free Inspection). It appears once the hero CTAs scroll out of view, respects `env(safe-area-inset-bottom)` (set `viewport-fit=cover`), hides on `/contact` and whenever a form field has focus, and never covers content (pad the page bottom).
- **Desktop:** floating WhatsApp button bottom-right. Don't show it on mobile, where the action bar replaces it.
- Links from service and area pages pre-fill the form: `/contact?service=<slug>&area=<slug>`.
- Trust cues sit next to CTAs: response time, warranty, "no obligation", privacy note.
- Attribution: store first-touch UTM parameters and the landing page in `sessionStorage`; send them as hidden fields with the lead.
- Analytics-ready: a `track(event, props)` adapter (no-op by default) fired on `cta_click`, `call_click`, `whatsapp_click`, `form_start`, `form_submit_success`, `form_submit_error`.

## 3. Information architecture

### Routes
| Route | Page |
|---|---|
| `/` | Home |
| `/services` | All services, grouped |
| `/services/[slug]` | Service detail: one template, nine pages |
| `/projects` | Portfolio with filters |
| `/projects/[slug]` | Project case study |
| `/gallery` | Photo gallery with lightbox |
| `/reviews` | Testimonials (nav label "Reviews") |
| `/service-areas` | Areas index |
| `/service-areas/[area]` | Area landing page |
| `/about` | About us |
| `/faq` | FAQ |
| `/contact` | Book inspection / contact |
| `/thank-you` | Post-submission (noindex) |
| `/privacy-policy`, `/terms` | Placeholder legal pages, flagged for legal review |
| 404 / error | Custom `not-found` and `error` pages |

### Services
| Slug | Name | Nav group |
|---|---|---|
| `terrace-roof-waterproofing` | Terrace & Roof Waterproofing | Homes & residential |
| `bathroom-waterproofing` | Bathroom Waterproofing | Homes & residential |
| `basement-waterproofing` | Basement Waterproofing | Homes & residential |
| `wall-dampness-treatment` | Wall Dampness & Seepage Treatment | Homes & residential |
| `crack-repair-sealing` | Crack Repair & Sealing | Repairs & diagnostics |
| `leakage-detection-repair` | Leakage Detection & Repair | Repairs & diagnostics |
| `commercial-waterproofing` | Commercial Waterproofing | Commercial, industrial & new build |
| `industrial-waterproofing` | Industrial Waterproofing | Commercial, industrial & new build |
| `new-construction-waterproofing` | New Construction Waterproofing | Commercial, industrial & new build |

### Navigation
- **Desktop:** slim utility bar (hours · areas served · email · WhatsApp) above a sticky header that condenses on scroll: logo · Services (mega-menu with the three groups + "All services") · Projects (Case studies, Gallery) · About · Service Areas · Reviews · Contact · phone number · primary CTA. No more than six top-level items.
- **Mobile:** logo · call button · menu button. The menu is a full-height panel with large targets, Services as an expandable group, and Call / WhatsApp / primary CTA pinned at the bottom.
- **Breadcrumbs** on every inner page.
- **Footer:** logo + one-line positioning; all services; company links (About, Projects, Gallery, Reviews, FAQ, Service Areas, Contact); top areas + "All areas"; contact block (`<address>` with full address, hours, phone, WhatsApp, email, socials); legal row.

### Content relations
Model links as slug references in the data so related blocks render automatically:
problem → services · service → related services, projects, reviews, FAQs, areas · project → services, area, review · area → services, projects, reviews, nearby areas.

## 4. Page specifications

Every page: one `h1`, logical heading order, its own metadata, and the conversion elements from §2. The section order is deliberate. If you change it, note why in `docs/PLAN.md`.

### Home `/`
1. **Hero:** outcome-led H1 that names the primary city (e.g., "Leak-free terraces, bathrooms and basements in [City]"); one-line subhead (what we fix, for whom); primary CTA + Call/WhatsApp; trust strip (warranty, response time, projects, rating, all from config); real-work photo with a dark overlay for contrast. Desktop: compact inspection form beside the headline. Mobile: CTAs visible without scrolling.
2. **"What's the problem?":** 6–8 symptom tiles that link to the right service: ceiling leaks when it rains, damp or peeling walls, water ponding on the terrace, bathroom seepage into the flat below, basement water, cracks, mould or white salt deposits (efflorescence). Customers know their symptom, not the service name.
3. **Services:** grouped cards (image or icon, name, one-line benefit, link) + "All services".
4. **Why choose us:** 4–6 concrete differentiators (e.g., diagnosis before quoting, written warranty, trained crew, itemized quotes, clean and on-schedule work, water test before handover). No vague superlatives.
5. **Before / after:** 2–3 featured projects with the comparison slider, service and location, link to projects.
6. **How it works:** 5 steps, Contact → Inspection & moisture diagnosis → Written quote → Treatment → Water test, handover & warranty, with typical timing per step.
7. **Stats:** 3–4 figures from config; count up once on view (static under reduced motion).
8. **Reviews:** rating summary + 3 review cards + links to `/reviews` and the Google profile. No autoplay carousel.
9. **Service areas:** primary city + area links + "Don't see your area? Ask us."
10. **FAQ:** 5–6 top questions (cost, duration, warranty, disruption, maintenance) + link to `/faq`.
11. **Final CTA:** compact form or CTA buttons + phone/WhatsApp + response promise.

### Services index `/services`
Intro; grouped service cards; problem-to-service finder; a "Not sure what you need? We diagnose first" block; CTA.

### Service detail `/services/[slug]` (one data-driven template)
1. Breadcrumbs; hero with H1 (service + city), problem-aware subhead, CTAs (form pre-filled, service-specific WhatsApp text), key facts (typical duration, warranty, suitable for).
2. Signs you need it: symptom checklist.
3. Why it happens: plain-language causes.
4. How we fix it: methods and system types, technically accurate (no manufacturer names unless they're in config).
5. Benefits.
6. Service-specific process.
7. Suitable applications / property types.
8. Before/after and related projects (hide if none).
9. Warranty: what's covered and what isn't.
10. What affects the cost: the factors, never invented prices, then "Get an exact quote after your inspection."
11. Service FAQs.
12. Related services and areas served.
13. CTA with the compact form pre-set to this service.

Desktop: a sticky sidebar card (CTA, phone, WhatsApp, 3 trust points) alongside sections 2–11.

### Projects `/projects` and `/projects/[slug]`
- Index: filter by service and property type (residential, commercial, industrial), plus city if there are several; filters live in the URL query string; show the result count; empty state with "Clear filters". Card: image, title, location, service, property type, one-line outcome.
- Detail: hero image; quick facts (location, property type, services, area treated, duration, year); challenge → solution → result; before/after slider(s); photo grid with lightbox; related review; related projects; CTA "Facing something similar?".

### Gallery `/gallery`
Masonry (CSS columns) or justified grid with known image dimensions (no layout shift); category filters; lightbox with keyboard, swipe, captions, counter, focus trap, and neighbour preloading; before/after pairs open in comparison view; lazy-load below the fold.

### Reviews `/reviews`
Rating summary; filter by service; cards with first name + initial, area, service, date, rating, quote (long text clamps with "Read more"); links to read and leave Google reviews; CTA.

### About `/about`
Story; approach (diagnosis first, workmanship standards, safety); mission and values; why customers trust us (proof points linking to projects and reviews); team (initials or silhouettes until real photos exist, never stock faces presented as staff); certifications, licences, insurance, warranty (render only what's in config; hide empty groups); CTA.

### FAQ `/faq`
Categories: Cost & quotes · Inspection & process · Duration & disruption · Warranty · Solutions & materials · Maintenance · Booking. Jump links, accordions, optional client-side search, "Still have questions? WhatsApp us." Cost answers explain the factors; they don't invent numbers.

### Service areas `/service-areas` and `/service-areas/[area]`
- Index: areas grouped by city/region, a simple static map or illustration, "Don't see your area?" CTA.
- Area page, one per area genuinely served (no doorway pages): H1 "Waterproofing Services in [Area]"; unique intro (building types, weather and season concerns, common problems, with no invented local facts); services available; projects and reviews in this area (hide if none); nearby areas; 2–3 area FAQs; CTA pre-filled with the area.
- Don't create service × area combination pages yet, but keep the content model able to support them later.

### Contact `/contact`
H1 built from the primary CTA label (e.g., "Book your free inspection") + response promise; full form (§6); contact cards (Call, WhatsApp, Email, Address, Hours); "What happens next" in 3 steps; map behind a click-to-load facade (static preview → Google Maps iframe on click, plus an "Open in Google Maps" link); short FAQ.

### Thank you `/thank-you` (noindex)
Confirmation; what happens next and when; WhatsApp link for sending photos of the problem; links to projects and FAQ.

### 404 and error
404 with links to services, the primary CTA, and the phone number. `error.tsx` with retry plus a Call/WhatsApp fallback.

## 5. Visual design system

Direction: **engineered protection**, meaning the look of a well-run engineering contractor: solid, precise, calm, confident. Not a SaaS landing page and not a theme template.

Starting tokens. Refine them with care, keep WCAG AA contrast, and define them once in Tailwind v4 `@theme`. Never hard-code hex values in components.
- **Navy** `#0B1A2E`: dark sections, footer, headings.
- **Royal blue** `#1E40AF`: links, icons, secondary buttons, focus ring.
- **Amber** `#F5A524`: reserved for the primary CTA only. Always navy text on amber (white on amber fails contrast).
- **Neutrals:** `#F6F5F2` alternate section background, `#E3E0DA` borders, `#1C2430` body text, `#525C69` muted text.
- Accessible success/error colours. WhatsApp green only on WhatsApp controls, with a contrast-safe icon and text colour.

Typography (via `next/font`): headings **Barlow Semi Condensed** 600/700; body **Public Sans** (or an equally sturdy pairing that doesn't look like SaaS). Fluid `clamp()` scale: H1 40→64px, H2 30→44px, H3 22→28px, body 16→18px. Line-height ~1.1 for headings and ~1.6 for body; text measure ≤ 70ch; small uppercase eyebrow labels with wide tracking.

Shape, layout, and imagery:
- 4px radius (6px max; pills only for chips and badges); 1px borders; shadows only on floating elements. No glassmorphism, gradient blobs, or decorative gradients. The only overlay is a dark scrim on hero photos.
- Container max 1280px; gutters 16/24/32px; 8px spacing grid; section padding ~64px on mobile to ~112px on desktop; alternate white, neutral, and navy sections for rhythm.
- Avoid the giveaways of a template: don't centre everything, and don't reuse the same row of three icon cards in every section. Vary layouts (split image/text, numbered steps, stat bands, case-study cards) and left-align most section headings.
- Photography over illustration: finished terraces and roofs, close-ups of membranes being applied, crews in safety gear, before/after pairs from identical angles. One restrained brand motif (e.g., thin layered lines suggesting membrane layers), used sparingly.
- Icons: Lucide, one stroke weight. Lucide has no WhatsApp icon, so use an inline SVG.
- Logo: placeholder SVG wordmark with a simple mark (e.g., a crown over a water droplet), plus favicon/app icons and a navy `theme-color`. It must be easy to swap.
- Motion: 150–250ms ease-out hovers; one-time fade/rise reveals (≤ 400ms, ≤ 12px). No parallax, scroll-jacking, autoplay carousels, or cursor effects. Everything respects `prefers-reduced-motion`.
- Every interactive element has default, hover, focus-visible (2px royal-blue ring with offset), active, disabled, and loading states.
- Light theme only.

## 6. Lead form (`ContactForm`)

One component with two variants:
- **`compact`** (hero, CTA bands, service sidebar): Name, Phone, Service, Area.
- **`full`** (`/contact`):
  - Required: Name, Phone, Service needed (the nine services + "Not sure, need a diagnosis"; pre-fillable), Area (served areas + "Other" with free text; pre-fillable).
  - Optional, grouped under "Help us prepare (optional)": property type (tap-friendly chips: apartment, independent house/villa, commercial, industrial, under construction), email, problem description, photos (up to 5 images, with type and size checks, preview, and remove), preferred inspection date (no past dates) and time window, preferred contact method (call or WhatsApp).
  - Hidden: source page, service/area context, UTM data.
  - Privacy note linking to the privacy policy.

Behaviour:
- React Hook Form + Zod, with one schema shared by client validation and the server-side handler.
- Visible labels (never placeholder-only); required and optional fields clearly marked; inputs ≥ 16px text and ≥ 48px tall; correct `type`, `inputMode`, `autoComplete`.
- Validate on blur, then on change. On a failed submit, show an error summary and move focus to the first invalid field; connect errors with `aria-describedby`.
- Phone validation uses a pattern from site config. Work out "today" for the date field on the client (static pages are built once).
- The submit button shows a pending state and blocks double submission.
- Spam protection without a backend: honeypot field + minimum time-to-submit.
- Submission: a Server Action calls `submitLead()` in `src/lib/leads.ts`, the only integration seam. For now it validates, simulates latency, and returns a typed success/error result, with a dev flag that forces the error path. Never log personal data. Photos stay client-side in the prototype because Server Action bodies are limited to 1 MB by default; real uploads should go direct to storage later. Document how to connect email, CRM, or WhatsApp later.
- Success → `/thank-you`. Error → keep every input, explain clearly, and offer Call/WhatsApp.
- Pre-fill from the query string in a client component (see the `useSearchParams` rule in §7).

## 7. Components and code structure

Required components (add others as needed):
- **Layout:** `TopBar`, `Navbar` (with mega-menu), `MobileNav`, `Footer`, `MobileActionBar`, `WhatsAppButton`, `Breadcrumbs`, `Container`, `Section`, `SectionHeading`
- **Sections:** `HeroSection` (home, service, area, and page variants), `ProblemsGrid`, `ServicesGrid`, `WhyChooseUs`, `ProcessSteps`, `StatsSection`, `TestimonialsSection`, `ServiceAreaSection`, `FAQAccordion`, `CTASection`, `TrustStrip`, `WarrantyBlock`
- **Cards:** `ServiceCard`, `ProjectCard`, `TestimonialCard`, `TeamCard`
- **Media:** `SiteImage`, `BeforeAfterSlider`, `BeforeAfterGallery`, `GalleryGrid`, `Lightbox`, `MapFacade`
- **Forms:** `ContactForm` + field primitives
- **UI:** `Button` (primary, secondary, outline, ghost, whatsapp, call; sizes; renders as link or button), `Badge`, `RatingStars`, `FilterBar`, `PlaceholderBadge`
- **SEO:** `JsonLd`

Rules:
- Server Components by default; `"use client"` only on interactive leaves (menus, accordion, slider, lightbox, filters, form, action bar).
- Components receive typed data via props. No business data lives in components.
- Prefer native elements (`<details>`, `<dialog>`, `<input type="range">`) or headless primitives (e.g., Radix) styled to this brand. No default shadcn/ui look.
- `BeforeAfterSlider`: pointer and touch drag, keyboard (arrows, Home/End), visible Before/After labels, `touch-action: pan-y` so vertical scrolling still works on phones, identical aspect ratios.
- `Lightbox` and `MobileNav`: focus trap, Esc closes, focus returns to the trigger, body scroll locked.
- Filters and form pre-fill: read and write the query string with `useSearchParams` inside a `<Suspense>` boundary so pages stay statically rendered. The fallback renders the unfiltered list or the empty form.
- States: form pending/success/error, blur placeholders for images, empty states for lists. Add `loading.tsx` only where a route can actually suspend.
- Robustness: test components with the longest service name, very short and very long headlines, and 0, 1, and many items. Empty lists hide or show a helpful empty state, long text wraps cleanly, and a missing image falls back to a branded placeholder.

Structure:
```
src/
  app/          routes, layout, not-found, error, sitemap.ts, robots.ts, manifest, opengraph-image
  components/   layout/ sections/ cards/ media/ forms/ ui/ seo/
  config/       site.ts (business facts, CTA labels, feature flags)
  content/      services.ts projects.ts reviews.ts faqs.ts areas.ts problems.ts team.ts images.ts
  lib/          leads.ts analytics.ts whatsapp.ts seo.ts schema.ts validation.ts utils.ts
  types/        content types
scripts/        check-content.ts
```

Content is read through async getters (`getServices()`, `getProjectBySlug()`, …) over local typed data, so a CMS can replace them later without touching pages.

Mock data volume, enough to exercise filters, relations, and layouts: 9 services, ~12 projects (each with a before/after pair) spread across services, property types, and areas, ~12 reviews, 6 areas (or the real list), ~30 general FAQs + 4–6 per service, 4 team placeholders, 20–30 gallery images.

## 8. Content rules: honesty and quality

- Write real, specific copy for every page. No lorem ipsum, no filler, and no paragraphs repeated across service or area pages. Use plain, confident, customer-focused language, short paragraphs, scannable lists, and specific button labels (never "Submit").
  - Write like this: "We find where the water is getting in before we quote, so you pay to fix the cause, not the stain."
  - Not like this: "We provide best-in-class waterproofing solutions with unmatched quality."
- Be technically credible. Where relevant, describe real methods: liquid-applied PU or acrylic membranes, cementitious and crystalline coatings, bituminous/APP/SBS sheet membranes, injection grouting for cracks, joint sealants, epoxy tile grouting, negative-side basement treatment, flood/ponding tests.
- **Never present invented facts as real.** Unless they're provided in §1, these are placeholders: numbers and stats, years in business, warranty terms, prices, certifications, awards, partnerships, team members, reviews, client names, and project details. Each one carries `placeholder: true` in the data.
- When `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true` (the default until launch), a small `PlaceholderBadge` ("Sample") marks flagged content. The owner can see it, and the design still holds up.
- Softer claims about how the company works (differentiators, process steps, response promises) get sensible defaults and go on the list for the owner to confirm.
- Stock photos may set the mood, but must never pose as the company's own projects, before/after results, or staff unless they're flagged as samples.
- No unverifiable superlatives ("best", "#1", "100% guaranteed") and no absolute promises.
- `npm run check:content` lists every remaining placeholder (data flags and TBD config values). It's the launch gate.

## 9. Images

- Every image goes through `SiteImage` (which wraps `next/image`) and a typed manifest (`src/content/images.ts`: src, alt, width, height, placeholder flag, shot brief, credit and licence for stock).
- Use freely licensed stock photos only after checking that each one loads and shows the intended subject. Download them into `public/images/` and never hot-link guessed URLs. Otherwise, generate tasteful branded SVG placeholders that state the intended shot. Never leave a broken image.
- Aspect ratios: hero 16:9 (with a deliberately chosen 4:5 crop on mobile), cards 4:3, before/after pairs 4:3 with identical framing, team 4:5, Open Graph 1200×630.
- Accurate `sizes` for each layout; meaningful `alt` (empty for decorative images); blur placeholders. The hero (LCP) image loads eagerly with high priority; everything else lazy-loads.

## 10. SEO

- Metadata API on every route: unique title (~50–60 characters; template `%s | Royal Waterproofing Co.`), description (140–160 characters, ending with a reason to act), canonical URL, Open Graph and Twitter tags (a default OG image, plus per-service images via `opengraph-image` if time allows). `metadataBase` comes from `NEXT_PUBLIC_SITE_URL`.
- JSON-LD through `JsonLd`: `HomeAndConstructionBusiness` sitewide (name, address, phone, geo, hours, `areaServed`, `sameAs`); `Service` on service pages; `BreadcrumbList` on inner pages; `FAQPage` on the FAQ and service pages. No `Review` or `AggregateRating` markup: the reviews are placeholders, and Google ignores self-hosted reviews for local businesses anyway.
- `sitemap.ts` and `robots.ts` are generated from content; `/thank-you` is noindex.
- **Indexing guard:** unless `NEXT_PUBLIC_ALLOW_INDEXING=true`, every page is `noindex` and `robots.txt` disallows all, so preview deployments with placeholder content never get indexed.
- Semantic HTML: `header`, `nav`, `main`, `footer`, `section`s with headings, `article` for projects and reviews, `address` for contact details, `figure`/`figcaption`; descriptive link text.
- Internal linking comes from the content relations (§3) plus breadcrumbs on every inner page.

## 11. Technical requirements

- Latest stable Next.js (16.x at the time of writing) with the App Router, React 19, TypeScript in strict mode, Tailwind CSS v4, ESLint. Scaffold with `create-next-app` into this directory using `src/` and the `@/*` alias. The directory should contain only `docs/`; if the scaffolder refuses, scaffold in a temp folder and move the files in.
- Follow the installed version's conventions rather than older habits. For example, `params` and `searchParams` are Promises and must be awaited in pages, layouts, and `generateMetadata`. When unsure about an API, check the official docs for the installed version.
- Every page is statically generated; dynamic routes use `generateStaticParams` with `dynamicParams = false`. Use the standard Next.js server output, not `output: 'export'`, because the form uses a Server Action.
- Lean dependencies: `lucide-react`, `react-hook-form`, `@hookform/resolvers`, `zod`, `clsx`, `tailwind-merge`, and optionally Radix primitives and a small lightbox library. Justify anything else in `docs/PLAN.md`. No UI kits, carousel libraries, or heavy animation libraries.
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `check:content`.
- `.env.example`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ALLOW_INDEXING`, `NEXT_PUBLIC_SHOW_PLACEHOLDERS`.
- Sensible security headers in `next.config`: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection.
- No `any`, no console errors, no hydration warnings, no dead code.

## 12. Accessibility (WCAG 2.2 AA)

- Contrast: 4.5:1 for text (3:1 for large text); 3:1 for UI components and focus indicators.
- Skip link; landmarks; one `h1` per page; logical headings; `lang` set.
- Everything works by keyboard with visible focus: mega-menu, mobile menu, accordions, filters, slider, lightbox, form.
- Touch targets ≥ 44×44px with spacing between them; nothing depends on hover.
- Forms: labels, hints, errors announced to screen readers, error summary.
- The sticky header never hides focused elements or anchor targets (`scroll-margin-top`).
- `prefers-reduced-motion` is respected everywhere.

## 13. Performance budgets (mobile)

- Lighthouse mobile: Performance ≥ 90; Accessibility, Best Practices, SEO ≥ 95.
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Minimal client JS; `next/font` with only the weights used; the map loads on interaction; no third-party scripts in the prototype.

## 14. Responsive behaviour

Build mobile-first and verify at 320, 375, 390, 768, 1024, 1280, 1440, and 1920px:
- no horizontal scroll
- fixed elements never overlap each other or the content
- the primary CTA is visible on the first screen
- forms stay comfortable with the on-screen keyboard open
- image crops are deliberate and line lengths stay readable
- the mega-menu becomes an accordion on mobile
- grids reflow from 1 to 2 to 3–4 columns

## 15. How to work

**Phase 0: plan (no code yet).** Write `docs/PLAN.md` covering the sitemap, navigation, conversion paths, component inventory, content model (TypeScript types), design tokens, dependencies, and your assumptions about anything TBD. Show me a short summary and wait for my go-ahead.

Then build in phases:
1. **Foundations:** scaffold, tokens, fonts, config, content types and mock data, UI primitives, layout shell (TopBar, Navbar, MobileNav, Footer, MobileActionBar, WhatsAppButton), 404 and error pages.
2. **Home.**
3. **Services:** index, detail template, and full content for all nine services.
4. **Lead flow:** ContactForm, Server Action, `/contact`, `/thank-you`.
5. **Proof:** Projects (index + detail), Gallery, Reviews.
6. **Remaining pages:** About, FAQ, Service areas (index + area pages), legal pages.
7. **SEO layer:** metadata, JSON-LD, sitemap, robots, OG images, indexing guard.
8. **QA and handover:** everything in §16.

After each phase, run typecheck, lint, and a production build, and fix every error before continuing. After each page, take screenshots at 390px and 1440px (e.g., with Playwright). Review them the way a demanding design lead would (spacing, alignment, hierarchy, contrast, overflow, consistency with §5) and fix what you find.

## 16. Definition of done

- [ ] Build, typecheck, and lint pass with zero errors and no warnings caused by project code.
- [ ] Every route in §3 is statically generated and has one `h1`, a unique title and description, a canonical URL, and valid JSON-LD.
- [ ] No broken internal links or images (automated check).
- [ ] Playwright smoke tests cover these flows:
  - every route renders without console errors
  - the mobile menu opens, traps focus, and closes
  - the form shows validation errors, handles the error path, and reaches `/thank-you`
  - filters update the URL and the results
  - the slider and lightbox work by keyboard
- [ ] Vitest unit tests for the lead schema, the WhatsApp link builder, and content-relation helpers.
- [ ] Lighthouse mobile scores meet §13 on Home, one service page, and Contact.
- [ ] Keyboard-only pass and 320px-width pass done.
- [ ] No business data outside `src/config` and `src/content`.
- [ ] `npm run check:content` output matches `docs/CONTENT_CHECKLIST.md` (every placeholder to replace, grouped by page).
- [ ] `docs/PHOTO_SHOT_LIST.md` lists every image slot with subject, framing, aspect ratio, minimum resolution, and before/after pairing notes, so the owner can photograph real jobs.
- [ ] `README.md` covers setup, scripts, structure, editing content and config, replacing images and the logo, connecting a real form backend, enabling indexing, and deploying (e.g., Vercel).
- [ ] `CLAUDE.md` / `AGENTS.md` (create or update) records the project's conventions for future sessions.

**Final report:** what was built, any deviations from this brief and why, known limitations, and the top 10 things the owner must provide before launch.

## 17. Out of scope (for now)

Real backend/CRM/email delivery, CMS, blog (leave room for a `/guides` section later, which is good for SEO), multilingual routing, payments, user accounts, chatbots, cookie banner (add one when tracking cookies are introduced), dark mode, service × area combination pages.
