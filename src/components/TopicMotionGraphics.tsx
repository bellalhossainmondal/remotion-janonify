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
 * TopicMotionGraphics — Push vs Pull (Mechanical Door Dynamics)
 * ─────────────────────────────────────────────────────────────
 * 100% TRANSPARENT background.
 * Procedural SVG visuals showing commercial architectural glass doors,
 * physical direction of force (Forward Push Plate vs Backward Pull Handle).
 *
 * LEFT  — Push (10.20s → 22.50s)
 *   1. pushForce        (10.62s): Hand pressing flat Push Plate forward into distance
 *   2. pushDoorSwing    (15.84s): Glass door swinging inward/forward away from viewer
 *
 * RIGHT — Pull (22.50s → 32.50s)
 *   3. pullForce        (22.60s): Hand grasping vertical D-handle pulling backward toward self
 *   4. pullDoorSwing    (26.40s): Glass door swinging outward toward viewer
 */

/* ─── Tokens ─────────────────────────────────────────────── */
const DS = {
  font: `"Hind Siliguri","Noto Sans Bengali","Poppins","Segoe UI",system-ui,sans-serif`,
  mono: `"JetBrains Mono","Roboto Mono",ui-monospace,monospace`,
  ink:   "#0B1F4B",
  red:   { a: "#B91C1C", b: "#EF4444" },
  blue:  { a: "#1D4ED8", b: "#3B82F6" },
  amber: { a: "#C2410C", b: "#F97316" },
  green: { a: "#047857", b: "#10B981" },
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
    {/* Architectural Tempered Glass */}
    <linearGradient id="g-glass-door" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35"/>
      <stop offset="35%" stopColor="#E0F2FE" stopOpacity="0.15"/>
      <stop offset="70%" stopColor="#0284C7" stopOpacity="0.3"/>
      <stop offset="100%" stopColor="#0369A1" stopOpacity="0.45"/>
    </linearGradient>

    {/* Stainless Steel Brushed Hardware */}
    <linearGradient id="g-steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#94A3B8"/>
      <stop offset="35%" stopColor="#F1F5F9"/>
      <stop offset="70%" stopColor="#64748B"/>
      <stop offset="100%" stopColor="#334155"/>
    </linearGradient>

    {/* Push Red Force Gradient */}
    <linearGradient id="g-push-force" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#EF4444"/>
      <stop offset="100%" stopColor="#991B1B"/>
    </linearGradient>

    {/* Pull Blue Force Gradient */}
    <linearGradient id="g-pull-force" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#38BDF8"/>
      <stop offset="100%" stopColor="#1D4ED8"/>
    </linearGradient>

    {/* Drop Shadows */}
    <filter id="f-real-drop" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#060C1E" floodOpacity="0.35"/>
    </filter>
  </defs>
);

/* ══════════════════════════════════════════════════════════════
   LEFT — PUSH (ঠেলা দিয়া / নিজৰ পৰা আঁতৰলৈ)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 1: Hand pressing Flat Stainless Push Plate (10.20s – 15.84s) ── */
