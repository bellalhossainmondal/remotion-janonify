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
 * TopicMotionGraphics — Electric Car vs Hybrid Car (Assamese)
 * ─────────────────────────────────────────────────────────────
 * 100% TRANSPARENT background.
 * Procedural SVG automotive engineering graphics with prominent 33px text chips.
 *
 * LEFT  — Electric Car (8.50s → 38.00s)
 *   1. evBatteryMotor   (8.96s):  Underfloor skateboard Li-ion battery pack & e-motor powertrain
 *   2. evPlugCharging   (15.78s): DC Fast Charging plug connecting with glowing electric current
 *   3. evZeroEmission   (23.02s): Zero emission green leaf seal & silent smooth glide motion
 *
 * RIGHT — Hybrid Car (38.00s → 76.80s)
 *   4. hybridDualPower  (38.66s): ICE Petrol Engine paired alongside electric motor & battery
 *   5. hybridAutoShift  (50.72s): Dynamic power-flow split (Low speed = EV, High speed = Petrol)
 *   6. hybridRegenBrake (65.88s): Self-charging regenerative braking kinetic energy recycling
 */

/* ─── Tokens ─────────────────────────────────────────────── */
const DS = {
  font: `"Hind Siliguri","Noto Sans Bengali","Poppins","Segoe UI",system-ui,sans-serif`,
  mono: `"JetBrains Mono","Roboto Mono",ui-monospace,monospace`,
  ink:   "#0B1F4B",
  cyan:  { a: "#0284C7", b: "#00E5FF" },
  green: { a: "#047857", b: "#10B981" },
  amber: { a: "#C2410C", b: "#F97316" },
  blue:  { a: "#1D4ED8", b: "#3B82F6" },
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
    <linearGradient id="g-battery" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#00E5FF"/>
      <stop offset="50%" stopColor="#38BDF8"/>
      <stop offset="100%" stopColor="#0284C7"/>
    </linearGradient>

    <linearGradient id="g-engine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#64748B"/>
      <stop offset="50%" stopColor="#334155"/>
      <stop offset="100%" stopColor="#0F172A"/>
    </linearGradient>

    <linearGradient id="g-eco" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#10B981"/>
      <stop offset="100%" stopColor="#06B6D4"/>
    </linearGradient>

    <filter id="f-real-drop" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#060C1E" floodOpacity="0.38"/>
    </filter>
    <filter id="f-energy-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);

/* ══════════════════════════════════════════════════════════════
   LEFT — ELECTRIC CAR (ইলেকট্ৰিক গাড়ী)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 1: EV Battery Pack & Electric Motor Powertrain (8.96s – 15.78s) ── */
const ArtEvBatteryMotor: Art = ({ f, t, fps }) => {
  const motorSpin = t * 600;
  const pulse = 0.8 + Math.sin(t * 5) * 0.2;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <rect x="-160" y="-45" width="320" height="90" rx="14" fill="#0F172A" stroke="#00E5FF" strokeWidth="2.5"/>

          <rect x="-110" y="-30" width="160" height="60" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5"/>
          {[-95, -70, -45, -20, 5, 30].map((cx) => (
            <rect key={cx} x={cx} y="-22" width="18" height="44" rx="3" fill="url(#g-battery)" opacity={pulse}/>
          ))}

          <path d="M 50 0 L 95 0" stroke="#F97316" strokeWidth="6" strokeLinecap="round"/>

          <g transform="translate(125, 0)">
            <circle cx="0" cy="0" r="34" fill="url(#g-engine)" stroke="#00E5FF" strokeWidth="3"/>
            <circle cx="0" cy="0" r="22" fill="#020617"/>
            <g transform={`rotate(${motorSpin})`}>
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <line key={deg} x1="0" y1="0" x2={Math.cos(deg) * 20} y2={Math.sin(deg) * 20}
                  stroke="#38BDF8" strokeWidth="3" strokeLinecap="round"/>
              ))}
            </g>
          </g>

          {[-140, 140].map((wx) => (
            <g key={wx} transform={`translate(${wx}, 45)`}>
              <circle cx="0" cy="0" r="18" fill="#1E293B" stroke="#64748B" strokeWidth="2"/>
            </g>
          ))}
        </g>
      </In>
    </>
  );
};

