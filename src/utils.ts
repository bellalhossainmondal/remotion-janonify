import { interpolate, spring } from "remotion";
import { theme } from "./theme";

/**
 * 0..1 progress between [start, start + dur] with easing; clamped.
 */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  easing: (t: number) => number = theme.ease.out
) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/**
 * Spring helper with clamped start frame.
 */
export const sp = (
  frame: number,
  delay: number,
  fps: number,
  config: { damping: number; stiffness: number; mass: number } = theme.spring.snappy
) => spring({ frame: Math.max(0, frame - delay), fps, config });

/**
 * Idle breathing micro-motion for characters or elements so they never look like a static JPEG.
 */
export const breathe = (frame: number, phase = 0, scaleAmp = 0.018, yAmp = 5) => ({
  scale: 1 + Math.sin(frame / 20 + phase) * scaleAmp,
  y: Math.sin(frame / 26 + phase) * yAmp,
  rot: Math.sin(frame / 36 + phase) * 0.8,
});

/**
 * Floating motion for cards or badges.
 */
export const floatMotion = (frame: number, speed = 25, amp = 6) => ({
  y: Math.sin(frame / speed) * amp,
  x: Math.cos(frame / (speed * 1.3)) * (amp * 0.4),
});

/**
 * Convert seconds to frame number.
 */
export const toFrame = (sec: number, fps = 30) => Math.round(sec * fps);

/**
 * Clean text from Bengali punctuation.
 */
export const stripBengali = (text: string) =>
  text.replace(/[।,?!.:;'"“”]/g, "").trim();
