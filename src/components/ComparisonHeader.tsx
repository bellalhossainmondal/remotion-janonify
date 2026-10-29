import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";

interface ComparisonHeaderProps {
  title?: string;
  delay?: number;
  yPosition?: number;
  color?: string;
  fontSize?: number;
  shadowColor?: string;
}

export const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({
  title = "পার্থক্য কী?",
  delay = 2,
  yPosition = 90,
  color,
  fontSize,
  shadowColor,
}) => {
  const frame = useCurrentFrame();

  // Subtle breathing floating motion
  const floatY = Math.sin(frame / 35) * 3;

  // Shadow / Glow styling
  const isValidShadow = Boolean(
    shadowColor && shadowColor.trim() && shadowColor.trim() !== "#"
  );
  const textShadowStyle = isValidShadow
    ? shadowColor!.includes("px")
      ? shadowColor!
      : `0 4px 20px ${shadowColor}, 0 2px 8px ${shadowColor}`
    : "0 4px 16px rgba(0, 0, 0, 0.08)";

  return (
    <div
      style={{
        position: "absolute",
        top: yPosition,
        left: "50%",
        transform: `translateX(-50%) translateY(${floatY}px)`,
        opacity: 1,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <h1
        style={{
          margin: 0,
          padding: 0,
          fontFamily: theme.fonts.bengali,
          fontSize: fontSize ?? 82,
          fontWeight: theme.weights.bold,
          color: color || theme.colors.darkText,
          letterSpacing: 0,
          textShadow: textShadowStyle,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>
      {/* Decorative accent underline */}
      <div
        style={{
          width: 260,
          height: 5,
          borderRadius: 3,
          background: "linear-gradient(90deg, transparent, #ff0000ff 15%, #ff0000ff 50%, #ff0000ff 85%, transparent)",
          boxShadow: "0 1px 8px rgba(255, 255, 255, 1)",
          marginTop: 10,
        }}
      />
    </div>
  );
};