/* ── SCENE 2: Direct Plug-in Charging Station (15.78s – 23.02s) ── */
const ArtEvPlugCharging: Art = ({ f, t, fps }) => {
  const currentFlow = (t * 120) % 60;
  const boltPulse = 1 + Math.sin(t * 6) * 0.1;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <g transform="translate(-110, 0)">
            <rect x="-45" y="-80" width="90" height="160" rx="12" fill="#0F172A" stroke="#00E5FF" strokeWidth="3"/>
            <rect x="-32" y="-65" width="64" height="40" rx="5" fill="#020617"/>
            <rect x="-24" y="-55" width="48" height="20" rx="4" fill="#065F46" stroke="#10B981" strokeWidth="1.5"/>
            <text x="0" y="-41" textAnchor="middle" fontSize={11} fontWeight={900} fill="#6EE7B7" fontFamily={DS.mono}>
              100 kW
            </text>
          </g>

          <path d="M -65 15 Q 0 45 65 0" fill="none" stroke="#334155" strokeWidth="10" strokeLinecap="round"/>
          <path d="M -65 15 Q 0 45 65 0" fill="none" stroke="#00E5FF" strokeWidth="3" strokeDasharray="10 8" strokeDashoffset={-currentFlow}/>

          <g transform="translate(85, -5)">
            <rect x="-20" y="-22" width="45" height="44" rx="8" fill="url(#g-engine)" stroke="#38BDF8" strokeWidth="2"/>
            <g transform={`scale(${boltPulse})`} filter="url(#f-energy-glow)">
              <polygon points="-2,-12 4,-12 -1,0 6,0 -4,14 -1,2 -6,2" fill="#FDE047"/>
            </g>
          </g>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 3: Zero Emission Silent Motion (23.02s – 38.00s) ── */
const ArtEvZeroEmission: Art = ({ f, t, fps }) => {
  const leafWave = Math.sin(t * 3.5) * 6;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <path
            d="M -150 30 C -120 30 -110 -15 -60 -25 C 0 -35 60 -15 90 10 L 150 20 L 150 40 L -150 40 Z"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="3.5"
          />

          <g transform={`translate(0, -10) translateY(${leafWave})`}>
            <circle cx="0" cy="0" r="48" fill="#064E3B" stroke="#10B981" strokeWidth="3.5" filter="url(#f-energy-glow)"/>
            <path
              d="M -18 12 C -24 -15 5 -25 20 -15 C 22 15 2 22 -18 12 Z"
              fill="#34D399"
              stroke="#065F46"
              strokeWidth="2"
            />
            <path d="M -18 12 Q 2 -2 20 -15" fill="none" stroke="#065F46" strokeWidth="2"/>
          </g>
        </g>
      </In>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   RIGHT — HYBRID CAR (হাইব্ৰিড গাড়ী)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 4: Dual Powertrain (Petrol Engine + Electric Motor) (38.66s – 50.72s) ── */
const ArtHybridDualPower: Art = ({ f, t, fps }) => {
  const pulse = 1 + Math.sin(t * 4) * 0.06;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <g transform="translate(-95, 0)">
            <rect x="-55" y="-55" width="110" height="110" rx="10" fill="url(#g-engine)" stroke="#F97316" strokeWidth="3"/>
            <rect x="-35" y="-45" width="70" height="25" rx="4" fill="#334155"/>
            <text x="0" y="5" textAnchor="middle" fontSize={13} fontWeight={900} fill="#FED7AA" fontFamily={DS.mono}>
              PETROL
            </text>
            <text x="0" y="24" textAnchor="middle" fontSize={11} fontWeight={700} fill="#94A3B8" fontFamily={DS.font}>
              ইঞ্জিন
            </text>
          </g>

          <g transform={`translate(0, 0) scale(${pulse})`}>
            <circle cx="0" cy="0" r="18" fill="#0F172A" stroke="#10B981" strokeWidth="3"/>
            <text x="0" y="6" textAnchor="middle" fontSize={16} fontWeight={900} fill="#10B981">
              ⚡
            </text>
          </g>

          <g transform="translate(95, 0)">
            <rect x="-55" y="-55" width="110" height="110" rx="10" fill="#0F172A" stroke="#10B981" strokeWidth="3"/>
            <circle cx="0" cy="-10" r="26" fill="url(#g-eco)"/>
            <text x="0" y="32" textAnchor="middle" fontSize={12} fontWeight={900} fill="#A7F3D0" fontFamily={DS.font}>
              ইলেকট্ৰিক মটৰ
            </text>
          </g>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 5: Automatic Power Switching (EV mode vs Petrol mode) (50.72s – 65.88s) ── */
const ArtHybridAutoShift: Art = ({ f, t, fps }) => {
  const isHighSpeed = Math.sin(t * 2) > 0;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <circle cx="0" cy="0" r="85" fill="#0F172A" stroke={isHighSpeed ? "#F97316" : "#10B981"} strokeWidth="4"/>
          <circle cx="0" cy="0" r="70" fill="#020617"/>

          <text
            x="0"
            y="-15"
            textAnchor="middle"
            fontSize={15}
            fontWeight={900}
            fill={isHighSpeed ? "#FB923C" : "#34D399"}
            fontFamily={DS.mono}
          >
            {isHighSpeed ? "ENGINE POWER" : "EV MODE"}
          </text>

          <text x="0" y="15" textAnchor="middle" fontSize={13} fontWeight={700} fill="#E2E8F0" fontFamily={DS.font}>
            {isHighSpeed ? "উচ্চ গতিত পেট্ৰল" : "কম গতিত বেটাৰী"}
          </text>

          <rect x="-50" y="32" width="100" height="22" rx="6" fill="#1E293B"/>
          <text x="0" y="47" textAnchor="middle" fontSize={10} fontWeight={900} fill="#94A3B8" fontFamily={DS.mono}>
            AUTO SHIFT
          </text>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 6: Regenerative Braking (Self-Charging) (65.88s – 76.80s) ── */
const ArtHybridRegenBrake: Art = ({ f, t, fps }) => {
  const energyFlow = (t * 160) % 90;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <g transform="translate(-100, 0)">
            <circle cx="0" cy="0" r="48" fill="#334155" stroke="#94A3B8" strokeWidth="3"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <circle key={deg} cx={Math.cos(deg) * 32} cy={Math.sin(deg) * 32} r="3" fill="#0F172A"/>
            ))}
            <path d="M 20 -40 Q 48 0 20 40 L 40 40 Q 65 0 40 -40 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2"/>
          </g>

          <path d="M -50 0 L 50 0" stroke="#334155" strokeWidth="8" strokeLinecap="round"/>
          <path d="M -50 0 L 50 0" stroke="#10B981" strokeWidth="4" strokeDasharray="14 10" strokeDashoffset={energyFlow}/>

          <g transform="translate(100, 0)">
            <rect x="-42" y="-50" width="84" height="100" rx="8" fill="#0F172A" stroke="#10B981" strokeWidth="3"/>
            <rect x="-15" y="-60" width="30" height="10" rx="2" fill="#10B981"/>
            {[-25, -5, 15, 35].map((by) => (
              <rect key={by} x="-30" y={by} width="60" height="14" rx="2" fill="#34D399"/>
            ))}
          </g>
        </g>
      </In>
    </>
  );
};

