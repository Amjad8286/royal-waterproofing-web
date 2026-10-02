/**
 * Launch gate and content to-do list.
 *
 *   npm run check:content   → prints what's left; exits 1 while launch blockers remain
 *   npm run docs:content    → regenerates docs/CONTENT_CHECKLIST.md and docs/PHOTO_SHOT_LIST.md
 *
 * Sample (placeholder) content is hidden on the live site, so it doesn't block
 * launch — it's the list of real content to add. Launch blockers are facts that
 * affect what visitors see today and still need confirming.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { certifications, features, flags, pendingFacts, processSteps, site, stats } from "../src/config/site";
import { areas } from "../src/content/areas";
import { chatKnowledge } from "../src/content/chat";
import { clients } from "../src/content/clients";
import { faqs } from "../src/content/faqs";
import { images } from "../src/content/images";
import { projects } from "../src/content/projects";
import { reviews } from "../src/content/reviews";
import { services } from "../src/content/services";
import { team } from "../src/content/team";

interface Group {
  title: string;
  where: string;
  items: string[];
}

const blockers = pendingFacts.filter((f) => f.blocksLaunch);

/** Clients on the home page shown by name, for want of a logo file. */
const namedOnly = clients.filter((c) => !c.logo);

/** Manual launch tasks that can't be detected from the data. */
const launchTasks = [
  `Connect the enquiry form to email, WhatsApp or a CRM — \`src/lib/leads.ts\`. Until then submissions are not delivered anywhere.`,
  "Have the privacy policy and terms reviewed by a legal professional — `src/app/privacy-policy`, `src/app/terms`",
  "Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ALLOW_INDEXING=true` for the production deployment",
  ...(features.photoUploads ? [] : ["Optional: enable photo uploads on the form once the backend stores files — `features.photoUploads`"]),
];

/** Sample content: hidden on the live site, shown with badges in preview mode. Replace with real content. */
const samples: Group[] = [
  {
    title: "Facts hidden until provided",
    where: "src/config/site.ts",
    items: pendingFacts.filter((f) => !f.blocksLaunch).map((f) => `\`${f.field}\` — ${f.note}`),
  },
  {
    title: "Sample claims (hidden)",
    where: "src/config/site.ts",
    items: [
      ...stats.filter((s) => s.placeholder).map((s) => `Stat: ${s.prefix ?? ""}${s.value}${s.suffix} ${s.label}`),
      ...(site.rating.placeholder ? [`Rating: ${site.rating.average}/5 from ${site.rating.count} reviews`] : []),
      ...(site.warranty.placeholder ? [`Warranty headline: "${site.warranty.headline}" / "${site.warranty.upTo.value}"`] : []),
      ...processSteps.filter((s) => s.timing?.placeholder).map((s) => `Process timing — ${s.title}: "${s.timing?.value}"`),
      ...certifications.filter((c) => c.placeholder).map((c) => `Credential: ${c.title}`),
    ],
  },
  {
    title: "Service page facts (hidden)",
    where: "src/content/services.ts",
    items: services.flatMap((s) => [
      ...(s.keyFacts.duration.placeholder ? [`${s.name}: typical duration "${s.keyFacts.duration.value}"`] : []),
      ...(s.keyFacts.warranty.placeholder ? [`${s.name}: warranty "${s.keyFacts.warranty.value}"`] : []),
      ...(s.warranty.placeholder ? [`${s.name}: warranty terms (covered / not covered)`] : []),
    ]),
  },
  {
    title: "FAQ answers (hidden)",
    where: "src/content/faqs.ts",
    items: faqs.filter((f) => f.placeholder).map((f) => f.question),
  },
  {
    title: "Projects / case studies (hidden)",
    where: "src/content/projects.ts",
    items: projects.filter((p) => p.placeholder).map((p) => `${p.title} (${p.slug})`),
  },
  {
    title: "Website assistant answers (never used until confirmed)",
    where: "src/content/chat.ts",
    items: chatKnowledge.filter((entry) => entry.placeholder).map((entry) => entry.question),
  },
  {
    title: "Reviews (hidden)",
    where: "src/content/reviews.ts",
    items: reviews.filter((r) => r.placeholder).map((r) => `${r.name}, ${r.area}: "${r.quote.slice(0, 60)}…"`),
  },
  {
    title: "Service areas (hidden)",
    where: "src/content/areas.ts",
    items: areas.filter((a) => a.placeholder).map((a) => `${a.name} (${a.slug})`),
  },
  {
    title: "Team (hidden)",
    where: "src/content/team.ts",
    items: team.filter((m) => m.placeholder).map((m) => `${m.role}: name, bio and (optional) photo`),
  },
  {
    title: "Before/after illustrations (hidden)",
    where: "src/content/images.ts + public/images/",
    items: Object.values(images)
      .filter((i) => i.placeholder)
      .map((i) => `${i.id} → ${i.src}`),
  },
];

