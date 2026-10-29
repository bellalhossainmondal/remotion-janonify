import React from "react";
import { Audio, staticFile, Sequence } from "remotion";
import { toFrame } from "../utils";
import { KeyPoint } from "../types";

interface SoundEffectsProps {
  keyPoints?: KeyPoint[];
  fps: number;
}

/**
 * Maps sound effect identifier to actual audio file in public directory
 */
const resolveSfxPath = (sfx: string): string => {
  if (sfx.startsWith("sfx/") || sfx.includes("/")) {
    return sfx;
  }
  switch (sfx) {
    case "whoosh":
      return "sfx/whoosh.wav";
    case "whoosh-soft":
      return "sfx/whoosh-soft.wav";
    case "pop":
      return "sfx/pop.wav";
    case "click":
      return "sfx/click.wav";
    case "chime":
      return "sfx/chime.wav";
    case "thud":
      return "sfx/thud.wav";
    default:
      return sfx.endsWith(".wav") || sfx.endsWith(".mp3")
        ? `sfx/${sfx}`
        : `sfx/${sfx}.wav`;
  }
};

export const SoundEffects: React.FC<SoundEffectsProps> = ({ keyPoints = [], fps }) => {
  return (
    <>
      {/* 1. Intro opening card pops and VS thud */}
      <Sequence from={5} durationInFrames={25}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.25} />
      </Sequence>
      <Sequence from={8} durationInFrames={25}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.25} />
      </Sequence>
      <Sequence from={12} durationInFrames={30}>
        <Audio src={staticFile("sfx/thud.wav")} volume={0.3} />
      </Sequence>

      {/* 2. Dynamically driven KeyPoint & BoyPose transition sound effects */}
      {keyPoints.map((point, index) => {
        // Explicitly disabled
        if (point.soundEffect === "none") {
          return null;
        }

        // Determine sound to play:
        // Either explicitly configured in point.soundEffect, or auto-whoosh on pose/focus transition
        let sfxName = point.soundEffect;
        if (!sfxName) {
          // If at time 0, don't trigger whoosh (opening pops handle it)
          if (point.startTime <= 0.1) {
            return null;
          }
          // Default transition sound when boyPose or focus changes
          sfxName = "whoosh-soft";
        }

        const sfxPath = resolveSfxPath(sfxName);
        // Short transient sound effects (pop, click) need higher volume to punch through voiceover
        const defaultVolume =
          sfxName === "pop" || sfxName === "click"
            ? 0.85
            : sfxName === "thud"
            ? 0.5
            : 0.35;
        const volume = point.soundVolume ?? defaultVolume;
        const fromFrame = toFrame(point.startTime, fps);

        return (
          <Sequence key={`${point.id}-${index}`} from={fromFrame} durationInFrames={35}>
            <Audio src={staticFile(sfxPath)} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};
