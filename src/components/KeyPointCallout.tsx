import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { KeyPoint } from "../types";
import { theme } from "../theme";
import { sp, stripBengali } from "../utils";

interface KeyPointCalloutProps {
  point: KeyPoint;
  fps: number;
}

export const KeyPointCallout: React.FC<KeyPointCalloutProps> = ({ point, fps }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const startFrame = Math.round(point.startTime * fps);
  const endFrame = Math.round(point.endTime * fps);

  // If outside active timeframe or no lines to display
  if (frame < startFrame || frame > endFrame || !point.lines || point.lines.length === 0) {
    return null;
  }

  const localFrame = frame - startFrame;
  const exitDuration = 6;
  const isExiting = frame > endFrame - exitDuration;

  // Spring entrance
  const entrance = sp(localFrame, 0, fps, theme.spring.bouncy);
  const exitProgress = isExiting
    ? interpolate(frame, [endFrame - exitDuration, endFrame], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const opacity = Math.min(1, entrance * 1.5) * (1 - exitProgress);
  const translateY =
    interpolate(entrance, [0, 1], [30, 0]) - exitProgress * 20;

  // Responsive layouts
  const is9x16 = height > width;
  const is16x9 = width > height;

  const isLeft = point.focusCard === "left";
  const isRight = point.focusCard === "right";
  const isBoth = point.focusCard === "both";

  let leftPos = "50%";
  let topPos = is9x16 ? 1040 : is16x9 ? 620 : 640;
  let maxWidth = is9x16 ? 450 : is16x9 ? 380 : 360;
  let fontSize = is9x16 ? (isBoth ? 58 : 50) : (isBoth ? 46 : 40);

  if (isLeft) {
    leftPos = is9x16 ? "23%" : is16x9 ? "18%" : "22%";
    topPos = is9x16 ? 1040 : is16x9 ? 620 : 640;
  } else if (isRight) {
    leftPos = is9x16 ? "77%" : is16x9 ? "82%" : "78%";
    topPos = is9x16 ? 1040 : is16x9 ? 620 : 640;
  } else if (isBoth) {
    leftPos = "50%";
    topPos = is9x16 ? 700 : is16x9 ? 500 : 520;
    maxWidth = is9x16 ? 720 : 640;
  }

  const highlights = point.highlightWords || [];

  return (
    <div
      style={{
        position: "absolute",
        top: topPos,
        left: leftPos,
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        zIndex: 22,
        maxWidth,
        width: "max-content",
        textAlign: "center",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Optional Section Tag */}
      {point.title && (
        <div
          style={{
            fontFamily: theme.fonts.tech,
            fontSize: is9x16 ? 28 : 22,
            fontWeight: theme.weights.extrabold,
            color: isLeft ? "#0284C7" : isRight ? "#2563EB" : theme.colors.amber,
            textTransform: "uppercase",
            letterSpacing: 2.2,
            marginBottom: 8,
            textShadow: "0 2px 10px rgba(255, 255, 255, 0.9)",
          }}
        >
          {point.title}
        </div>
      )}

      {/* Main Bullet Lines */}
      {(point.lines || []).map((line, lineIdx) => {
        const lineDelay = lineIdx * 3;
        const lineP = sp(localFrame, lineDelay, fps, theme.spring.snappy);
        const lineY = interpolate(lineP, [0, 1], [15, 0]);

        return (
          <div
            key={lineIdx}
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize,
              fontWeight: theme.weights.bold,
              color: theme.colors.darkText,
              lineHeight: 1.28,
              letterSpacing: 0,
              opacity: Math.min(1, lineP * 1.5),
              transform: `translateY(${lineY}px)`,
              textShadow:
                "0 2px 12px rgba(255, 255, 255, 0.95), 0 0 25px rgba(255, 255, 255, 0.8)",
              whiteSpace: "pre-wrap",
            }}
          >
            {line.split(" ").map((word, wordIdx) => {
              const clean = stripBengali(word).toLowerCase();
              const isHighlight = highlights.some(
                (h) => stripBengali(h).toLowerCase() === clean
              );

              return (
                <span
                  key={wordIdx}
                  style={{
                    color: isHighlight
                      ? isLeft
                        ? "#0284C7"
                        : isRight
                        ? "#1D4ED8"
                        : "#D97706"
                      : theme.colors.darkText,
                    fontWeight: isHighlight
                      ? theme.weights.extrabold
                      : theme.weights.bold,
                    marginRight: 8,
                    display: "inline-block",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