const stock = Object.values(images).filter((i) => i.credit);
const sampleTotal = samples.reduce((sum, g) => sum + g.items.length, 0);

/* ---------------------------------------------------------------- */

function printReport() {
  console.log(`\n${site.name} — content check\n`);
  console.log(`${blockers.length ? "✗" : "✓"} Launch blockers (${blockers.length})  src/config/site.ts → pendingFacts`);
  for (const fact of blockers) console.log(`    - ${fact.field}: ${fact.note}`);
  console.log(`\n  Launch tasks (check by hand):`);
  for (const task of launchTasks) console.log(`    - ${task.replace(/`/g, "")}`);
  console.log(`\nHidden on the live site until real content replaces it (${sampleTotal}):`);
  for (const group of samples) console.log(`    ${group.items.length ? "•" : "✓"} ${group.title}: ${group.items.length}`);
  console.log(`\nStock photos to replace with your own when you can: ${stock.length} (docs/PHOTO_SHOT_LIST.md)`);
  console.log(`Client logos: ${clients.length - namedOnly.length} shown; ${namedOnly.length} clients shown by name (docs/CONTENT_CHECKLIST.md)`);
  console.log(`\nSearch indexing: ${flags.allowIndexing ? "ENABLED" : "disabled (set NEXT_PUBLIC_ALLOW_INDEXING=true at launch)"}`);
  console.log(`Preview mode (sample content shown): ${flags.previewSamples ? "ON — never deploy this to production" : "off"}`);
  if (blockers.length > 0) {
    console.log(`\n${blockers.length} launch blockers remain. See docs/CONTENT_CHECKLIST.md.\n`);
    process.exitCode = 1;
  } else {
    console.log("\nNo launch blockers remain.\n");
  }
}

/* ---------------------------------------------------------------- */

function checklistMarkdown() {
  const lines = [
    "# Content checklist",
    "",
    "<!-- Generated by `npm run docs:content` from the site's data. Edit the data, then regenerate. -->",
    "",
    "The live site shows only confirmed content. Invented sample content (projects, reviews, stats, warranty terms and so on) is hidden, and appears with \"Sample\" badges only in preview mode (`NEXT_PUBLIC_PREVIEW_SAMPLES=true`).",
    "",
    `\`npm run check:content\` fails while launch blockers remain. **${blockers.length} launch blockers and ${sampleTotal} hidden sample items remain.**`,
    "",
    "## Launch blockers",
    "",
    "These affect what visitors see today. Confirm each, then delete its entry from `pendingFacts` in `src/config/site.ts`.",
    "",
    ...(blockers.length ? blockers.map((f) => `- [ ] \`${f.field}\` — ${f.note}`) : ["All done."]),
    "",
    "## Launch tasks",
    "",
    ...launchTasks.map((task) => `- [ ] ${task}`),
    "",
    "## Content to add (hidden until real)",
    "",
    "Each item is hidden on the live site. Replace it with the real thing and set `placeholder: false` (or remove the entry from `pendingFacts`) — the section then appears automatically. Never publish invented reviews, ratings, stats or credentials.",
    "",
  ];
  for (const group of samples) {
    lines.push(`### ${group.title} (${group.items.length})`, "", `File: \`${group.where}\``, "");
    if (group.items.length === 0) lines.push("All done.", "");
    else lines.push(...group.items.map((item) => `- [ ] ${item}`), "");
  }
  lines.push(
    `## Client logos (optional, ${namedOnly.length})`,
    "",
    `The home page's client wall shows ${clients.length - namedOnly.length} logos; these clients are shown by name. To show one's logo, get the file from the client with permission to use it, save it in \`public/images/clients/\`, add it to \`src/content/images.ts\`, set \`logo\` in \`src/content/clients.ts\` and run \`npm run images:meta\`.`,
    "",
    ...namedOnly.map((c) => `- [ ] ${c.name}`),
    "",
    "## Statements to keep accurate",
    "",
    "These describe how the business works and are shown on the live site. Reword anything that isn't true.",
    "",
    "- [ ] \"How we work\" differentiators and the five process steps — `src/config/site.ts`",
    `- [ ] Inspection offer (${site.inspection.isFree ? "free" : "charged"}) — \`inspection.isFree\` changes every CTA label`,
    "- [ ] Trust points beside the CTAs — `trustPoints` in `src/config/site.ts`",
    "- [ ] Equipment and methods named on service pages (moisture meters, thermal camera, pressure tests) — `src/content/services.ts`",
    "- [ ] Area page descriptions of local buildings — `src/content/areas.ts`",
    "- [ ] General FAQ answers, especially payments and materials — `src/content/faqs.ts`",
    "- [ ] About page text, values and quote — `src/app/about/page.tsx`",
    "",
  );
  return lines.join("\n");
}

