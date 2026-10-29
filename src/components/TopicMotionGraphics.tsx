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
 * TopicMotionGraphics — Photo vs Image (Assamese)
 * ─────────────────────────────────────────────────────────────
 * 100% TRANSPARENT background.
 * Visual-first procedural SVG art with prominent 33px text chips.
 *
 * LEFT  — Photo (9.00s → 29.80s)
 *   1. photoOptics       (9.10s):  Multi-coated camera lens, aperture & CMOS sensor
 *   2. photoRealCapture  (16.90s): DSLR, 35mm film reel & mobile viewfinder capturing reality
 *   3. photoMandatory    (26.00s): Camera hardware mandatory seal
 *
 * RIGHT — Image (29.80s → 54.00s)
 *   4. imgBroadConcept   (30.00s): Broad visual canvas & digital pixel matrix
 *   5. imgDigitalGraphics(37.10s): Vector curves, AI sparkles, Photoshop, logos & screenshots
 *   6. imgMirrorsScans   (45.80s): Mirror reflection wave & medical X-ray scan
 */

/* ─── Tokens ─────────────────────────────────────────────── */
const DS = {
  font: `"Poppins","Hind Siliguri","Noto Sans Bengali","Segoe UI",system-ui,sans-serif`,
  mono: `"JetBrains Mono","Roboto Mono",ui-monospace,monospace`,
  ink:   "#0B1F4B",
  amber: { a: "#B45309", b: "#F59E0B" },
  blue:  { a: "#1D4ED8", b: "#3B82F6" },
  cyan:  { a: "#0284C7", b: "#00E5FF" },
  violet:{ a: "#7C3AED", b: "#A78BFA" },
  green: { a: "#059669", b: "#10B981" },
  red:   { a: "#DC2626", b: "#EF4444" },
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
    <linearGradient id="g-lens-glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85"/>
      <stop offset="35%" stopColor="#A855F7" stopOpacity="0.5"/>
      <stop offset="70%" stopColor="#0284C7" stopOpacity="0.75"/>
      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9"/>
    </linearGradient>

    <linearGradient id="g-barrel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#1E293B"/>
      <stop offset="30%" stopColor="#475569"/>
      <stop offset="70%" stopColor="#1E293B"/>
      <stop offset="100%" stopColor="#0F172A"/>
    </linearGradient>

    <linearGradient id="g-cmos" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#047857"/>
      <stop offset="50%" stopColor="#065F46"/>
      <stop offset="100%" stopColor="#022C22"/>
    </linearGradient>

    <linearGradient id="g-photon-beam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#FDE047" stopOpacity="0.95"/>
      <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.75"/>
      <stop offset="85%" stopColor="#38BDF8" stopOpacity="0.5"/>
      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1"/>
    </linearGradient>

    <linearGradient id="g-creative" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#7C3AED"/>
      <stop offset="50%" stopColor="#C084FC"/>
      <stop offset="100%" stopColor="#00E5FF"/>
    </linearGradient>

    <filter id="f-real-drop" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#060C1E" floodOpacity="0.35"/>
    </filter>
    <filter id="f-lens-flare" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="f-glow-violet" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);

/* ══════════════════════════════════════════════════════════════
   LEFT — PHOTO SCENES (9.00s → 29.80s)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 1: Optical Lens, Real Light & Sensor Grid (9.10s – 16.90s) ── */
