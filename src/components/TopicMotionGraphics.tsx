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
 * TopicMotionGraphics — Mechanical Keyboard vs Membrane Keyboard (Assamese)
 * ─────────────────────────────────────────────────────────────
 * 100% TRANSPARENT background.
 * Procedural SVG hardware engineering graphics with prominent 33px text chips.
 *
 * LEFT  — Mechanical Keyboard (9.00s → 41.28s)
 *   1. mechSwitchSpring  (9.28s):  Cross-section of Mechanical Switch: Stem, Coil Spring & Gold Leaf Contact
 *   2. mechClickTactile  (20.10s): Tactile bump actuation, tactile click shockwaves & instant trigger
 *   3. mechHotSwapDurable(29.82s): Individual switch hot-swappable socket & 50M keystrokes durability
 *
 * RIGHT — Membrane Keyboard (41.28s → 79.60s)
 *   4. memRubberDome     (41.28s): Continuous silicone/rubber dome sheet layer beneath keycaps
 *   5. memCircuitTrace   (55.26s): Key press flexing dome down to bridge 3-layer flexible conductive traces
 *   6. memSilentBudget   (64.22s): Silent soft mushy typing feel & wear-and-tear degradation over time
 */

/* ─── Tokens ─────────────────────────────────────────────── */
const DS = {
  font: `"Hind Siliguri","Noto Sans Bengali","Poppins","Segoe UI",system-ui,sans-serif`,
  mono: `"JetBrains Mono","Roboto Mono",ui-monospace,monospace`,
  ink:   "#0B1F4B",
  blue:  { a: "#1D4ED8", b: "#3B82F6" },
  pink:  { a: "#BE185D", b: "#EC4899" },
  cyan:  { a: "#0284C7", b: "#00E5FF" },
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
    <linearGradient id="g-keycap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#475569"/>
      <stop offset="30%" stopColor="#334155"/>
      <stop offset="100%" stopColor="#0F172A"/>
    </linearGradient>

    <linearGradient id="g-switch-body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#1E293B"/>
      <stop offset="100%" stopColor="#020617"/>
    </linearGradient>

    <linearGradient id="g-spring" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#CBD5E1"/>
      <stop offset="50%" stopColor="#94A3B8"/>
      <stop offset="100%" stopColor="#475569"/>
    </linearGradient>

    <linearGradient id="g-silicone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8"/>
      <stop offset="70%" stopColor="#EC4899" stopOpacity="0.45"/>
      <stop offset="100%" stopColor="#BE185D" stopOpacity="0.7"/>
    </linearGradient>

    <linearGradient id="g-pcb" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#064E3B"/>
      <stop offset="50%" stopColor="#047857"/>
      <stop offset="100%" stopColor="#064E3B"/>
    </linearGradient>

    <filter id="f-real-drop" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#060C1E" floodOpacity="0.38"/>
    </filter>
    <filter id="f-click-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);

/* ══════════════════════════════════════════════════════════════
   LEFT — MECHANICAL KEYBOARD (মেকানিকেল কিব’ৰ্ড)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 1: Switch Cross-Section: Stem, Spring & Gold Leaf Contact (9.00s – 20.10s) ── */
const ArtMechSwitchSpring: Art = ({ f, t, fps }) => {
  const pressY = interpolate(Math.sin(t * 5), [-1, 1], [0, 16]);

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 135)" filter="url(#f-real-drop)">
          <rect x="-85" y="-60" width="170" height="135" rx="10" fill="url(#g-switch-body)" stroke="#475569" strokeWidth="2.5"/>
          <rect x="-95" y="10" width="10" height="25" rx="2" fill="#334155"/>
          <rect x="85" y="10" width="10" height="25" rx="2" fill="#334155"/>

          <path d="M 45 45 L 45 -10 Q 45 -25 35 -30" fill="none" stroke="#FACC15" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 55 45 L 55 -5 Q 55 -15 45 -20" fill="none" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round"/>

          <g transform={`translate(0, ${pressY})`}>
            <path d="M -55 -85 L 55 -85 L 65 -55 L -65 -55 Z" fill="url(#g-keycap)" stroke="#64748B" strokeWidth="2"/>
            <text x="0" y="-65" textAnchor="middle" fontSize={13} fontWeight={900} fill="#E2E8F0" fontFamily={DS.mono}>
              CTRL
            </text>

            <rect x="-24" y="-55" width="48" height="42" rx="4" fill="#2563EB" stroke="#60A5FA" strokeWidth="1.5"/>
            <rect x="-4" y="-70" width="8" height="18" fill="#3B82F6"/>
            <rect x="-10" y="-64" width="20" height="6" fill="#3B82F6"/>
            <polygon points="20,-25 38,-15 20,-10" fill="#1D4ED8"/>
          </g>

          <g transform="translate(0, 10)">
            {[-18, -6, 6, 18, 30].map((sy) => (
              <ellipse key={sy} cx="0" cy={sy - pressY * 0.4} rx="18" ry="4" fill="none" stroke="url(#g-spring)" strokeWidth="3.5"/>
            ))}
          </g>

          <rect x="-25" y="75" width="6" height="18" rx="2" fill="#FACC15"/>
          <rect x="45" y="75" width="6" height="18" rx="2" fill="#FACC15"/>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 2: Tactile Click Wave & Instant Actuation (20.10s – 29.82s) ── */
const ArtMechClickTactile: Art = ({ f, t, fps }) => {
  const clickWave = (t * 4) % 1;
  const isActuated = clickWave > 0.4 && clickWave < 0.8;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <rect x="-70" y="-45" width="140" height="110" rx="12" fill="url(#g-switch-body)" stroke="#2563EB" strokeWidth="3"/>

          <path d="M -50 -75 L 50 -75 L 60 -45 L -60 -45 Z" fill="url(#g-keycap)" stroke="#38BDF8" strokeWidth="2"/>
          <text x="0" y="-55" textAnchor="middle" fontSize={14} fontWeight={900} fill="#38BDF8" fontFamily={DS.mono}>
            W
          </text>

          {isActuated && (
            <g filter="url(#f-click-glow)">
              {[1, 2, 3].map((r) => (
                <circle
                  key={r}
                  cx="0"
                  cy="-10"
                  r={30 + r * 22}
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth={3 - r * 0.6}
                  strokeDasharray="6 4"
                  opacity={0.8 - r * 0.2}
                />
              ))}
            </g>
          )}

          <rect x="-65" y="15" width="130" height="30" rx="8" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5"/>
          <text x="0" y="35" textAnchor="middle" fontSize={13} fontWeight={900} fill="#E0F2FE" fontFamily={DS.mono}>
            CLICKY TACTILE
          </text>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 3: Hot-Swappable Switch & Durability (29.82s – 41.28s) ── */
const ArtMechHotSwapDurable: Art = ({ f, t, fps }) => {
  const liftY = interpolate(Math.sin(t * 3), [-1, 1], [-30, 0]);

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <rect x="-140" y="45" width="280" height="20" rx="4" fill="url(#g-pcb)" stroke="#10B981" strokeWidth="2"/>
          {[-80, 0, 80].map((sx) => (
            <g key={sx} transform={`translate(${sx}, 50)`}>
              <circle cx="-12" cy="0" r="5" fill="#020617" stroke="#FACC15" strokeWidth="2"/>
              <circle cx="12" cy="0" r="5" fill="#020617" stroke="#FACC15" strokeWidth="2"/>
            </g>
          ))}

          <g transform={`translate(0, ${liftY})`}>
            <rect x="-35" y="-30" width="70" height="65" rx="8" fill="#1E293B" stroke="#60A5FA" strokeWidth="2"/>
            <rect x="-15" y="-45" width="30" height="18" rx="3" fill="#2563EB"/>
            <rect x="-14" y="35" width="4" height="15" fill="#FACC15"/>
            <rect x="10" y="35" width="4" height="15" fill="#FACC15"/>
          </g>

          <g transform="translate(0, -55)">
            <rect x="-70" y="-14" width="140" height="28" rx="14" fill="#065F46" stroke="#34D399" strokeWidth="2"/>
            <text x="0" y="4" textAnchor="middle" fontSize={12} fontWeight={900} fill="#ECFDF5" fontFamily={DS.mono}>
              50M+ KEYSTROKES
            </text>
          </g>
        </g>
      </In>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   RIGHT — MEMBRANE KEYBOARD (মেমব্ৰেন কিব’ৰ্ড)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 4: Silicone Rubber Dome Sheet Layer (41.28s – 55.26s) ── */
const ArtMemRubberDome: Art = ({ f, t, fps }) => {
  const pulse = 1 + Math.sin(t * 3.5) * 0.05;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          {[-90, 0, 90].map((kx) => (
            <path key={kx} d={`M ${kx - 35} -55 L ${kx + 35} -55 L ${kx + 40} -30 L ${kx - 40} -30 Z`}
              fill="url(#g-keycap)" stroke="#64748B" strokeWidth="1.5"/>
          ))}

          <rect x="-150" y="0" width="300" height="14" rx="3" fill="url(#g-silicone)"/>

          {[-90, 0, 90].map((dx) => (
            <g key={dx} transform={`translate(${dx}, 0) scale(${pulse})`}>
              <path
                d="M -30 0 C -30 -35 30 -35 30 0 Z"
                fill="url(#g-silicone)"
                stroke="#F472B6"
                strokeWidth="2.5"
              />
              <rect x="-8" y="-30" width="16" height="8" rx="2" fill="#18181B"/>
            </g>
          ))}

          <line x1="-140" y1="25" x2="140" y2="25" stroke="#CBD5E1" strokeWidth="4"/>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 5: Membrane Dome Flex & 3-Layer Circuit Bridging (55.26s – 64.22s) ── */
const ArtMemCircuitTrace: Art = ({ f, t, fps }) => {
  const isCompressed = Math.sin(t * 5) > 0;
  const domeScaleY = isCompressed ? 0.35 : 1.0;
  const keyY = isCompressed ? 22 : 0;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <g transform={`translate(0, ${keyY})`}>
            <path d="M -50 -70 L 50 -70 L 60 -40 L -60 -40 Z" fill="url(#g-keycap)" stroke="#94A3B8" strokeWidth="2"/>
            <text x="0" y="-50" textAnchor="middle" fontSize={14} fontWeight={900} fill="#E2E8F0" fontFamily={DS.mono}>
              ENTER
            </text>
          </g>

          <g transform={`translate(0, 5) scale(1, ${domeScaleY})`}>
            <path d="M -45 0 C -45 -50 45 -50 45 0 Z" fill="url(#g-silicone)" stroke="#EC4899" strokeWidth="3"/>
            <rect x="-12" y="-42" width="24" height="12" rx="3" fill="#0F172A"/>
          </g>

          <rect x="-120" y="10" width="240" height="5" rx="2" fill="#93C5FD"/>
          <rect x="-120" y="18" width="95" height="4" fill="#64748B"/>
          <rect x="25" y="18" width="95" height="4" fill="#64748B"/>
          <rect x="-120" y="25" width="240" height="5" rx="2" fill="#93C5FD"/>

          {isCompressed && (
            <circle cx="0" cy="20" r="14" fill="#FACC15" opacity={0.8} filter="url(#f-click-glow)"/>
          )}
        </g>
      </In>
    </>
  );
};

/* ── SCENE 6: Silent Cushion Feel & Degradation (64.22s – 79.60s) ── */
const ArtMemSilentBudget: Art = ({ f, t, fps }) => {
  const mushWave = Math.sin(t * 3) * 4;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <g transform="translate(-85, 0)">
            <circle cx="0" cy="0" r="48" fill="#1E293B" stroke="#EC4899" strokeWidth="3"/>
            <text x="0" y="8" textAnchor="middle" fontSize={32}>
              🤫
            </text>
            <text x="0" y="32" textAnchor="middle" fontSize={11} fontWeight={900} fill="#F472B6" fontFamily={DS.mono}>
              SILENT
            </text>
          </g>

          <g transform={`translate(85, ${mushWave})`}>
            <rect x="-55" y="-50" width="110" height="100" rx="14" fill="#831843" stroke="#F472B6" strokeWidth="2.5"/>
            <path d="M -35 0 Q 0 -25 35 0" fill="none" stroke="#FBCFE8" strokeWidth="4" strokeLinecap="round"/>
            <text x="0" y="24" textAnchor="middle" fontSize={12} fontWeight={800} fill="#FDF2F8" fontFamily={DS.font}>
              কোমল ফিল
            </text>
          </g>

          <g transform="translate(0, 65)">
            <rect x="-80" y="-14" width="160" height="28" rx="14" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5"/>
            <text x="0" y="4" textAnchor="middle" fontSize={12} fontWeight={900} fill="#E2E8F0" fontFamily={DS.mono}>
              LIGHT & BUDGET
            </text>
          </g>
        </g>
      </In>
    </>
  );
};

/* ─── Scene Registry & Phase Mappings ───────────────────────── */
type SceneId = "mechSwitchSpring" | "mechClickTactile" | "mechHotSwapDurable"
             | "memRubberDome"    | "memCircuitTrace"  | "memSilentBudget";

interface Copy { chip: string; tone: Tone }
type Tone = "blue" | "pink" | "cyan" | "green" | "amber";

const SCENES: Record<SceneId, { Art: Art; copy: Copy }> = {
  mechSwitchSpring:    { Art: ArtMechSwitchSpring,    copy: { chip: "স্বাধীন মেকানিকেল ছুইচ", tone: "blue"  } },
  mechClickTactile:    { Art: ArtMechClickTactile,    copy: { chip: "ক্লিকি শব্দ আৰু TACTILE FEEL",            tone: "cyan"  } },
  mechHotSwapDurable:  { Art: ArtMechHotSwapDurable,  copy: { chip: "অত্যন্ত টেকসই আৰু HOT-SWAP",             tone: "green" } },
  memRubberDome:       { Art: ArtMemRubberDome,       copy: { chip: "MEMBRANE · চিলিকন ৰবৰ পেড",             tone: "pink"  } },
  memCircuitTrace:     { Art: ArtMemCircuitTrace,     copy: { chip: "চাৰ্কিট ব'ৰ্ডত স্পৰ্শ আৰু টাইপ",         tone: "amber" } },
  memSilentBudget:     { Art: ArtMemSilentBudget,     copy: { chip: "নিঃশব্দ, পাতল আৰু সুলভ",              tone: "pink"  } },
};

const PHASES = {
  left: [
    { id: "mechSwitchSpring"   as SceneId, from: 9.00  },
    { id: "mechClickTactile"   as SceneId, from: 20.10 },
    { id: "mechHotSwapDurable" as SceneId, from: 29.82 },
  ],
  right: [
    { id: "memRubberDome"      as SceneId, from: 41.28 },
    { id: "memCircuitTrace"    as SceneId, from: 55.26 },
    { id: "memSilentBudget"    as SceneId, from: 64.22 },
  ],
} as const;

/* ─── Bold & Prominent 33px Text Chip ─────────────────────── */
const TextBlock: React.FC<{ copy: Copy; f: number; t: number; fps: number; idx: number; total: number }> = ({
  copy, f, t, fps, idx, total,
}) => {
  const c =
    copy.tone === "blue"  ? DS.blue  :
    copy.tone === "pink"  ? DS.pink  :
    copy.tone === "cyan"  ? DS.cyan  :
    copy.tone === "green" ? DS.green : DS.amber;

  const grad =
    copy.tone === "blue"  ? "linear-gradient(90deg,#1D4ED8,#3B82F6)" :
    copy.tone === "pink"  ? "linear-gradient(90deg,#BE185D,#EC4899)" :
    copy.tone === "cyan"  ? "linear-gradient(90deg,#0284C7,#00E5FF)" :
    copy.tone === "green" ? "linear-gradient(90deg,#047857,#10B981)" :
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
    point.id.includes("summary") || currentTime >= 79.60
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
  if (point.id.includes("left")  || isLeft  || point.id.includes("mechanical")) side = "left";
  if (point.id.includes("right") || isRight || point.id.includes("membrane"))   side = "right";
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