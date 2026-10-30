import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { KeyPoint } from "../types";
import { theme } from "../theme";
import { sp } from "../utils";

interface TopicMotionGraphicsProps {
  point: KeyPoint;
  fps: number;
}

/**
 * TopicMotionGraphics — Printer vs Scanner (Assamese Hardware Transfer)
 * ─────────────────────────────────────────────────────────────
 * 100% TRANSPARENT background.
 * Procedural SVG hardware art with prominent 33px Assamese text chips.
 *
 * LEFT  — Printer (8.50s → 28.50s)
 *   1. printOutputDevice (9.26s):  Paper feeding through rollers, CMYK printhead droplets
 *   2. printSoftToHard   (22.82s): Screen soft copy converting to physical hard paper copy
 *
 * RIGHT — Scanner (28.50s → 55.20s)
 *   3. scanInputOptical  (29.02s): Flatbed glass with glowing optical CIS scanning carriage beam
 *   4. scanHardToSoft    (49.20s): Physical paper sheet converting to digital PDF on computer
 */

/* ─── Tokens ─────────────────────────────────────────────── */
const DS = {
  font: `"Hind Siliguri","Noto Sans Bengali","Poppins","Segoe UI",system-ui,sans-serif`,
  mono: `"JetBrains Mono","Roboto Mono",ui-monospace,monospace`,
  ink:   "#0B1F4B",
  blue:  { a: "#1D4ED8", b: "#3B82F6" },
  green: { a: "#047857", b: "#10B981" },
  amber: { a: "#C2410C", b: "#F97316" },
  cyan:  { a: "#0284C7", b: "#00E5FF" },
  spring: {
    pop:  { damping: 12, stiffness: 170, mass: 0.7 },
    soft: { damping: 20, stiffness: 100, mass: 1.0 },
  },
};

const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in:  Easing.bezier(0.55, 0, 1, 0.45),
};

const STAGE_W = 520;
const STAGE_H = 400;
const ART_H   = 320;
const TEXT_TOP = 312;

/* ─── Helpers ─────────────────────────────────────────────── */
const c01 = (n: number) => Math.max(0, Math.min(1, n));
const sec = (fps: number, s: number) => Math.round(s * fps);
const pop = (f: number, at: number, fps: number, cfg = DS.spring.pop) =>
  spring({ frame: Math.max(0, f - sec(fps, at)), fps, config: cfg });

type Art = React.FC<{ f: number; t: number; fps: number }>;

/* ─── Entrance Wrapper ────────────────────────────────────── */
const In: React.FC<{ f: number; fps: number; at: number; dy?: number; children: React.ReactNode }> = ({
  f, fps, at, dy = 18, children,
}) => {
  const p = pop(f, at, fps);
  return (
    <g style={{
      opacity: c01(p * 1.9),
      transform: `translateY(${(1 - p) * dy}px) scale(${0.86 + 0.14 * p})`,
      transformBox: "fill-box", transformOrigin: "50% 50%",
    }}>{children}</g>
  );
};

