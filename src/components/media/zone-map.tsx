import { areas } from "@/content/areas";
import { cn } from "@/lib/utils";

/**
 * Schematic map of the zones and areas served (not to scale, not a real map).
 * Decorative: the accessible list of areas always sits next to it.
 */
type RegionId = "western" | "eastern" | "south" | "thane" | "navi";

const regions: { id: RegionId; points: string; label: string[]; lx: number; ly: number }[] = [
  { id: "western", points: "62,30 178,30 182,150 178,372 104,372 90,318 76,252 64,170", label: ["Western", "Suburbs"], lx: 124, ly: 140 },
  { id: "eastern", points: "182,150 289,140 286,248 278,322 252,372 178,372", label: ["Eastern", "Suburbs"], lx: 236, ly: 252 },
  {
    id: "south",
    points: "104,372 252,372 232,430 206,488 182,512 160,500 140,450 118,406",
    label: ["Central &", "South Mumbai"],
    lx: 182,
    ly: 444,
  },
  { id: "thane", points: "306,28 386,28 386,160 312,166 300,98", label: ["Thane"], lx: 344, ly: 72 },
  { id: "navi", points: "318,184 386,178 386,496 300,496 294,420 302,320 310,250", label: ["Navi", "Mumbai"], lx: 344, ly: 292 },
];

/** Which region of the schematic each area sits in. */
const areaRegion: Record<string, RegionId> = {
  santacruz: "western",
  "bandra-khar": "western",
  "vile-parle-juhu": "western",
  andheri: "western",
  "goregaon-to-borivali": "western",
  "bandra-kurla-complex": "western",
  "dahisar-mira-road": "western",
  powai: "eastern",
  "kurla-ghatkopar-chembur": "eastern",
  "mulund-bhandup": "eastern",
  "dadar-worli": "south",
  "colaba-cuffe-parade": "south",
  "fort-nariman-point": "south",
  "malabar-hill-peddar-road": "south",
  "girgaon-grant-road": "south",
  "byculla-mazgaon": "south",
  "parel-sewri": "south",
  "sion-wadala": "south",
  thane: "thane",
  "navi-mumbai": "navi",
};

/** Approximate position of each area on the schematic. */
const areaPoints: Record<string, [number, number]> = {
  "dahisar-mira-road": [118, 50],
  "goregaon-to-borivali": [112, 92],
  andheri: [122, 200],
  "vile-parle-juhu": [104, 262],
  santacruz: [140, 298],
  "bandra-kurla-complex": [160, 330],
  "bandra-khar": [128, 344],
  "mulund-bhandup": [262, 164],
  powai: [236, 204],
  "kurla-ghatkopar-chembur": [232, 316],
  "sion-wadala": [224, 386],
  "dadar-worli": [176, 404],
  "parel-sewri": [212, 418],
  "byculla-mazgaon": [204, 470],
  "malabar-hill-peddar-road": [156, 474],
  "girgaon-grant-road": [180, 474],
  "fort-nariman-point": [192, 490],
  "colaba-cuffe-parade": [178, 503],
  thane: [344, 118],
  "navi-mumbai": [342, 382],
};

const OFFICE = areaPoints.santacruz;

export function ZoneMap({ highlight, className }: { highlight?: string; className?: string }) {
  const active = areas.find((area) => area.slug === highlight);
  const activePoint = active ? areaPoints[active.slug] : undefined;

  return (
    <svg viewBox="0 0 400 520" aria-hidden="true" className={cn("h-auto w-full", className)} style={{ fontFamily: "var(--font-sans)" }}>
      <rect width="400" height="520" rx="6" fill="var(--color-royal-100)" />
      <text x="30" y="300" fontSize="11" fontWeight="600" letterSpacing="2" fill="var(--color-royal-700)" opacity="0.7" transform="rotate(-90 30 300)" textAnchor="middle">
        ARABIAN SEA
      </text>

      {/* National park between the western and eastern suburbs */}
      <polygon points="178,30 292,30 289,140 182,150" fill="var(--color-success-100)" stroke="var(--color-concrete-400)" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="236" y="92" fontSize="10" textAnchor="middle" fill="var(--color-ink-subtle)">
        National Park
      </text>

      {regions.map((zone) => {
        const isActive = active ? areaRegion[active.slug] === zone.id : false;
        return (
          <g key={zone.id}>
            <polygon
              points={zone.points}
              fill={isActive ? "var(--color-wave-200)" : "var(--color-white)"}
              stroke={isActive ? "var(--color-royal-700)" : "var(--color-concrete-400)"}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeLinejoin="round"
            />
            <text x={zone.lx} y={zone.ly} textAnchor="middle" fontSize="12" fontWeight={isActive ? 700 : 600} fill={isActive ? "var(--color-navy-950)" : "var(--color-ink-muted)"}>
              {zone.label.map((line, i) => (
                <tspan key={line} x={zone.lx} dy={i === 0 ? 0 : 14}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      {/* Every area, with the current one emphasised */}
      {areas.map((area) => {
        const point = areaPoints[area.slug];
        if (!point || area.slug === active?.slug) return null;
        return <circle key={area.slug} cx={point[0]} cy={point[1]} r="4" fill="var(--color-navy-600)" opacity="0.55" />;
      })}

      {/* Office */}
      <g transform={`translate(${OFFICE[0]} ${OFFICE[1]})`}>
        <path d="M0 0c-6-8-10-12.5-10-17.5a10 10 0 0 1 20 0C10-12.5 6-8 0 0Z" fill="var(--color-navy-900)" />
        <circle cx="0" cy="-17.5" r="4" fill="var(--color-wave-300)" />
        <text x="14" y="-12" fontSize="10.5" fontWeight="700" fill="var(--color-navy-900)">
          Our office
        </text>
      </g>

      {active && activePoint ? (
        <g>
          <circle cx={activePoint[0]} cy={activePoint[1]} r="8" fill="var(--color-wave-500)" stroke="var(--color-navy-950)" strokeWidth="2" />
          <text
            x={activePoint[0] + (activePoint[0] > 300 ? -14 : 14)}
            y={activePoint[1] + 4}
            textAnchor={activePoint[0] > 300 ? "end" : "start"}
            fontSize="12.5"
            fontWeight="700"
            fill="var(--color-navy-950)"
            stroke="var(--color-white)"
            strokeWidth="3"
            paintOrder="stroke"
          >
            {active.name}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