function shotListMarkdown() {
  const pairs = Object.values(images).filter((i) => /-(before|after)$/.test(i.id));
  const lines = [
    "# Photo shot list",
    "",
    "<!-- Generated by `npm run docs:content` from src/content/images.ts. -->",
    "",
    "The site currently uses licensed stock photos (Pexels; free for commercial use, no people shown) to illustrate services and Mumbai. Photos of your own work are the single biggest trust signal on a contractor's website, so replace them as you go — and add real before/after pairs so the projects and gallery sections can appear.",
    "",
    "## How to shoot",
    "",
    "- **Landscape, 4:3**, at least **2000 px wide** (hero shots: 16:9, at least 2400 px wide, with the subject near the middle — phones show an upright 4:5 crop of them). Phone cameras are fine — use the main lens, not the wide one.",
    "- **Before/after pairs: same spot, same angle, same framing.** Mark where you stood so the \"after\" lines up. The slider only works if they match.",
    "- Daylight, no flash. Clean up debris before the \"after\" shot.",
    "- Get the owner's or society's permission before publishing photos of their property.",
    "- Never use stock photos as your own work, team or results.",
    "",
    "## Replacing an image",
    "",
    "1. Save the photo in `public/images/` (e.g. `public/images/projects/society-terrace-before.jpg`).",
    "2. In `src/content/images.ts`, point the entry's `src` at it, rewrite `alt` to describe the real photo, and remove `credit` (or set `placeholder: false` for a project photo).",
    "3. Run `npm run images:meta` to record its size and blur placeholder.",
    "",
    `## Stock photos to replace (${stock.length})`,
    "",
    "| Id | Now | What to photograph |",
    "|---|---|---|",
    ...stock.map((i) => `| \`${i.id}\` | [${i.credit?.source} photo](${i.credit?.url}) | ${i.brief} |`),
    "",
    `## Before/after pairs for projects and the gallery (${pairs.length / 2} pairs)`,
    "",
    "These sample illustrations are hidden on the live site. Real pairs unlock the before/after sections.",
    "",
    "| Id | What to photograph |",
    "|---|---|",
    ...pairs.map((i) => `| \`${i.id}\` | ${i.brief} |`),
    "",
  ];
  return lines.join("\n");
}

if (process.argv.includes("--write")) {
  const root = process.cwd();
  writeFileSync(join(root, "docs/CONTENT_CHECKLIST.md"), checklistMarkdown());
  writeFileSync(join(root, "docs/PHOTO_SHOT_LIST.md"), shotListMarkdown());
  console.log(
    `Wrote docs/CONTENT_CHECKLIST.md (${blockers.length} blockers, ${sampleTotal} hidden items) and docs/PHOTO_SHOT_LIST.md (${stock.length} stock photos).`,
  );
} else {
  printReport();
}