const ArtPhotoOptics: Art = ({ f, t, fps }) => {
  const beamShift = (t * 110) % 80;
  const irisAngle = Math.sin(t * 3.5) * 15;
  const sensorShimmer = 0.65 + Math.sin(t * 4) * 0.35;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={16}>
        <g transform="translate(35, 140)">
          <path d="M 0 -85 L 140 -35 L 140 35 L 0 85 Z" fill="url(#g-photon-beam)" opacity={0.78} filter="url(#f-lens-flare)"/>
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              cx={((beamShift + i * 40) % 135)}
              cy={Math.sin(t * 5 + i * 1.5) * 20}
              r={3.8}
              fill="#FFFBEB"
            />
          ))}
        </g>
      </In>

      <In f={f} fps={fps} at={0.12} dy={22}>
        <g transform="translate(240, 140)" filter="url(#f-real-drop)">
          <rect x="-70" y="-80" width="140" height="160" rx="14" fill="url(#g-barrel)" stroke="#475569" strokeWidth="3"/>
          <rect x="-62" y="-72" width="124" height="144" rx="8" fill="#0B132B"/>
          <rect x="-65" y="-80" width="8" height="160" fill="#EF4444"/>

          <path d="M -40 -64 Q -10 0 -40 64 Q -20 0 -40 -64 Z" fill="url(#g-lens-glass)" stroke="#38BDF8" strokeWidth="2"/>
          <path d="M -8 -64 Q 15 0 -8 64 Q 0 0 -8 -64 Z" fill="url(#g-lens-glass)" stroke="#818CF8" strokeWidth="1.8" opacity={0.9}/>

          <g transform={`translate(22, 0) rotate(${irisAngle})`}>
            <circle cx="0" cy="0" r="42" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeDasharray="14 10"/>
            <circle cx="0" cy="0" r="16" fill="#FDE047" opacity={0.5} filter="url(#f-lens-flare)"/>
          </g>
          <path d="M 45 -55 Q 60 0 45 55 Z" fill="url(#g-lens-glass)" stroke="#38BDF8" strokeWidth="2"/>
        </g>
      </In>

      <In f={f} fps={fps} at={0.22} dy={18}>
        <g transform="translate(425, 140)" filter="url(#f-real-drop)">
          <rect x="-38" y="-70" width="76" height="140" rx="9" fill="url(#g-cmos)" stroke="#10B981" strokeWidth="3"/>
          <g opacity={sensorShimmer}>
            {[-24, -12, 0, 12, 24].map((gx) =>
              [-50, -30, -10, 10, 30, 50].map((gy) => (
                <rect key={`${gx}-${gy}`} x={gx - 4} y={gy - 8} width="8" height="16" rx="2" fill="#6EE7B7"/>
              ))
            )}
          </g>
          {[-55, -35, -15, 5, 25, 45].map((py) => (
            <rect key={py} x="38" y={py} width="10" height="7" fill="#F59E0B" rx="1.5"/>
          ))}
        </g>
      </In>
    </>
  );
};

