import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { SubtitleSegment } from "../types";
import { theme } from "../theme";
import { sp } from "../utils";

interface SubtitleKaraokeProps {
  segments: SubtitleSegment[];
  yPosition?: number;
  readingColor?: string;
  readingShadowColor?: string;
}

/* ---------- Smooth animation helpers ---------- */

const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
};

type RGB = [number, number, number];

interface ParsedColor {
  rgb: RGB;
  a: number;
}

/**
 * Supports:
 * #RGB
 * #RGBA
 * #RRGGBB
 * #RRGGBBAA
 * rgb(255, 77, 0)
 * rgba(255, 77, 0, 0.8)
 */
const parseColor = (
  input: string | undefined,
  fallback: RGB
): ParsedColor => {
  if (!input || !input.trim()) {
    return { rgb: fallback, a: 1 };
  }

  const s = input.trim();

  // HEX color formats
  if (s.startsWith("#")) {
    let h = s.slice(1);

    // Expand shorthand HEX: #RGB or #RGBA
    if (h.length === 3 || h.length === 4) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }

    // Validate and parse #RRGGBB or #RRGGBBAA
    if (
      (h.length === 6 || h.length === 8) &&
      /^[0-9a-fA-F]+$/.test(h)
    ) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);

      // The last two HEX digits represent alpha
      const a =
        h.length === 8
          ? parseInt(h.slice(6, 8), 16) / 255
          : 1;

      return {
        rgb: [r, g, b],
        a,
      };
    }

    return { rgb: fallback, a: 1 };
  }

  // rgb() / rgba() formats
  const match = s.match(
    /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i
  );

  if (match) {
    const r = Number(match[1]);
    const g = Number(match[2]);
    const b = Number(match[3]);
    const a = match[4] !== undefined ? Number(match[4]) : 1;

    if (
      [r, g, b, a].every(Number.isFinite) &&
      r >= 0 &&
      r <= 255 &&
      g >= 0 &&
      g <= 255 &&
      b >= 0 &&
      b <= 255 &&
      a >= 0 &&
      a <= 1
    ) {
      return {
        rgb: [r, g, b],
        a,
      };
    }
  }

  return { rgb: fallback, a: 1 };
};

/** Smoothly mix two RGB colors */
const mix = (a: number[], b: number[], t: number) =>
  a.map((v, i) => v + (b[i] - v) * t);

/** Convert RGB to CSS rgba() */
const rgba = (c: number[], a: number) =>
  `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(
    c[2]
  )}, ${Math.max(0, Math.min(1, a))})`;

/**
 * SubtitleKaraoke Component
 *
 * Frame-synced karaoke subtitles with:
 * - Smooth word highlighting
 * - 3/4/6/8-digit HEX support
 * - RGB/RGBA support
 * - Configurable reading color and glow
 * - Smooth entrance and exit animations
 */
export const SubtitleKaraoke: React.FC<SubtitleKaraokeProps> = ({
  segments,
  yPosition,
  readingColor = "#183153",
  readingShadowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const currentTime = frame / fps;

  // Find the currently active subtitle segment
  const activeSegment = segments.find(
    (seg) =>
      currentTime >= seg.start_time - 0.15 &&
      currentTime <= seg.end_time + 0.25
  );

  const is9x16 = height > width;
  const is16x9 = width > height;

  const bannerWidth = is9x16 ? 992 : is16x9 ? 880 : 860;
  const actualY = is9x16 ? 780 : is16x9 ? 590 : 560;

  if (!activeSegment) {
    return null;
  }

  /* ---------- Fixed color parsing ---------- */

  const activeColor = parseColor(readingColor, [24, 49, 83]);

  const glowColor = parseColor(
    readingShadowColor ?? readingColor,
    activeColor.rgb
  );

  const activeRgb = activeColor.rgb;
  const pastRgb: RGB = [15, 23, 42];
  const upcomingRgb: RGB = [15, 23, 42];

  const upcomingAlpha = 0.45;

  const glowRgb = glowColor.rgb;
  const glowAlpha = glowColor.a;

  /* ---------- Segment animation ---------- */

  const segmentStartFrame = Math.round(
    activeSegment.start_time * fps
  );

  const p = sp(
    frame,
    segmentStartFrame,
    fps,
    theme.spring.snappy
  );

  const segExit = interpolate(
    currentTime,
    [
      activeSegment.end_time + 0.05,
      activeSegment.end_time + 0.25,
    ],
    [0, 1],
    {
      easing: ease.inOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const words = activeSegment.words;

  return (
    <div
      style={{
        position: "absolute",
        top: yPosition ?? actualY,
        left: "50%",
        transform: `translateX(-50%) translateY(${segExit * -6
          }px) scale(${Math.min(1, 0.95 + p * 0.05)})`,
        opacity: Math.min(1, p * 1.5) * (1 - segExit),
        zIndex: 32,
        pointerEvents: "none",
        width: bannerWidth,
        maxWidth: "92%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 12px",
          lineHeight: 1.35,
          textAlign: "center",
          width: "100%",
        }}
      >
        {words.map((w, idx) => {
          // Keep the current word highlighted until the next word starts
          const nextStart =
            idx < words.length - 1
              ? words[idx + 1].start_time
              : w.end_time + 0.2;

          const holdEnd = Math.max(w.end_time, nextStart);

          // Word entrance animation
          const pIn = interpolate(
            currentTime,
            [w.start_time - 0.12, w.start_time + 0.1],
            [0, 1],
            {
              easing: ease.out,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          // Word exit animation
          const pOut = interpolate(
            currentTime,
            [holdEnd - 0.04, holdEnd + 0.18],
            [0, 1],
            {
              easing: ease.inOut,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const focus = pIn * (1 - pOut);

          // Upcoming -> active -> previously read
          const base = mix(upcomingRgb, activeRgb, pIn);
          const col = mix(base, pastRgb, pOut);

          const colAlpha =
            upcomingAlpha + (1 - upcomingAlpha) * pIn;

          // Smooth scale and lift
          const scale = 1 + 0.12 * focus;
          const lift = -3 * focus;

          // Apply the configured glow color's alpha
          const glowOpacity = 0.65 * focus * glowAlpha;

          return (
            <span
              key={idx}
              style={{
                fontFamily: theme.fonts.bengali,
                fontSize: is9x16 ? 40 : 32,
                fontWeight: theme.weights.extrabold,
                color: rgba(col, colAlpha),
                transform: `translateY(${lift}px) scale(${scale})`,
                display: "inline-block",
                letterSpacing: 0,
                willChange: "transform, color",
                textShadow: [
                  `0 0 ${24 * focus}px ${rgba(
                    glowRgb,
                    glowOpacity
                  )}`,
                  "0 2px 14px rgba(255,255,255,0.95)",
                  "0 0 26px rgba(255,255,255,0.88)",
                ].join(", "),
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};