import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { ComparisonCard, CardFocus } from "../types";
import { theme, alpha } from "../theme";
import { floatMotion } from "../utils";

interface ComparisonCardsProps {
  leftCard: ComparisonCard;
  rightCard: ComparisonCard;
  activeFocus: CardFocus;
  vsImage?: string;
  delay?: number;
  yPosition?: number;
  cardWidth?: number;
  cardHeight?: number;
}

export const ComparisonCards: React.FC<ComparisonCardsProps> = ({
  leftCard,
  rightCard,
  activeFocus,
  vsImage = "vs.png",
  delay = 5,
  yPosition = 310,
  cardWidth = 400,
  cardHeight = 400,
}) => {
  const frame = useCurrentFrame();

  // Focus states
  const isLeftActive = activeFocus === "left";
  const isRightActive = activeFocus === "right";

  // Micro floating
  const floatL = floatMotion(frame, 28, 4);
  const floatR = floatMotion(frame + 15, 28, 4);
  const vsPulse = 1 + Math.sin(frame / 14) * 0.05;

  return (
    <div
      style={{
        position: "absolute",
        top: yPosition,
        left: "50%",
        transform: "translateX(-50%)",
        width: "92%",
        maxWidth: 1020,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        zIndex: 15,
      }}
    >
      {/* LEFT CARD: MAC ADDRESS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 1,
          transform: `translateY(${floatL.y}px)`,
          transition: "all 0.3s ease-out",
        }}
      >
        <div
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: theme.radius.card,
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#0F172A",
            border: isLeftActive
              ? `4px solid ${leftCard.glowColor}`
              : "3px solid rgba(15, 23, 42, 0.4)",
            boxShadow: isLeftActive
              ? theme.shadows.cardActiveCyan
              : theme.shadows.card,
            transform: `scale(${isLeftActive ? 1.05 : isRightActive ? 0.96 : 1.0})`,
            filter: isRightActive ? "brightness(0.85) contrast(95%)" : "none",
            transition: "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
          }}
        >
          <Img
            src={staticFile(leftCard.image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />


          {/* Highlight aura overlay */}
          {isLeftActive && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: `inset 0 0 40px ${alpha(leftCard.glowColor, 0.45)}`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* Text Label Below Card */}
        <div
          style={{
            marginTop: 18,
            fontFamily: theme.fonts.tech,
            fontSize: 44,
            fontWeight: theme.weights.extrabold,
            color: isLeftActive
              ? (leftCard.activeTextColor ?? leftCard.activeLabelColor ?? "#00B4D8")
              : (leftCard.textColor ?? leftCard.labelColor ?? theme.colors.darkText),
            letterSpacing: "-0.5px",
            textShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transform: `scale(${isLeftActive ? 1.06 : 1.0})`,
            transition: "color 0.25s ease, transform 0.25s ease",
            textAlign: "center",
          }}
        >
          {leftCard.label}
        </div>

        {/* Optional Sublabel Below Card */}
        {leftCard.sublabel && (leftCard.showSublabel ?? Boolean(leftCard.sublabelColor)) && (
          <div
            style={{
              marginTop: 4,
              fontFamily: theme.fonts.tech,
              fontSize: 20,
              fontWeight: theme.weights.semibold,
              color: leftCard.sublabelColor ?? theme.colors.dimText,
              letterSpacing: 0,
              textAlign: "center",
            }}
          >
            {leftCard.sublabel}
          </div>
        )}
      </div>

      {/* CENTER VS EMBLEM (3D Graphic vs.png) */}
      <div
        style={{
          marginTop: cardHeight * 0.35,
          opacity: 1,
          transform: `scale(${vsPulse})`,
          zIndex: 25,
          userSelect: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Img
          src={staticFile(vsImage)}
          style={{
            width: 155,
            height: "auto",
            objectFit: "contain",
            filter:
              "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 18px rgba(0, 229, 255, 0.32))",
          }}
        />
      </div>

      {/* RIGHT CARD: IP ADDRESS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 1,
          transform: `translateY(${floatR.y}px)`,
          transition: "all 0.3s ease-out",
        }}
      >
        <div
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: theme.radius.card,
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#0F172A",
            border: isRightActive
              ? `4px solid ${rightCard.glowColor}`
              : "3px solid rgba(15, 23, 42, 0.4)",
            boxShadow: isRightActive
              ? theme.shadows.cardActiveBlue
              : theme.shadows.card,
            transform: `scale(${isRightActive ? 1.05 : isLeftActive ? 0.96 : 1.0})`,
            filter: isLeftActive ? "brightness(0.85) contrast(95%)" : "none",
            transition: "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
          }}
        >
          <Img
            src={staticFile(rightCard.image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />



          {/* Highlight aura overlay */}
          {isRightActive && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: `inset 0 0 40px ${alpha(rightCard.glowColor, 0.45)}`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* Text Label Below Card */}
        <div
          style={{
            marginTop: 18,
            fontFamily: theme.fonts.tech,
            fontSize: 44,
            fontWeight: theme.weights.extrabold,
            color: isRightActive
              ? (rightCard.activeTextColor ?? rightCard.activeLabelColor ?? "#2563EB")
              : (rightCard.textColor ?? rightCard.labelColor ?? theme.colors.darkText),
            letterSpacing: "-0.5px",
            textShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transform: `scale(${isRightActive ? 1.06 : 1.0})`,
            transition: "color 0.25s ease, transform 0.25s ease",
            textAlign: "center",
          }}
        >
          {rightCard.label}
        </div>

        {/* Optional Sublabel Below Card */}
        {rightCard.sublabel && (rightCard.showSublabel ?? Boolean(rightCard.sublabelColor)) && (
          <div
            style={{
              marginTop: 4,
              fontFamily: theme.fonts.tech,
              fontSize: 20,
              fontWeight: theme.weights.semibold,
              color: rightCard.sublabelColor ?? theme.colors.dimText,
              letterSpacing: 0,
              textAlign: "center",
            }}
          >
            {rightCard.sublabel}
          </div>
        )}
      </div>
    </div>
  );
};
