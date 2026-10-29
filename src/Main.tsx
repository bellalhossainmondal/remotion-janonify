import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, Interactive } from "remotion";
import { TemplateConfig } from "./types";
import { TEMPLATE_CONFIG } from "./templateConfig";
import { Background } from "./components/Background";
import { ComparisonHeader } from "./components/ComparisonHeader";
import { ComparisonCards } from "./components/ComparisonCards";
import { BoyCharacter } from "./components/BoyCharacter";
import { TopicMotionGraphics } from "./components/TopicMotionGraphics";
import { SubtitleKaraoke } from "./components/SubtitleKaraoke";
import { SoundEffects } from "./components/SoundEffects";

interface MainProps {
  config?: TemplateConfig;
}

export const Main: React.FC<MainProps> = ({ config = TEMPLATE_CONFIG }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const currentTime = frame / fps;

  // Find currently active key point / scene
  const activePoint =
    config.keyPoints.find(
      (p) => currentTime >= p.startTime && currentTime < p.endTime
    ) || config.keyPoints[config.keyPoints.length - 1];

  // Responsive dimensions
  const is9x16 = height > width;
  const is16x9 = width > height;

  const headerY = is9x16 ? 65 : is16x9 ? 40 : 50;
  const cardsY = is9x16 ? 220 : is16x9 ? 170 : 170;
  const cardWidth = is9x16 ? 400 : is16x9 ? 380 : 340;
  const cardHeight = is9x16 ? 400 : is16x9 ? 380 : 340;
  const characterHeight = is9x16 ? 1000 : is16x9 ? 650 : 600;
  // Matching ComparisonCards horizontal margin: (1080 - 1080*0.92)/2 = 43.2px ≈ 44px
  const characterBottom = is9x16 ? 60 : is16x9 ? 30 : 30;

  return (
    <>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {/* 1. Procedural CSS Sky-to-Sunrise Background with Tulanify watermark at lower legs */}
        <Background
          watermarkImage={config.watermarkImage}
          watermarkOpacity={0.15}
          watermarkY={is9x16 ? "90%" : "80%"}
          watermarkWidth={is9x16 ? 800 : 700}
        />
      
        {/* 2. Top Comparison Title Header */}
        <ComparisonHeader
          title={config.mainTitle}
          yPosition={headerY}
          delay={2}
          color={config.mainTitleColor}
          fontSize={config.mainTitleSize}
          shadowColor={config.mainTitleShadowColor}
        />
      
        {/* 3. Side-by-Side Comparison Cards with 3D VS badge */}
        <ComparisonCards
          leftCard={config.leftCard}
          rightCard={config.rightCard}
          activeFocus={activePoint.focusCard}
          vsImage={config.vsImage}
          yPosition={cardsY}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          delay={5}
        />
      
        {/* 4. Subtitle Karaoke Banner (Directly below cards) */}
        {config.showSubtitles && (
          <SubtitleKaraoke
            segments={config.segments}
            yPosition={is9x16 ? 780 : is16x9 ? 590 : 560}
            readingColor={config.subtitleReadingColor}
            readingShadowColor={config.subtitleReadingShadowColor}
          />
        )}
      
        {/* 5. Topic Motion Graphics Visuals in designated animation zone */}
        {(config.showMotionGraphics ?? true) && (activePoint.showMotionGraphics ?? true) && (
          <TopicMotionGraphics point={activePoint} fps={fps} />
        )}
      
        {/* 6. Boy Character with dynamic pose transitions and shoe margin alignment */}
        <BoyCharacter
          pose={activePoint.boyPose}
          height={characterHeight}
          bottomMargin={characterBottom}
          delay={4}
        />
      
        {/* 7. Primary Voiceover Audio */}
        {config.voiceoverSrc && (
          <Audio src={staticFile(config.voiceoverSrc)} volume={1.0} />
        )}
      
        {/* 8. Synchronized Motion Graphics Sound Effects */}
        <SoundEffects keyPoints={config.keyPoints} fps={fps} />
      </AbsoluteFill>
    </>
  );
};