const ArtPushForce: Art = ({ f, t, fps }) => {
  const pushDepth = Math.sin(t * 4) * 8;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          {/* Frameless Commercial Glass Panel */}
          <rect x="-140" y="-85" width="280" height="170" rx="8" fill="url(#g-glass-door)" stroke="#38BDF8" strokeWidth="2.5"/>
          <line x1="-90" y1="75" x2="60" y2="-75" stroke="#FFFFFF" strokeWidth="3" opacity={0.35} strokeLinecap="round"/>

          {/* Stainless Steel Push Plate Hardware */}
          <rect x="-45" y="-55" width="90" height="110" rx="6" fill="url(#g-steel)" stroke="#475569" strokeWidth="2.5"/>
          <text x="0" y="6" textAnchor="middle" fontSize={22} fontWeight={900} fill="#0F172A" fontFamily={DS.mono}>
            PUSH
          </text>
          <circle cx="0" cy="-40" r="3.5" fill="#334155"/>
          <circle cx="0" cy="40" r="3.5" fill="#334155"/>

          {/* Hand Pressing Forward (Vector Outline) */}
          <g transform={`translate(${pushDepth}, 0)`}>
            {/* Red Forward Push Direction Arrows */}
            <line x1="-120" y1="0" x2="-65" y2="0" stroke="#EF4444" strokeWidth="5" strokeLinecap="round"/>
            <polygon points="-65,-8 -50,0 -65,8" fill="#EF4444"/>
            <line x1="65" y1="0" x2="120" y2="0" stroke="#EF4444" strokeWidth="5" strokeLinecap="round"/>
            <polygon points="120,-8 135,0 120,8" fill="#EF4444"/>
          </g>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 2: Glass Door Swinging Inward/Away (15.84s – 22.50s) ── */
const ArtPushDoorSwing: Art = ({ f, t, fps }) => {
  const swingAngle = interpolate(Math.sin(t * 3), [-1, 1], [-5, -28]);

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          {/* Door Frame Surround */}
          <rect x="-160" y="-85" width="320" height="170" rx="4" fill="none" stroke="#64748B" strokeWidth="6"/>
          
          {/* Top Floor Pivot Hinge */}
          <circle cx="-135" cy="-85" r="7" fill="#1E293B" stroke="#94A3B8" strokeWidth="2"/>
          <circle cx="-135" cy="85" r="7" fill="#1E293B" stroke="#94A3B8" strokeWidth="2"/>

          {/* Perspective Swung Glass Leaf (Moving forward away from camera) */}
          <g transform={`translate(-135, 0) skewY(${swingAngle}) scale(${1 - Math.abs(swingAngle) * 0.01}, 1)`}>
            <rect x="0" y="-75" width="240" height="150" rx="6" fill="url(#g-glass-door)" stroke="#38BDF8" strokeWidth="3"/>
            <rect x="180" y="-45" width="30" height="90" rx="4" fill="url(#g-steel)"/>
          </g>

          {/* Motion Curved Directional Vector */}
          <path d="M 50 45 Q 120 40 100 -30" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="8 6"/>
          <polygon points="108,-30 96,-44 92,-26" fill="#EF4444"/>
        </g>
      </In>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   RIGHT — PULL (টানি অনা / নিজৰ ফালে)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 3: Tubular D-Handle Pull Hardware (22.50s – 26.40s) ── */
const ArtPullForce: Art = ({ f, t, fps }) => {
  const pullDepth = Math.sin(t * 4) * 8;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          {/* Frameless Glass Panel */}
          <rect x="-140" y="-85" width="280" height="170" rx="8" fill="url(#g-glass-door)" stroke="#38BDF8" strokeWidth="2.5"/>
          <line x1="-90" y1="75" x2="60" y2="-75" stroke="#FFFFFF" strokeWidth="3" opacity={0.35} strokeLinecap="round"/>

          {/* Vertical Architectural Tubular Pull D-Handle */}
          <g transform="translate(0, 0)">
            <path
              d="M -30 -60 L 0 -60 L 0 60 L -30 60"
              fill="none"
              stroke="url(#g-steel)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="-18" y="-18" width="55" height="36" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="2"/>
            <text x="10" y="7" textAnchor="middle" fontSize={16} fontWeight={900} fill="#38BDF8" fontFamily={DS.mono}>
              PULL
            </text>
          </g>

          {/* Blue Backward Pull Direction Vectors (Toward user) */}
          <g transform={`translate(${pullDepth}, 0)`}>
            <line x1="65" y1="0" x2="125" y2="0" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
            <polygon points="65,-8 50,0 65,8" fill="#3B82F6"/>
            <line x1="-65" y1="0" x2="-125" y2="0" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
            <polygon points="-65,-8 -50,0 -65,8" fill="#3B82F6"/>
          </g>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 4: Door Opening Outward toward Viewer (26.40s – 32.50s) ── */
const ArtPullDoorSwing: Art = ({ f, t, fps }) => {
  const pullAngle = interpolate(Math.sin(t * 3), [-1, 1], [5, 26]);

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          {/* Frame */}
          <rect x="-160" y="-85" width="320" height="170" rx="4" fill="none" stroke="#64748B" strokeWidth="6"/>

          {/* Pivot Hinges */}
          <circle cx="-135" cy="-85" r="7" fill="#1E293B" stroke="#94A3B8" strokeWidth="2"/>
          <circle cx="-135" cy="85" r="7" fill="#1E293B" stroke="#94A3B8" strokeWidth="2"/>

          {/* Perspective Swung Glass Leaf (Swinging outward toward camera) */}
          <g transform={`translate(-135, 0) skewY(${pullAngle}) scale(${1 + Math.abs(pullAngle) * 0.01}, 1)`}>
            <rect x="0" y="-75" width="240" height="150" rx="6" fill="url(#g-glass-door)" stroke="#38BDF8" strokeWidth="3"/>
            <path d="M 210 -40 L 225 -40 L 225 40 L 210 40" fill="none" stroke="url(#g-steel)" strokeWidth="12" strokeLinecap="round"/>
          </g>

          {/* Blue Arc Motion Vector */}
          <path d="M 60 -30 Q 130 -20 100 45" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="8 6"/>
          <polygon points="108,45 92,42 98,26" fill="#3B82F6"/>
        </g>
      </In>
    </>
  );
};

/* ─── Scene Registry & Phase Mappings ───────────────────────── */
type SceneId = "pushForce" | "pushDoorSwing" | "pullForce" | "pullDoorSwing";

interface Copy { chip: string; tone: Tone }
type Tone = "red" | "blue" | "amber" | "green";

const SCENES: Record<SceneId, { Art: Art; copy: Copy }> = {
  pushForce:     { Art: ArtPushForce,     copy: { chip: "PUSH · আগলৈ ঠেলি দিয়া",       tone: "red"   } },
  pushDoorSwing: { Art: ArtPushDoorSwing, copy: { chip: "নিজৰ পৰা আঁতৰলৈ ঠেলক",   tone: "amber" } },
  pullForce:     { Art: ArtPullForce,     copy: { chip: "PULL · নিজৰ ফালে টানি অনা",   tone: "blue"  } },
  pullDoorSwing: { Art: ArtPullDoorSwing, copy: { chip: "হেণ্ডেলত ধৰি টানি খোলক",    tone: "green" } },
};

const PHASES = {
  left: [
    { id: "pushForce"     as SceneId, from: 10.20 },
    { id: "pushDoorSwing" as SceneId, from: 15.84 },
  ],
  right: [
    { id: "pullForce"     as SceneId, from: 22.50 },
    { id: "pullDoorSwing" as SceneId, from: 26.40 },
  ],
} as const;

/* ─── Bold & Prominent 33px Text Chip ─────────────────────── */
const TextBlock: React.FC<{ copy: Copy; f: number; t: number; fps: number; idx: number; total: number }> = ({
  copy, f, t, fps, idx, total,
}) => {
  const c =
    copy.tone === "red"   ? DS.red   :
    copy.tone === "blue"  ? DS.blue  :
    copy.tone === "amber" ? DS.amber : DS.green;

  const grad =
    copy.tone === "red"   ? "linear-gradient(90deg,#B91C1C,#EF4444)" :
    copy.tone === "blue"  ? "linear-gradient(90deg,#1D4ED8,#3B82F6)" :
    copy.tone === "amber" ? "linear-gradient(90deg,#C2410C,#F97316)" :
                            "linear-gradient(90deg,#047857,#10B981)";

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
    point.id.includes("summary") || currentTime >= 32.50
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
  if (point.id.includes("left")  || isLeft  || point.id.includes("push")) side = "left";
  if (point.id.includes("right") || isRight || point.id.includes("pull")) side = "right";
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