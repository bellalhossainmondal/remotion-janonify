import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BoyPose } from "../types";
import { theme } from "../theme";
import { sp, breathe } from "../utils";

interface BoyCharacterProps {
  pose: BoyPose;
  delay?: number;
  yPosition?: number;
  height?: number;
  bottomMargin?: number;
}

const POSE_IMAGES: Record<string, string> = {
  "left-boy": "left-boy.png",
  "right-boy": "right-boy.png",
  staff: "left-boy.png",
  "staff-flipped": "right-boy.png",
  outward: "outward.png",
  speech: "comment.png",
  comment: "comment.png",
  "thoughtful-boy": "thoughtful.png",
  thoughtful: "thoughtful.png",
  excitement: "excitement.png",
};

export const BoyCharacter: React.FC<BoyCharacterProps> = ({
  pose,
  delay = 3,
  yPosition = 1460,
  height = 1000,
  bottomMargin = 44, // Same margin as ComparisonCards left/right (4% of 1080 = 43.2px ≈ 44px)
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If pose is "none", hide character completely
  if (pose === "none") {
    return null;
  }

  // Initial entrance spring (slides up from bottom)
  const entrance = sp(frame, delay, fps, theme.spring.bouncy);
  const translateY = interpolate(entrance, [0, 1], [300, 0]);
  const opacity = Math.min(1, entrance * 1.6);

  // Micro-motion breathing
  const b = breathe(frame, 0, 0.014, 4);

  // right-boy.png is already rendered naturally facing right
  const isFlipped = false;
  const imageFile = POSE_IMAGES[pose] || POSE_IMAGES["left-boy"];

  // Exact shoe alignment with ComparisonCards margin (44px):
  // When pointing left (left-boy/staff), right shoe aligns 44px from right border (+96px shift).
  // When pointing right (right-boy/staff-flipped), left shoe aligns 44px from left border (-96px shift).
  const shoeAlignShiftX =
    pose === "staff" || pose === "left-boy"
      ? 96
      : pose === "staff-flipped" || pose === "right-boy"
      ? -96
      : 0;

  // Distance from bottom of image to actual shoe sole is ~8-10px.
  // Subtracting this offset ensures the actual shoe sole rests exactly at `bottomMargin` (44px).
  const actualShoeBottom = Math.max(0, bottomMargin - 8);

  return (
    <div
      style={{
        position: "absolute",
        bottom: actualShoeBottom,
        left: "50%",
        transform: `translateX(calc(-50% + ${shoeAlignShiftX}px)) translateY(${translateY + b.y}px)`,
        width: "92%",
        maxWidth: 1020,
        height,
        opacity,
        zIndex: 22,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          transform: `scale(${b.scale}) scaleX(${isFlipped ? -1 : 1}) rotate(${isFlipped ? -b.rot : b.rot}deg)`,
          transformOrigin: "bottom center",
          transition: "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.12))",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Img
          src={staticFile(imageFile)}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            objectPosition: "bottom center",
          }}
        />
      </div>
    </div>
  );
};
