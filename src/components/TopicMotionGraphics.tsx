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
 * TopicMotionGraphics — Hardware vs Software (Assamese Edition)
 * ─────────────────────────────────────────────────────────────
 * 100% TRANSPARENT background.
 * Procedural SVG hardware engineering & software code graphics with 33px text chips.
 *
 * LEFT  — Hardware (4.30s → 23.20s)
 *   1. hwPhysicalParts  (4.34s):  Silicon CPU Microchip + RAM stick + Phone Battery (Touch & Feel)
 *   2. hwMachineBody    (15.14s): Desktop Computer Tower Chassis, PCB traces & physical repair tools
 *
 * RIGHT — Software (23.20s → 44.50s)
 *   3. swCodeScreen     (23.26s): Floating terminal syntax, binary code streams, OS window UI
 *   4. swSoulMachine    (34.36s): Glowing neural logic pathways + bug fix & update reinstallation
 */

/* ─── Tokens ─────────────────────────────────────────────── */
const DS = {
  font: `"Hind Siliguri","Noto Sans Bengali","Poppins","Segoe UI",system-ui,sans-serif`,
  mono: `"JetBrains Mono","Roboto Mono",ui-monospace,monospace`,
  ink:   "#0B1F4B",
  amber: { a: "#C2410C", b: "#F97316" },
  blue:  { a: "#0284C7", b: "#00E5FF" },
  green: { a: "#047857", b: "#10B981" },
  purple:{ a: "#6D28D9", b: "#8B5CF6" },
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
    <linearGradient id="g-silicon" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#94A3B8"/>
      <stop offset="40%" stopColor="#475569"/>
      <stop offset="100%" stopColor="#1E293B"/>
    </linearGradient>

    <linearGradient id="g-gold-trace" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#FACC15"/>
      <stop offset="100%" stopColor="#EAB308"/>
    </linearGradient>

    <linearGradient id="g-code-glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#0F172A"/>
      <stop offset="50%" stopColor="#0284C7" stopOpacity="0.8"/>
      <stop offset="100%" stopColor="#020617"/>
    </linearGradient>

    <filter id="f-real-drop" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#060C1E" floodOpacity="0.38"/>
    </filter>
    <filter id="f-code-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);

/* ══════════════════════════════════════════════════════════════
   LEFT — HARDWARE (বাহ্যিক আৰু স্পৰ্শযোগ্য অংশ)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 1: Physical Parts — CPU, RAM & Phone Battery (4.30s – 15.14s) ── */
const ArtHwPhysicalParts: Art = ({ f, t, fps }) => {
  const chipGlow = 0.8 + Math.sin(t * 4) * 0.2;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <rect x="-150" y="-75" width="300" height="150" rx="12" fill="#064E3B" stroke="#047857" strokeWidth="3"/>

          {[-120, -100, -80, 80, 100, 120].map((px) => (
            <path key={px} d={`M ${px} -75 L ${px} -50 L ${px > 0 ? px - 20 : px + 20} 0`}
              fill="none" stroke="url(#g-gold-trace)" strokeWidth="2" opacity={0.7}/>
          ))}

          <g transform="translate(-40, 0)">
            <rect x="-55" y="-55" width="110" height="110" rx="8" fill="url(#g-silicon)" stroke="#94A3B8" strokeWidth="2.5"/>
            <rect x="-42" y="-42" width="84" height="84" rx="4" fill="#0F172A" stroke="#FACC15" strokeWidth="1.5"/>
            <text x="0" y="4" textAnchor="middle" fontSize={13} fontWeight={900} fill="#FACC15" fontFamily={DS.mono}>
              CORE CPU
            </text>
            <circle cx="0" cy="-22" r="4" fill="#38BDF8" opacity={chipGlow}/>
          </g>

          <g transform="translate(95, -15)">
            <rect x="-35" y="-35" width="70" height="28" rx="3" fill="#1E293B" stroke="#10B981" strokeWidth="1.5"/>
            {[-22, -8, 6, 20].map((mx) => (
              <rect key={mx} x={mx} y="-30" width="8" height="18" fill="#020617"/>
            ))}

            <g transform="translate(0, 50)">
              <rect x="-35" y="-18" width="70" height="36" rx="5" fill="#1E293B" stroke="#F97316" strokeWidth="2"/>
              <rect x="35" y="-6" width="6" height="12" rx="2" fill="#F97316"/>
              <text x="0" y="4" textAnchor="middle" fontSize={10} fontWeight={900} fill="#FED7AA" fontFamily={DS.mono}>
                BATTERY
              </text>
            </g>
          </g>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 2: The Physical Body of Machine & Tools (15.14s – 23.20s) ── */
const ArtHwMachineBody: Art = ({ f, t, fps }) => {
  const toolAngle = interpolate(Math.sin(t * 4), [-1, 1], [-15, 15]);

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <rect x="-140" y="-80" width="160" height="160" rx="14" fill="url(#g-silicon)" stroke="#64748B" strokeWidth="3"/>
          <circle cx="-60" cy="-50" r="6" fill="#38BDF8"/>
          <rect x="-125" y="-30" width="130" height="95" rx="6" fill="#020617" stroke="#334155" strokeWidth="1.5"/>
          <circle cx="-60" cy="18" r="28" fill="none" stroke="#F97316" strokeWidth="3" strokeDasharray="12 8"/>

          <g transform={`translate(85, 0) rotate(${toolAngle})`}>
            <rect x="-12" y="-70" width="24" height="65" rx="5" fill="#EF4444" stroke="#991B1B" strokeWidth="2"/>
            <rect x="-4" y="-5" width="8" height="60" fill="#94A3B8"/>
            <polygon points="-5,55 5,55 0,72" fill="#64748B"/>
          </g>
        </g>
      </In>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   RIGHT — SOFTWARE (ডিজিটেল ক’ড আৰু এপসমূহ)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 3: Digital Instructions, Code Screen & Apps (23.20s – 34.36s) ── */
const ArtSwCodeScreen: Art = ({ f, t, fps }) => {
  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <rect x="-160" y="-85" width="320" height="170" rx="14" fill="url(#g-code-glass)" stroke="#00E5FF" strokeWidth="3"/>

          <rect x="-160" y="-85" width="320" height="28" rx="14" fill="#0F172A"/>
          {[-142, -126, -110].map((cx, i) => (
            <circle key={i} cx={cx} cy="-71" r="4.5" fill={["#EF4444", "#F59E0B", "#10B981"][i]}/>
          ))}

          <g transform="translate(-135, -35)">
            <text x="0" y="0" fontSize={13} fontWeight={700} fill="#38BDF8" fontFamily={DS.mono}>
              const system = new OS();
            </text>
            <text x="0" y="24" fontSize={13} fontWeight={700} fill="#A78BFA" fontFamily={DS.mono}>
              system.run(&quot;Windows&quot;, &quot;Android&quot;);
            </text>
            <text x="0" y="48" fontSize={13} fontWeight={700} fill="#34D399" fontFamily={DS.mono}>
              apps.deploy(status: &quot;SUCCESS&quot;);
            </text>
          </g>

          <g transform={`translate(100, 20) translateY(${Math.sin(t * 3) * 6})`}>
            <rect x="-24" y="-24" width="48" height="48" rx="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="2"/>
            <text x="0" y="8" textAnchor="middle" fontSize={22} fill="#FFFFFF">
              ⚡
            </text>
          </g>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 4: Soul of Machine, Bug Fix & Reinstall (34.36s – 44.50s) ── */
const ArtSwSoulMachine: Art = ({ f, t, fps }) => {
  const spin = t * 180;
  const pulse = 1 + Math.sin(t * 5) * 0.08;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <circle cx="0" cy="0" r="75" fill="#020617" stroke="#00E5FF" strokeWidth="3.5" filter="url(#f-code-glow)"/>

          <g transform={`rotate(${spin})`}>
            <circle cx="0" cy="0" r="55" fill="none" stroke="#A78BFA" strokeWidth="3" strokeDasharray="18 14"/>
            <circle cx="0" cy="-55" r="7" fill="#FACC15"/>
            <circle cx="0" cy="55" r="7" fill="#10B981"/>
          </g>

          <g transform={`scale(${pulse})`}>
            <path
              d="M -22 -15 A 25 25 0 1 1 -25 15"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <polygon points="-32,-18 -18,-24 -20,-8" fill="#00E5FF"/>
          </g>

          <g transform="translate(0, 52)">
            <rect x="-65" y="-12" width="130" height="24" rx="6" fill="#065F46" stroke="#10B981" strokeWidth="1.5"/>
            <text x="0" y="5" textAnchor="middle" fontSize={11} fontWeight={900} fill="#ECFDF5" fontFamily={DS.mono}>
              UPDATED / REINSTALLED
            </text>
          </g>
        </g>
      </In>
    </>
  );
};

/* ─── Scene Registry & Phase Mappings ───────────────────────── */
type SceneId = "hwPhysicalParts" | "hwMachineBody" | "swCodeScreen" | "swSoulMachine";

interface Copy { chip: string; tone: Tone }
type Tone = "amber" | "blue" | "green" | "purple";

const SCENES: Record<SceneId, { Art: Art; copy: Copy }> = {
  hwPhysicalParts: { Art: ArtHwPhysicalParts, copy: { chip: "স্পৰ্শযোগ্য বাহ্যিক অংশ", tone: "amber"  } },
  hwMachineBody:   { Art: ArtHwMachineBody,   copy: { chip: "যন্ত্ৰটোৰ শৰীৰ আৰু হাৰ্ডৱেৰ",       tone: "amber"  } },
  swCodeScreen:    { Art: ArtSwCodeScreen,    copy: { chip: "ডিজিটেল নিৰ্দেশনা",   tone: "blue"   } },
  swSoulMachine:   { Art: ArtSwSoulMachine,   copy: { chip: "যন্ত্ৰটোৰ প্ৰাণ আৰু চফ্টৱেৰ",       tone: "purple" } },
};

const PHASES = {
  left: [
    { id: "hwPhysicalParts" as SceneId, from: 4.30  },
    { id: "hwMachineBody"   as SceneId, from: 15.14 },
  ],
  right: [
    { id: "swCodeScreen"    as SceneId, from: 23.20 },
    { id: "swSoulMachine"   as SceneId, from: 34.36 },
  ],
} as const;

/* ─── Bold & Prominent 33px Text Chip ─────────────────────── */
const TextBlock: React.FC<{ copy: Copy; f: number; t: number; fps: number; idx: number; total: number }> = ({
  copy, f, t, fps, idx, total,
}) => {
  const c =
    copy.tone === "amber"  ? DS.amber  :
    copy.tone === "blue"   ? DS.blue   :
    copy.tone === "purple" ? DS.purple : DS.green;

  const grad =
    copy.tone === "amber"  ? "linear-gradient(90deg,#C2410C,#F97316)" :
    copy.tone === "blue"   ? "linear-gradient(90deg,#0284C7,#00E5FF)" :
    copy.tone === "purple" ? "linear-gradient(90deg,#6D28D9,#8B5CF6)" :
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
    point.id.includes("summary") || currentTime >= 44.50
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
  if (point.id.includes("left")  || isLeft  || point.id.includes("hardware")) side = "left";
  if (point.id.includes("right") || isRight || point.id.includes("software")) side = "right";
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