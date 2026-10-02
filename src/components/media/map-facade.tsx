"use client";

import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Google Maps costs ~1 MB of script and sets cookies, so it only loads when
 * someone asks for it. Until then a light static preview is shown.
 */
export function MapFacade({ query, mapsUrl, addressLabel }: { query: string | null; mapsUrl: string; addressLabel: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded && query) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-concrete-300 sm:aspect-[21/9]">
        <iframe
          title={`Map showing ${addressLabel}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          className="absolute inset-0 size-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-concrete-300 bg-concrete-200 sm:aspect-[21/9]">
      <svg aria-hidden="true" viewBox="0 0 840 360" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <rect width="840" height="360" fill="var(--color-concrete-200)" />
        <path d="M-20 300 C 140 250 220 330 380 280 S 640 200 860 230" fill="none" stroke="var(--color-royal-200)" strokeWidth="34" />
        {[60, 170, 300, 420, 560, 700].map((x) => (
          <line key={x} x1={x} y1="0" x2={x + 40} y2="360" stroke="var(--color-white)" strokeWidth="10" />
        ))}
        {[70, 160, 250].map((y) => (
          <line key={y} x1="0" y1={y} x2="840" y2={y - 30} stroke="var(--color-white)" strokeWidth="12" />
        ))}
        <rect x="90" y="90" width="60" height="45" fill="var(--color-concrete-300)" />
        <rect x="470" y="40" width="80" height="60" fill="var(--color-concrete-300)" />
        <rect x="620" y="140" width="70" height="50" fill="var(--color-concrete-300)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/35 p-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-navy-900 text-wave-300 shadow-float">
          <MapPin className="size-6" aria-hidden="true" />
        </span>
        <p className="font-semibold text-navy-900">{addressLabel}</p>
        {query ? (
          <Button variant="secondary" size="sm" onClick={() => setLoaded(true)}>
            Load interactive map
          </Button>
        ) : null}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700 underline-offset-4 hover:underline"
        >
          Open in Google Maps <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