/* ─── SVG Realistic Defs ──────────────────────────────────── */
const Defs: React.FC = () => (
  <defs>
    <linearGradient id="g-printer-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#475569"/>
      <stop offset="40%" stopColor="#334155"/>
      <stop offset="100%" stopColor="#0F172A"/>
    </linearGradient>

    <linearGradient id="g-scanner-glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3"/>
      <stop offset="50%" stopColor="#0284C7" stopOpacity="0.1"/>
      <stop offset="100%" stopColor="#10B981" stopOpacity="0.25"/>
    </linearGradient>

    <linearGradient id="g-scan-light" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.95"/>
      <stop offset="50%" stopColor="#10B981" stopOpacity="0.8"/>
      <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
    </linearGradient>

    <linearGradient id="g-paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#FFFFFF"/>
      <stop offset="100%" stopColor="#F1F5F9"/>
    </linearGradient>

    <filter id="f-real-drop" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#060C1E" floodOpacity="0.38"/>
    </filter>
    <filter id="f-scan-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);

/* ══════════════════════════════════════════════════════════════
   LEFT — PRINTER (আউটপুট: চফ্ট কপি → হাৰ্ড কপি)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 1: Precision Paper Feed & CMYK Printhead (8.50s – 22.82s) ── */
const ArtPrintOutputDevice: Art = ({ f, t, fps }) => {
  const paperFeedY = interpolate((t * 2) % 1, [0, 1], [-20, 25]);
  const headX = Math.sin(t * 8) * 60;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <polygon points="-110,60 110,60 85,100 -85,100" fill="#1E293B" stroke="#475569" strokeWidth="2"/>

          <g transform={`translate(0, ${paperFeedY})`}>
            <rect x="-80" y="0" width="160" height="95" rx="3" fill="url(#g-paper)" stroke="#CBD5E1" strokeWidth="1.5"/>
            {[-35, -15, 5, 25].map((ly) => (
              <line key={ly} x1="-60" y1={ly + 30} x2="60" y2={ly + 30} stroke="#334155" strokeWidth="2.5" strokeDasharray="10 4"/>
            ))}
          </g>

          <rect x="-140" y="-70" width="280" height="135" rx="14" fill="url(#g-printer-body)" stroke="#64748B" strokeWidth="3"/>
          <rect x="-95" y="15" width="190" height="16" rx="4" fill="#020617"/>

          <rect x="-115" y="-35" width="230" height="6" rx="2" fill="#64748B"/>
          <g transform={`translate(${headX}, -40)`}>
            <rect x="-24" y="-8" width="48" height="24" rx="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5"/>
            <circle cx="-12" cy="18" r="2.5" fill="#00E5FF"/>
            <circle cx="-4"  cy="18" r="2.5" fill="#EC4899"/>
            <circle cx="4"   cy="18" r="2.5" fill="#FACC15"/>
            <circle cx="12"  cy="18" r="2.5" fill="#0F172A"/>
          </g>

          <rect x="75" y="-55" width="42" height="18" rx="4" fill="#020617" stroke="#334155" strokeWidth="1"/>
          <circle cx="105" cy="-46" r="3.5" fill="#10B981"/>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 2: Soft Copy to Hard Copy Transfer (22.82s – 28.50s) ── */
const ArtPrintSoftToHard: Art = ({ f, t, fps }) => {
  const pulse = 1 + Math.sin(t * 4) * 0.05;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <g transform="translate(-105, 0)">
            <rect x="-55" y="-60" width="110" height="120" rx="10" fill="#0F172A" stroke="#3B82F6" strokeWidth="3"/>
            <rect x="-45" y="-50" width="90" height="95" rx="5" fill="#1E293B"/>
            <text x="0" y="-15" textAnchor="middle" fontSize={12} fontWeight={900} fill="#38BDF8" fontFamily={DS.mono}>
              DIGITAL
            </text>
            <text x="0" y="5" textAnchor="middle" fontSize={11} fontWeight={700} fill="#94A3B8" fontFamily={DS.font}>
              চফ্ট কপি
            </text>
          </g>

          <g transform={`translate(0, 0) scale(${pulse})`}>
            <line x1="-35" y1="0" x2="30" y2="0" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
            <polygon points="30,-9 45,0 30,9" fill="#3B82F6"/>
          </g>

          <g transform="translate(105, 0)">
            <rect x="-50" y="-60" width="100" height="120" rx="6" fill="url(#g-paper)" stroke="#CBD5E1" strokeWidth="2"/>
            {[-25, -10, 5, 20].map((ly) => (
              <line key={ly} x1="-32" y1={ly} x2="32" y2={ly} stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
            ))}
            <text x="0" y="44" textAnchor="middle" fontSize={12} fontWeight={900} fill="#0F172A" fontFamily={DS.font}>
              হাৰ্ড কপি
            </text>
          </g>
        </g>
      </In>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   RIGHT — SCANNER (ইনপুট: হাৰ্ড কপি → চফ্ট কপি)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 3: Flatbed Optical Scanner Beam (28.50s – 49.20s) ── */
const ArtScanInputOptical: Art = ({ f, t, fps }) => {
  const scanBarY = interpolate((t * 0.9) % 1, [0, 1], [-55, 55]);

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <rect x="-150" y="-80" width="300" height="160" rx="14" fill="url(#g-printer-body)" stroke="#475569" strokeWidth="3"/>
          <rect x="-125" y="-65" width="250" height="130" rx="6" fill="url(#g-scanner-glass)" stroke="#38BDF8" strokeWidth="1.5"/>

          <g opacity={0.65}>
            <rect x="-85" y="-55" width="170" height="110" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1"/>
            {[-35, -15, 5, 25].map((dy) => (
              <line key={dy} x1="-65" y1={dy} x2="65" y2={dy} stroke="#64748B" strokeWidth="2" strokeDasharray="8 4"/>
            ))}
          </g>

          <g transform={`translate(0, ${scanBarY})`}>
            <line x1="-125" y1="0" x2="125" y2="0" stroke="#00E5FF" strokeWidth="4.5" filter="url(#f-scan-glow)"/>
            <rect x="-125" y="0" width="250" height="20" fill="url(#g-scan-light)"/>
          </g>

          <circle cx="120" cy="-60" r="5" fill="#10B981" filter="url(#f-scan-glow)"/>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 4: Hard Copy to Digital Soft Copy Transfer (49.20s – 55.20s) ── */
const ArtScanHardToSoft: Art = ({ f, t, fps }) => {
  const pulse = 1 + Math.sin(t * 4) * 0.05;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <g transform="translate(-105, 0)">
            <rect x="-50" y="-60" width="100" height="120" rx="6" fill="url(#g-paper)" stroke="#CBD5E1" strokeWidth="2"/>
            {[-25, -10, 5, 20].map((ly) => (
              <line key={ly} x1="-32" y1={ly} x2="32" y2={ly} stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
            ))}
            <text x="0" y="44" textAnchor="middle" fontSize={12} fontWeight={900} fill="#0F172A" fontFamily={DS.font}>
              নথিপত্ৰ
            </text>
          </g>

          <g transform={`translate(0, 0) scale(${pulse})`}>
            <line x1="-35" y1="0" x2="30" y2="0" stroke="#10B981" strokeWidth="5" strokeLinecap="round"/>
            <polygon points="30,-9 45,0 30,9" fill="#10B981"/>
          </g>

          <g transform="translate(105, 0)">
            <rect x="-55" y="-60" width="110" height="120" rx="10" fill="#0F172A" stroke="#10B981" strokeWidth="3"/>
            <rect x="-45" y="-50" width="90" height="95" rx="5" fill="#064E3B"/>
            <text x="0" y="-12" textAnchor="middle" fontSize={13} fontWeight={900} fill="#34D399" fontFamily={DS.mono}>
              PDF / JPG
            </text>
            <text x="0" y="10" textAnchor="middle" fontSize={11} fontWeight={700} fill="#E2E8F0" fontFamily={DS.font}>
              ডিজিটেল ফাইল
            </text>
          </g>
        </g>
      </In>
    </>
  );
};

/* ─── Scene Registry & Phase Mappings ───────────────────────── */
type SceneId = "printOutputDevice" | "printSoftToHard" | "scanInputOptical" | "scanHardToSoft";

interface Copy { chip: string; tone: Tone }
type Tone = "blue" | "green" | "amber" | "cyan";

const SCENES: Record<SceneId, { Art: Art; copy: Copy }> = {
  printOutputDevice: { Art: ArtPrintOutputDevice, copy: { chip: "PRINTER · OUTPUT DEVICE",         tone: "blue"  } },
  printSoftToHard:   { Art: ArtPrintSoftToHard,   copy: { chip: "চফ্ট কপি → হাৰ্ড কপি",           tone: "cyan"  } },
  scanInputOptical:  { Art: ArtScanInputOptical,  copy: { chip: "SCANNER · INPUT DEVICE",          tone: "green" } },
  scanHardToSoft:    { Art: ArtScanHardToSoft,    copy: { chip: "হাৰ্ড কপি → ডিজিটেল চফ্ট কপি",   tone: "amber" } },
};

const PHASES = {
  left: [
    { id: "printOutputDevice" as SceneId, from: 8.50  },
    { id: "printSoftToHard"   as SceneId, from: 22.82 },
  ],
  right: [
    { id: "scanInputOptical"  as SceneId, from: 29.02 },
    { id: "scanHardToSoft"    as SceneId, from: 49.20 },
  ],
} as const;

/* ─── Bold & Prominent 33px Text Chip ─────────────────────── */
const TextBlock: React.FC<{ copy: Copy; f: number; t: number; fps: number; idx: number; total: number }> = ({
  copy, f, t, fps, idx, total,
}) => {
  const c =
    copy.tone === "blue"  ? DS.blue  :
    copy.tone === "green" ? DS.green :
    copy.tone === "cyan"  ? DS.cyan  : DS.amber;

  const grad =
    copy.tone === "blue"  ? "linear-gradient(90deg,#1D4ED8,#3B82F6)" :
    copy.tone === "green" ? "linear-gradient(90deg,#047857,#10B981)" :
    copy.tone === "cyan"  ? "linear-gradient(90deg,#0284C7,#00E5FF)" :
                            "linear-gradient(90deg,#C2410C,#F97316)";

  const rise = (p: number): React.CSSProperties => ({
    opacity: c01(p * 1.7),
    transform: `translateY(${(1 - p) * 16}px) scale(${0.9 + 0.1 * p})`,
  });
  const shine = ((t * 0.65) % 1.8) - 0.4;

  return (
    <div style={{
      position: "absolute", left: 0, top: TEXT_TOP, width: STAGE_W,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      fontFamily: DS.font, background: "transparent",
    }}>
      <div style={{
        ...rise(pop(f, 0.08, fps)),
        position: "relative", overflow: "hidden",
        background: grad, color: "#fff",
        fontSize: 33, fontWeight: 900, letterSpacing: 1.2,
        padding: "8px 34px 9px", borderRadius: 999,
        boxShadow: `0 10px 26px ${c.a}77`, border: "4px solid #fff",
        whiteSpace: "nowrap",
      }}>
        {copy.chip}
        <span style={{
          position: "absolute", top: 0, bottom: 0, left: `${shine * 100}%`, width: "38%",
          background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.45), transparent)",
        }} />
      </div>

      {total > 1 && (
        <div style={{ ...rise(pop(f, 0.42, fps)), display: "flex", gap: 8, marginTop: 2 }}>
          {Array.from({ length: total }, (_, i) => (
            <div key={i} style={{
              width: i === idx ? 34 : 11, height: 11, borderRadius: 99,
              background: i === idx ? c.b : "#fff",
              border: `2.5px solid ${i <= idx ? c.b : "#fff"}`,
              boxShadow: "0 2px 6px rgba(11,31,75,.28)",
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Scene Wrapper ─────────────────────────────────────── */
const SceneWrap: React.FC<{ id: SceneId; f: number; t: number; fps: number; idx?: number; total?: number }> = ({
  id, f, t, fps, idx = 0, total = 1,
}) => {
  const { Art: ArtC, copy } = SCENES[id];
  const bob = Math.sin(t * 2.1) * 2.8;
  return (
    <div style={{ position: "absolute", inset: 0, background: "transparent" }}>
      <svg width={STAGE_W} height={ART_H} viewBox={`0 0 ${STAGE_W} ${ART_H}`}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible", background: "transparent",
          transform: `translateY(${bob}px)` }}>
        <Defs />
        <ArtC f={f} t={t} fps={fps} />
      </svg>
      <TextBlock copy={copy} f={f} t={t} fps={fps} idx={idx} total={total} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════════ */
export const TopicMotionGraphics: React.FC<TopicMotionGraphicsProps> = ({ point, fps }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const startFrame  = Math.round(point.startTime * fps);
  const endFrame    = Math.round(point.endTime   * fps);
  const currentTime = frame / fps;

  if (
    frame < startFrame || frame > endFrame ||
    point.id.startsWith("intro") || point.id.includes("cta") ||
    point.id.includes("ending") || point.id.includes("question") ||
    point.id.includes("summary") || currentTime >= 55.20
  ) return null;

  const localFrame  = frame - startFrame;
  const exitDur     = Math.max(4, Math.round(fps * 0.2));
  const isExiting   = frame > endFrame - exitDur;

  const entrance  = sp(localFrame, 0, fps, theme.spring.bouncy);
  const exitP     = isExiting
    ? interpolate(frame, [endFrame - exitDur, endFrame], [0, 1],
        { easing: ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const opacity    = Math.min(1, entrance * 1.5) * (1 - exitP);
  const translateY = interpolate(entrance, [0, 1], [30, 0]) - exitP * 20;
  const scaleIn    = interpolate(entrance, [0, 1], [0.94, 1]);

  const is9x16 = height > width;
  const is16x9 = width  > height;

  const isLeft  = point.focusCard === "left";
  const isRight = point.focusCard === "right";
  if (point.focusCard === "both") return null;

  const cardWidth  = is9x16 ? 520 : is16x9 ? 470 : 420;
  const cardHeight = is9x16 ? 400 : is16x9 ? 360 : 330;
  const topPos     = is9x16 ? 1185 : is16x9 ? 600 : 620;

  let leftPos: string | number = "50%";
  if (isLeft)  leftPos = is9x16 ? 36 : is16x9 ? 50 : 40;
  if (isRight) leftPos = is9x16 ? 1080 - 36 - cardWidth : is16x9 ? 1920 - 50 - cardWidth : 1080 - 40 - cardWidth;

  let side: "left" | "right" | null = null;
  if (point.id.includes("left")  || isLeft  || point.id.includes("print")) side = "left";
  if (point.id.includes("right") || isRight || point.id.includes("scan"))  side = "right";
  if (!side) return null;

  const phases = PHASES[side];
  let idx = 0;
  phases.forEach((p, i) => { if (currentTime >= p.from) idx = i; });

  const phaseStart = (i: number) => i === 0 ? startFrame : Math.round(phases[i].from * fps);
  const f = Math.min(frame - phaseStart(idx), localFrame);
  const t = frame / fps;

  const xf       = Math.round(fps * 0.25);
  const showPrev = idx > 0 && frame - phaseStart(idx) < xf;
  const prevP    = showPrev ? c01((frame - phaseStart(idx)) / xf) : 1;

  const stageScale = Math.min(cardWidth / STAGE_W, cardHeight / STAGE_H);

  return (
    <div style={{
      position: "absolute", top: topPos, left: leftPos,
      width: cardWidth, height: cardHeight,
      transform: `translateY(${translateY}px) scale(${scaleIn})`,
      opacity, zIndex: 16, pointerEvents: "none", background: "transparent",
    }}>
      <div style={{
        position: "absolute", left: "50%", top: 0,
        width: STAGE_W, height: STAGE_H,
        transform: `translateX(-50%) scale(${stageScale})`,
        transformOrigin: "top center", background: "transparent",
      }}>
        {showPrev && (
          <div key={`prev-${idx - 1}`} style={{
            position: "absolute", inset: 0,
            opacity: 1 - ease.in(prevP),
            transform: `translateY(${-16 * ease.in(prevP)}px)`,
          }}>
            <SceneWrap id={phases[idx - 1].id} f={frame - phaseStart(idx - 1)} t={t} fps={fps} idx={idx - 1} total={phases.length} />
          </div>
        )}
        <SceneWrap key={`cur-${idx}`} id={phases[idx].id} f={Math.max(0, f)} t={t} fps={fps} idx={idx} total={phases.length} />
      </div>
    </div>
  );
};