import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/HindSiliguri";

// Hind Siliguri: correct Bengali conjuncts (juktakkhor) + clean Latin glyphs (matching virus-vs-worm).
const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700"],
  subsets: ["bengali", "latin"],
});

export const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

export const alpha = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const theme = {
  colors: {
    darkText: "#0F172A",
    bodyText: "#1E293B",
    dimText: "#64748B",
    lightText: "#F8FAFC",
    pureWhite: "#FFFFFF",
    cyan: "#00D2FF",
    blue: "#0A84FF",
    indigo: "#6366F1",
    amber: "#F59E0B",
    orange: "#FF6B00",
    emerald: "#10B981",
    rose: "#F43F5E",
    bgSoft: "#EAF2F8",
    cardBg: "rgba(255, 255, 255, 0.85)",
  },
  fonts: {
    display: `${fontFamily}, "Noto Sans Bengali", sans-serif`,
    bengali: `${fontFamily}, "Noto Sans Bengali", sans-serif`,
    tech: `${fontFamily}, "Noto Sans Bengali", sans-serif`,
  },
  weights: {
    body: 500,
    semibold: 600,
    bold: 700,
    extrabold: 700,
  },
  weight: { body: 500, strong: 600, display: 700 },
  radius: {
    card: 28,
    pill: 999,
    tile: 20,
  },
  shadows: {
    card: "0 20px 45px -12px rgba(15, 23, 42, 0.22)",
    cardActiveCyan: "0 0 50px rgba(0, 210, 255, 0.55), 0 25px 50px -12px rgba(0, 210, 255, 0.35)",
    cardActiveBlue: "0 0 50px rgba(10, 132, 255, 0.55), 0 25px 50px -12px rgba(10, 132, 255, 0.35)",
    textShadow: "0 3px 12px rgba(0, 0, 0, 0.18)",
    badge: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    bouncy: { damping: 11, stiffness: 175, mass: 0.75 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    pop: { damping: 9, stiffness: 210, mass: 0.5 },
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  layout: {
    "9:16": {
      width: 1080,
      height: 1920,
      headerY: 90,
      cardsY: 340,
      cardWidth: 380,
      cardHeight: 380,
      calloutY: 1220,
      characterY: 1460,
      characterHeight: 900,
    },
    "16:9": {
      width: 1920,
      height: 1080,
      headerY: 60,
      cardsY: 260,
      cardWidth: 420,
      cardHeight: 420,
      calloutY: 780,
      characterY: 780,
      characterHeight: 650,
    },
    "1:1": {
      width: 1080,
      height: 1080,
      headerY: 60,
      cardsY: 240,
      cardWidth: 340,
      cardHeight: 340,
      calloutY: 720,
      characterY: 780,
      characterHeight: 580,
    },
  },
} as const;
