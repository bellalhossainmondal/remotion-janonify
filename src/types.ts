export type AspectRatio = "9:16" | "16:9" | "1:1";

export type BoyPose =
  | "none" // No character visible (hidden)
  | "left-boy" // Pointing stick up-left
  | "right-boy" // Pointing stick up-right
  | "thoughtful-boy" // Thoughtful thinking pose
  | "staff" // Pointing stick up-left (alias for left-boy)
  | "staff-flipped" // Pointing stick up-right (alias for right-boy)
  | "outward" // Pointing both hands outward to both cards
  | "comment" // Holding / pointing at speech / comment bubble
  | "speech" // Alias for comment
  | "thoughtful" // Thoughtful thinking pose (alias for thoughtful-boy)
  | "excitement"; // Excitement pose

export type CardFocus = "none" | "left" | "right" | "both";

export interface ComparisonCard {
  id: "left" | "right";
  label: string;
  sublabel?: string;
  headerTag?: string;
  image: string; // Filename in public folder
  glowColor: string;
  badgeColor?: string;
  textColor?: string; // Normal label text color (default: #0F172A)
  labelColor?: string; // Alias for textColor
  activeTextColor?: string; // Text color when active/focused
  activeLabelColor?: string; // Alias for activeTextColor
  sublabelColor?: string; // Sublabel text color (default: #64748B)
  showSublabel?: boolean; // Set to true to display sublabel below card label
}

export type SoundEffectType =
  | "whoosh-soft"
  | "whoosh"
  | "pop"
  | "click"
  | "chime"
  | "thud"
  | "none"
  | string;

export interface KeyPoint {
  id: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  title?: string;
  lines?: string[];
  subtext?: string;
  focusCard: CardFocus;
  boyPose: BoyPose;
  soundEffect?: SoundEffectType; // Sound to play when this key point starts ("whoosh", "whoosh-soft", "pop", "click", "chime", "thud", "none")
  soundVolume?: number; // Volume for the sound effect (0.0 to 1.0, defaults to 0.28)
  highlightWords?: string[];
  showMotionGraphics?: boolean; // Set to false to hide motion graphics visual for this specific scene
}

export interface SubtitleWord {
  text: string;
  start_time: number;
  end_time: number;
}

export interface SubtitleSegment {
  text: string;
  start_time: number;
  end_time: number;
  words: SubtitleWord[];
}

export interface TemplateConfig {
  mainTitle: string;
  mainTitleColor?: string; // Custom color for main title text (default: #0F172A)
  mainTitleSize?: number; // Custom font size for main title (default: 82)
  mainTitleShadowColor?: string; // Custom shadow/glow color for main title (e.g. "#ffffffff" ya "rgba(0,0,0,0.15)")
  fps: number;
  durationInSeconds: number;
  voiceoverSrc: string;
  vsImage?: string;
  watermarkImage: string;
  showSubtitles?: boolean; // Set to true to show bottom word-by-word subtitle bar
  subtitleReadingColor?: string; // Active karaoke reading word highlight color (matching virus-vs-worm)
  subtitleReadingShadowColor?: string; // Custom shadow/glow color for active reading word (defaults to readingColor with alpha)
  showMotionGraphics?: boolean; // Set to true to show animated topic motion graphics visuals
  leftCard: ComparisonCard;
  rightCard: ComparisonCard;
  keyPoints: KeyPoint[];
  segments: SubtitleSegment[];
}
