import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { TEMPLATE_CONFIG } from "./templateConfig";

export const Root: React.FC = () => {
  const fps = TEMPLATE_CONFIG.fps || 30;
  const durationInFrames = Math.ceil(TEMPLATE_CONFIG.durationInSeconds * fps);

  return (
    <>
      {/* 1. Default 9:16 Vertical Video (Reels / Shorts / TikTok) */}
      <Composition
        id="Main-9-16"
        component={Main}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          config: TEMPLATE_CONFIG,
        }}
      />

      {/* 2. 16:9 Landscape Video (YouTube Standard) */}
      <Composition
        id="Main-16-9"
        component={Main}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          config: TEMPLATE_CONFIG,
        }}
      />

      {/* 3. 1:1 Square Video (Instagram / Facebook Feed) */}
      <Composition
        id="Main-1-1"
        component={Main}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1080}
        defaultProps={{
          config: TEMPLATE_CONFIG,
        }}
      />
    </>
  );
};
