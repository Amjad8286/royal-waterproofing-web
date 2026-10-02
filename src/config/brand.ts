/**
 * Brand values for the places CSS can't reach: the Open Graph share card, the
 * browser theme colour and the web app manifest. Components use the Tailwind
 * tokens in src/app/globals.css instead; these mirror them, and
 * src/lib/brand.test.ts fails if the two drift apart.
 *
 * The palette comes from the logo's three blues: royal (the script and
 * wordmark), the front wave and the back wave.
 */
export const brandColors = {
  /** Deepest navy — the footer, the top bar and the share card's background. */
  navy950: "#00132b",
  /** Navy — dark sections, headings, the app icon tile and the browser theme colour. */
  navy900: "#021d3c",
  /** The logo's royal blue (script and wordmark). */
  royal700: "#034b8c",
  /** Primary conversion button. */
  wave600: "#0b6fb9",
  /** The logo's front wave. */
  wave500: "#0282d3",
  /** The logo's back wave — the accent on navy. */
  wave300: "#76ccfc",
  white: "#ffffff",
} as const;

/** CSS token name for each value above, used by the drift test. */
export const brandColorTokens: Record<keyof typeof brandColors, string> = {
  navy950: "--color-navy-950",
  navy900: "--color-navy-900",
  royal700: "--color-royal-700",
  wave600: "--color-wave-600",
  wave500: "--color-wave-500",
  wave300: "--color-wave-300",
  white: "--color-white",
};

/**
 * The eyebrow motif: the logo's two waves in miniature, on a 32×12 grid.
 * `.wave-mark` in globals.css draws the same paths with CSS masks.
 */
export const waveMark = {
  viewBox: "0 0 32 12",
  back: "M1 4.6L1.7 4L2.6 3.5L3.4 3.1L4.3 2.7L5.2 2.4L6.1 2.2L7 2.1L7.9 2.1L8.9 2.2L9.8 2.3L10.8 2.6L11.7 2.9L12.6 3.2L13.4 3.6L14.3 3.9L15.1 4.3L15.9 4.6L16.7 4.9L17.5 5.1L18.2 5.2L19 5.3L19.8 5.3L20.6 5.3L21.4 5.2L22.3 5.1L23.1 4.9L24 4.7L25 4.6L24.3 5.2L23.4 5.7L22.6 6.1L21.7 6.5L20.8 6.8L19.9 7L19 7.1L18.1 7.1L17.1 7L16.2 6.9L15.2 6.6L14.3 6.3L13.4 6L12.6 5.6L11.7 5.3L10.9 4.9L10.1 4.6L9.3 4.3L8.5 4.1L7.8 4L7 3.9L6.2 3.9L5.4 3.9L4.6 4L3.7 4.1L2.9 4.3L2 4.5Z",
  front:
    "M5 7.6L5.8 6.8L6.6 6.2L7.5 5.6L8.4 5.2L9.4 4.8L10.4 4.5L11.5 4.4L12.6 4.4L13.6 4.5L14.7 4.7L15.7 5L16.7 5.3L17.7 5.7L18.7 6.1L19.6 6.6L20.5 7L21.3 7.3L22.1 7.6L22.9 7.9L23.7 8.1L24.5 8.2L25.3 8.3L26.1 8.2L27 8.2L27.9 8L28.9 7.8L29.9 7.6L31 7.6L30.2 8.4L29.4 9L28.5 9.6L27.6 10L26.6 10.4L25.6 10.7L24.5 10.8L23.4 10.8L22.4 10.7L21.3 10.5L20.3 10.2L19.3 9.9L18.3 9.5L17.3 9.1L16.4 8.6L15.5 8.2L14.7 7.9L13.9 7.6L13.1 7.3L12.3 7.1L11.5 7L10.7 6.9L9.9 7L9 7L8.1 7.2L7.1 7.4L6.1 7.6Z",
} as const;