/* ─── Scene Registry & Phase Mappings ───────────────────────── */
type SceneId = "evBatteryMotor" | "evPlugCharging" | "evZeroEmission"
             | "hybridDualPower" | "hybridAutoShift" | "hybridRegenBrake";

interface Copy { chip: string; tone: Tone }
type Tone = "cyan" | "green" | "amber" | "blue";

const SCENES: Record<SceneId, { Art: Art; copy: Copy }> = {
  evBatteryMotor:   { Art: ArtEvBatteryMotor,   copy: { chip: "ELECTRIC · Battery আৰু Motor",       tone: "cyan"  } },
  evPlugCharging:   { Art: ArtEvPlugCharging,   copy: { chip: "Charging Stationত চাৰ্জিং",           tone: "blue"  } },
  evZeroEmission:   { Art: ArtEvZeroEmission,   copy: { chip: "ধোঁৱাবিহীন শূন্য প্ৰদূষণ",          tone: "green" } },
  hybridDualPower:  { Art: ArtHybridDualPower,  copy: { chip: "HYBRID · তেল আৰু বিদ্যুৎ",            tone: "green" } },
  hybridAutoShift:  { Art: ArtHybridAutoShift,  copy: { chip: "স্বয়ংক্ৰিয় Engine Shift",            tone: "amber" } },
  hybridRegenBrake: { Art: ArtHybridRegenBrake, copy: { chip: "Braking শক্তিত নিজে চাৰ্জ",           tone: "cyan"  } },
};

const PHASES = {
  left: [
    { id: "evBatteryMotor"   as SceneId, from: 8.50  },
    { id: "evPlugCharging"   as SceneId, from: 15.78 },
    { id: "evZeroEmission"   as SceneId, from: 23.02 },
  ],
  right: [
    { id: "hybridDualPower"  as SceneId, from: 38.66 },
    { id: "hybridAutoShift"  as SceneId, from: 50.72 },
    { id: "hybridRegenBrake" as SceneId, from: 65.88 },
  ],
} as const;

/* ─── Bold & Prominent 33px Text Chip ─────────────────────── */
const TextBlock: React.FC<{ copy: Copy; f: number; t: number; fps: number; idx: number; total: number }> = ({
  copy, f, t, fps, idx, total,
}) => {
  const c =
    copy.tone === "cyan"  ? DS.cyan  :
    copy.tone === "green" ? DS.green :
    copy.tone === "amber" ? DS.amber : DS.blue;

  const grad =
    copy.tone === "cyan"  ? "linear-gradient(90deg,#0284C7,#00E5FF)" :
    copy.tone === "green" ? "linear-gradient(90deg,#047857,#10B981)" :
    copy.tone === "amber" ? "linear-gradient(90deg,#C2410C,#F97316)" :
                            "linear-gradient(90deg,#1D4ED8,#3B82F6)";

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
    point.id.includes("summary") || currentTime >= 76.80
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
  if (point.id.includes("left")  || isLeft  || point.id.includes("electric")) side = "left";
  if (point.id.includes("right") || isRight || point.id.includes("hybrid"))   side = "right";
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