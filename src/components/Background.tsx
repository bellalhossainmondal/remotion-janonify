import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { breathe } from "../utils";

interface BackgroundProps {
  watermarkImage?: string;
  watermarkOpacity?: number;
  watermarkY?: string | number;
  watermarkWidth?: number | string;
}

/**
 * Pure CSS Procedural Pastel Sky-to-Sunrise Gradient Background.
 * Zero image dependencies for the background — generated completely with
 * mathematical color stops, radial sunrise glows, and ambient atmospheric haze.
 */
export const Background: React.FC<BackgroundProps> = ({
  watermarkImage = "watermark.png",
  watermarkOpacity = 0.22,
  watermarkY = "85%",
  watermarkWidth = 650,
}) => {
  const frame = useCurrentFrame();

  // Gentle morning ambient light breathing
  const sunPulse = 1 + Math.sin(frame / 55) * 0.04;
  const skyShiftY = Math.sin(frame / 70) * 12;
  const horizonGlow = 0.45 + Math.sin(frame / 45) * 0.05;

  // Watermark micro-breathing
  const b = breathe(frame, 0, 0.018, 3);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#F5F7EE" }}>
      {/* 1. Master Pastel Sky-to-Sunrise Linear Gradient (Exact color-sampled from reference) */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          background: `linear-gradient(
            180deg,
            #52ACF8 0%,
            #68BFFC 5%,
            #8DD1FE 12%,
            #AADDFC 22%,
            #C6EAFD 32%,
            #DCF4FC 42%,
            #F2F8F5 52%,
            #FCFAE7 62%,
            #FEF7D4 72%,
            #FDF5C2 82%,
            #FEEFA4 90%,
            #FDD988 97%,
            #FABF7E 100%
          )`,
          transform: `translateY(${skyShiftY * 0.4}px)`,
        }}
      />

      {/* 2. Sunrise Horizon Sun Glow (Lower-Third Warm Flare) */}
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 900,
          borderRadius: "50%",
          bottom: -350,
          left: "50%",
          transform: `translateX(-50%) scale(${sunPulse})`,
          background: `radial-gradient(
            ellipse at center,
            rgba(255, 235, 140, ${horizonGlow}) 0%,
            rgba(255, 245, 180, 0.28) 45%,
            rgba(255, 255, 255, 0.12) 65%,
            transparent 80%
          )`,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* 3. Upper Atmospheric Azure Luminance */}
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 700,
          borderRadius: "50%",
          top: -250,
          left: "50%",
          transform: "translateX(-50%)",
          background: `radial-gradient(
            ellipse at center,
            rgba(100, 205, 255, 0.35) 0%,
            rgba(170, 230, 255, 0.18) 50%,
            transparent 75%
          )`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* 4. Subtle Floating Morning Light Particles / Orbs */}
      <div
        style={{
          position: "absolute",
          width: 480,
          height: 480,
          borderRadius: "50%",
          top: "22%",
          left: "-8%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, transparent 70%)",
          filter: "blur(35px)",
          transform: `translateY(${Math.sin(frame / 40) * 16}px)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          bottom: "26%",
          right: "-6%",
          background: "radial-gradient(circle, rgba(255, 220, 120, 0.28) 0%, transparent 70%)",
          filter: "blur(35px)",
          transform: `translateY(${Math.cos(frame / 45) * 14}px)`,
          pointerEvents: "none",
        }}
      />

      {/* 5. Lower Watermark Logo (Positioned over lower legs/feet per user design) */}
      {watermarkImage && (
        <div
          style={{
            position: "absolute",
            top: watermarkY,
            left: "50%",
            transform: `translate(-50%, -50%) scale(${b.scale}) translateY(${b.y}px)`,
            opacity: watermarkOpacity,
            pointerEvents: "none",
            width: watermarkWidth,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile(watermarkImage)}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "contrast(96%)",
            }}
          />
        </div>
      )}

      {/* 6. Specular Top & Bottom Contrast Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 20%, transparent 80%, rgba(255,220,100,0.18) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