/* ── SCENE 2: Real Capture — DSLR, Mobile & 35mm Film (16.90s – 26.00s) ── */
const ArtPhotoRealCapture: Art = ({ f, t, fps }) => {
  const flashBurst = Math.sin(t * 6) > 0.88;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(95, 145)" filter="url(#f-real-drop)">
          <rect x="-38" y="-60" width="76" height="120" rx="12" fill="#D97706" stroke="#FDE68A" strokeWidth="2.5"/>
          <rect x="-32" y="-45" width="64" height="90" rx="6" fill="#18181B"/>
          <circle cx="0" cy="-60" r="10" fill="#71717A" stroke="#27272A" strokeWidth="2"/>
          <path d="M 38 -20 Q 90 -40 85 40 Q 55 50 38 30" fill="#18181B" stroke="#52525B" strokeWidth="2"/>
          {[-12, 2, 16, 28].map((sy, i) => (
            <rect key={i} x="44" y={sy} width="7" height="9" rx="1.5" fill="#FFFFFF" opacity={0.7}/>
          ))}
        </g>
      </In>

      <In f={f} fps={fps} at={0.12} dy={24}>
        <g transform="translate(265, 140)" filter="url(#f-real-drop)">
          <path d="M -95 65 L -95 -20 L -60 -20 L -38 -55 L 38 -55 L 60 -20 L 95 -20 L 95 65 Z"
            fill="#0F172A" stroke="#475569" strokeWidth="3.5"/>
          <circle cx="8" cy="18" r="54" fill="#020617" stroke="#3B82F6" strokeWidth="4.5"/>
          <circle cx="8" cy="18" r="42" fill="url(#g-lens-glass)"/>
          <circle cx="-5" cy="5" r="14" fill="#FFFFFF" opacity={0.45} filter="url(#f-lens-flare)"/>
          {flashBurst && (
            <circle cx="-38" cy="-55" r="40" fill="#FFFFFF" opacity={0.85} filter="url(#f-lens-flare)"/>
          )}
        </g>
      </In>

      <In f={f} fps={fps} at={0.22} dy={20}>
        <g transform="translate(435, 140)" filter="url(#f-real-drop)">
          <rect x="-38" y="-72" width="76" height="144" rx="20" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.8"/>
          <rect x="-32" y="-64" width="58" height="66" rx="14" fill="#1E293B" stroke="#475569" strokeWidth="1.5"/>
          {[-14, 12].map((cx, i) => (
            <circle key={i} cx={cx} cy="-40" r="10" fill="url(#g-lens-glass)" stroke="#38BDF8" strokeWidth="2"/>
          ))}
          <circle cx="-14" cy="-14" r="10" fill="url(#g-lens-glass)" stroke="#38BDF8" strokeWidth="2"/>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 3: Mandatory Camera Hardware (26.00s – 29.80s) ── */
const ArtPhotoMandatory: Art = ({ f, t, fps }) => {
  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          <circle cx="0" cy="0" r="105" fill="url(#g-barrel)" stroke="#64748B" strokeWidth="5"/>
          <circle cx="0" cy="0" r="90" fill="#0F172A" stroke="#334155" strokeWidth="3"/>
          <circle cx="0" cy="0" r="32" fill="#020617" stroke="#38BDF8" strokeWidth="3"/>
          <circle cx="0" cy="0" r="18" fill="url(#g-lens-glass)"/>
          <g transform="translate(75, 75)" filter="url(#f-real-drop)">
            <circle cx="0" cy="0" r="28" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="3"/>
            <path d="M -10 0 L -3 8 L 12 -8" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round"/>
          </g>
        </g>
      </In>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   RIGHT — IMAGE SCENES (29.80s → 54.00s)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 4: Visual Concept & Digital Pixel Spectrum (30.00s – 37.10s) ── */
const ArtImageBroadConcept: Art = ({ f, t, fps }) => {
  const spin = t * 35;
  const glow = 0.5 + Math.sin(t * 3.5) * 0.5;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 135)" filter="url(#f-real-drop)">
          <rect x="-180" y="-85" width="360" height="170" rx="16" fill="#0F0621" stroke="#A78BFA" strokeWidth="3"/>
          <g transform={`rotate(${spin})`} opacity={0.85}>
            {[-45, 0, 45].map((x) =>
              [-45, 0, 45].map((y) => (
                <rect key={`${x}-${y}`} x={x - 14} y={y - 14} width="28" height="28" rx="6"
                  fill="url(#g-creative)" opacity={0.7} stroke="#C4B5FD" strokeWidth="1.2"/>
              ))
            )}
          </g>
          <circle cx="0" cy="0" r="30" fill="#0F0621" stroke="#38BDF8" strokeWidth="3"/>
          <circle cx="0" cy="0" r="14" fill="#A78BFA" opacity={glow} filter="url(#f-glow-violet)"/>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 5: Digital Graphics, AI & Photoshop (37.10s – 45.80s) ── */
const ArtImageDigitalGraphics: Art = ({ f, t, fps }) => {
  const floatBob = Math.sin(t * 3.5) * 6;
  const cards = [
    { label: "AI আৰ্ট",  icon: "✨", col: "#A78BFA", x: 80,  y: 90 },
    { label: "লোগো",     icon: "🎨", col: "#F59E0B", x: 195, y: 70 },
    { label: "ফটোশ্বপ",   icon: "Ps", col: "#00E5FF", x: 310, y: 70 },
    { label: "স্ক্ৰীণশ্বট", icon: "💻", col: "#10B981", x: 425, y: 90 },
  ];

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={20}>
        {cards.map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y + (i % 2 === 0 ? floatBob : -floatBob)})`} filter="url(#f-real-drop)">
            <rect x="-48" y="-45" width="96" height="90" rx="14" fill="#0F0621" stroke={c.col} strokeWidth="2.5"/>
            <text x="0" y="2" textAnchor="middle" fontSize={26} fontWeight={900} fill={c.col}>{c.icon}</text>
            <text x="0" y="28" textAnchor="middle" fontSize={11} fontWeight={900} fill="#E2E8F0" fontFamily={DS.font}>{c.label}</text>
          </g>
        ))}
      </In>

      <In f={f} fps={fps} at={0.18} dy={16}>
        <g transform="translate(260, 195)" filter="url(#f-real-drop)">
          <rect x="-180" y="-30" width="360" height="60" rx="12" fill="#1E1035" stroke="#7C3AED" strokeWidth="2"/>
          <path d="M -140 10 Q -60 -25 0 0 T 140 -10" fill="none" stroke="#00E5FF" strokeWidth="3" strokeDasharray="6 4"/>
          {[-140, 0, 140].map((nx) => (
            <circle key={nx} cx={nx} cy={nx === 0 ? 0 : nx < 0 ? 10 : -10} r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2"/>
          ))}
        </g>
      </In>
    </>
  );
};

/* ── SCENE 6: Reflections & Medical X-Ray Scans (45.80s – 54.00s) ── */
const ArtImageMirrorsScans: Art = ({ f, t, fps }) => {
  const scanBeam = (t * 70) % 90;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={20}>
        <g transform="translate(145, 130)" filter="url(#f-real-drop)">
          <rect x="-65" y="-65" width="130" height="130" rx="18" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5"/>
          <line x1="-40" y1="50" x2="40" y2="-50" stroke="#FFFFFF" strokeWidth="3" opacity={0.5}/>
          <text x="0" y="5" textAnchor="middle" fontSize={26}>🪞</text>
        </g>
      </In>

      <In f={f} fps={fps} at={0.12} dy={20}>
        <g transform="translate(375, 130)" filter="url(#f-real-drop)">
          <rect x="-65" y="-65" width="130" height="130" rx="12" fill="#020617" stroke="#22D3EE" strokeWidth="2.5"/>
          <path d="M 0 -40 L 0 35 M -25 -25 Q 0 -35 25 -25 M -30 -10 Q 0 -20 30 -10" stroke="#67E8F9" strokeWidth="3" fill="none"/>
          <line x1="-55" y1={-55 + scanBeam} x2="55" y2={-55 + scanBeam} stroke="#00E5FF" strokeWidth="2" filter="url(#f-glow-violet)"/>
        </g>
      </In>
    </>
  );
};

/* ─── Scene Registry & Phase Mappings ───────────────────────── */
type SceneId = "photoOptics" | "photoRealCapture" | "photoMandatory"
             | "imgBroadConcept" | "imgDigitalGraphics" | "imgMirrorsScans";

interface Copy { chip: string; tone: Tone }
type Tone = "blue" | "amber" | "red" | "violet" | "cyan" | "green";

const SCENES: Record<SceneId, { Art: Art; copy: Copy }> = {
  photoOptics:        { Art: ArtPhotoOptics,        copy: { chip: "PHOTO · বাস্তৱ পোহৰ আৰু লেন্স", tone: "blue"   } },
  photoRealCapture:   { Art: ArtPhotoRealCapture,   copy: { chip: "কেমেৰাৰে বাস্তৱ দৃশ্য ধৰা",     tone: "amber"  } },
  photoMandatory:     { Art: ArtPhotoMandatory,     copy: { chip: "কেমেৰা অবিহনে ফটো অসম্ভৱ",   tone: "red"    } },
  imgBroadConcept:    { Art: ArtImageBroadConcept,  copy: { chip: "IMAGE · দৃশ্যমান যিকোনো ৰূপ", tone: "violet" } },
  imgDigitalGraphics: { Art: ArtImageDigitalGraphics,copy: { chip: "ডিজিটেল আৰ্ট, AI আৰু গ্ৰাফিক্স",tone: "cyan"   } },
  imgMirrorsScans:    { Art: ArtImageMirrorsScans,  copy: { chip: "প্ৰতিবিম্ব আৰু X-Ray ৰিপ’ৰ্ট", tone: "green"  } },
};

const PHASES = {
  left: [
    { id: "photoOptics"        as SceneId, from: 9.10  },
    { id: "photoRealCapture"   as SceneId, from: 16.90 },
    { id: "photoMandatory"     as SceneId, from: 26.00 },
  ],
  right: [
    { id: "imgBroadConcept"    as SceneId, from: 30.00 },
    { id: "imgDigitalGraphics" as SceneId, from: 37.10 },
    { id: "imgMirrorsScans"    as SceneId, from: 45.80 },
  ],
} as const;

/* ─── Bold & Prominent 33px Text Chip ─────────────────────── */
const TextBlock: React.FC<{ copy: Copy; f: number; t: number; fps: number; idx: number; total: number }> = ({
  copy, f, t, fps, idx, total,
}) => {
  const c =
    copy.tone === "blue"   ? DS.blue   :
    copy.tone === "amber"  ? DS.amber  :
    copy.tone === "red"    ? DS.red    :
    copy.tone === "violet" ? DS.violet :
    copy.tone === "cyan"   ? DS.cyan   : DS.green;

  const grad =
    copy.tone === "violet" ? "linear-gradient(90deg,#7C3AED,#A78BFA)" :
    copy.tone === "cyan"   ? "linear-gradient(90deg,#0284C7,#00E5FF)" :
    copy.tone === "red"    ? "linear-gradient(90deg,#B91C1C,#EF4444)" :
    copy.tone === "green"  ? "linear-gradient(90deg,#059669,#10B981)" :
    copy.tone === "amber"  ? "linear-gradient(90deg,#D97706,#F59E0B)" :
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
    point.id.includes("summary") || currentTime >= 54.00
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
  if (point.id.includes("left")  || isLeft  || point.id.includes("photo")) side = "left";
  if (point.id.includes("right") || isRight || point.id.includes("image")) side = "right";
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