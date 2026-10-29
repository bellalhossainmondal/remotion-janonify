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
 * TopicMotionGraphics — Takeoff vs Landing (Assamese Aviation Physics)
 * ─────────────────────────────────────────────────────────────
 * 100% TRANSPARENT background.
 * Ultra-realistic procedural SVG vector art with prominent 33px Assamese text chips.
 *
 * LEFT  — Takeoff (9.50s → 30.30s)
 *   1. takeoffThrust     (9.50s):  Titanium turbofan engine 100% TOGA thrust & supersonic shock diamonds
 *   2. takeoffLift       (18.54s): True Airfoil wing aerodynamics: Bernoulli airflow & upward lift vector
 *   3. takeoffRotation   (25.38s): Airliner Vr rotation angle (~15° pitch up) soaring into clouds
 *
 * RIGHT — Landing (30.30s → 48.80s)
 *   4. landingTouchdown  (30.38s): Heavy bogie landing gear touchdown, shock compression & tire smoke puff
 *   5. landingReverse    (37.02s): Wing flight spoilers popped + engine reverse thrust deflector doors
 *   6. landingSafeStop   (44.58s): PFD Cockpit Airspeed gauge dropping to 0 KTS & green brake seal
 */

/* ─── Tokens ─────────────────────────────────────────────── */
const DS = {
  font: `"Hind Siliguri","Noto Sans Bengali","Poppins","Segoe UI",system-ui,sans-serif`,
  mono: `"JetBrains Mono","Roboto Mono",ui-monospace,monospace`,
  ink:   "#0B1F4B",
  amber: { a: "#C2410C", b: "#F97316" },
  blue:  { a: "#0284C7", b: "#00E5FF" },
  cyan:  { a: "#0D9488", b: "#14B8A6" },
  green: { a: "#059669", b: "#10B981" },
  red:   { a: "#B91C1C", b: "#EF4444" },
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

/* ─── SVG Aviation Defs ───────────────────────────────────── */
const Defs: React.FC = () => (
  <defs>
    {/* Metallic Engine Cowling */}
    <linearGradient id="g-engine-metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#475569"/>
      <stop offset="30%" stopColor="#64748B"/>
      <stop offset="60%" stopColor="#1E293B"/>
      <stop offset="100%" stopColor="#0F172A"/>
    </linearGradient>

    {/* Jet Thrust Flame Plume */}
    <linearGradient id="g-thrust-fire" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#E0F2FE" stopOpacity="1"/>
      <stop offset="15%" stopColor="#38BDF8" stopOpacity="0.95"/>
      <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.85"/>
      <stop offset="75%" stopColor="#EA580C" stopOpacity="0.75"/>
      <stop offset="100%" stopColor="#DC2626" stopOpacity="0"/>
    </linearGradient>

    {/* Asphalt Runway */}
    <linearGradient id="g-asphalt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1E293B"/>
      <stop offset="100%" stopColor="#0B0F19"/>
    </linearGradient>

    {/* Filters */}
    <filter id="f-real-drop" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#060C1E" floodOpacity="0.38"/>
    </filter>
    <filter id="f-thrust-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="7" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);

/* ══════════════════════════════════════════════════════════════
   LEFT — TAKEOFF (টেক অফ)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 1: Turbofan Jet Engine 100% TOGA Thrust (9.50s – 18.54s) ── */
const ArtTakeoffThrust: Art = ({ f, t, fps }) => {
  const fanSpin = t * 800;
  const flameOsc = 0.88 + Math.sin(t * 24) * 0.12;
  const flameLength = 175 + Math.sin(t * 30) * 20;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(180, 140)" filter="url(#f-real-drop)">
          {/* Supersonic Shock Diamonds Thrust Plume */}
          <path
            d={`M 90 -32 L ${90 + flameLength} 0 L 90 32 Z`}
            fill="url(#g-thrust-fire)"
            opacity={flameOsc}
            filter="url(#f-thrust-glow)"
          />
          {/* Internal Shock Diamond Cones */}
          {[35, 75, 115].map((dx, i) => (
            <polygon
              key={i}
              points={`${90 + dx},-14 ${115 + dx},0 ${90 + dx},14 ${75 + dx},0`}
              fill="#FFFFFF"
              opacity={0.8}
              filter="url(#f-thrust-glow)"
            />
          ))}

          {/* Aerodynamic Nacelle Cowling */}
          <path
            d="M -105 -55 C -40 -60 55 -48 90 -34 L 90 34 C 55 48 -40 60 -105 55 C -122 35 -122 -35 -105 -55 Z"
            fill="url(#g-engine-metal)"
            stroke="#94A3B8"
            strokeWidth="3.5"
          />

          {/* Titanium Fan Blades Spinning at High RPM */}
          <g transform="translate(-90, 0)">
            <ellipse cx="0" cy="0" rx="14" ry="48" fill="#020617" stroke="#334155" strokeWidth="2.5"/>
            <g transform={`rotate(${fanSpin})`}>
              {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="0"
                  x2={Math.cos(deg) * 42}
                  y2={Math.sin(deg) * 42}
                  stroke="#CBD5E1"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
              <circle cx="0" cy="0" r="12" fill="#E2E8F0" stroke="#475569" strokeWidth="2.5"/>
            </g>
          </g>

          {/* Heavy Wing Pylon Strut */}
          <polygon points="-35,-56 25,-56 45,-90 -15,-90" fill="#334155" stroke="#64748B" strokeWidth="2.5"/>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 2: Airfoil Aerodynamics & Bernoulli Lift (18.54s – 25.38s) ── */
const ArtTakeoffLift: Art = ({ f, t, fps }) => {
  const streamOffset = (t * 220) % 100;
  const liftPulse = 1 + Math.sin(t * 4) * 0.08;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          {/* Airfoil Cross-Section (Aircraft Wing Profile) */}
          <path
            d="M -135 0 C -135 -48 -15 -44 130 0 C -15 20 -105 18 -135 0 Z"
            fill="url(#g-engine-metal)"
            stroke="#38BDF8"
            strokeWidth="3.5"
          />

          {/* Top Fast Low-Pressure Airflow (Bernoulli Streamlines) */}
          {[-58, -42, -26].map((y, i) => (
            <path
              key={`top-${i}`}
              d={`M -190 ${y + 16} Q -25 ${y - 20} 180 ${y + 14}`}
              fill="none"
              stroke="#00E5FF"
              strokeWidth="3.5"
              strokeDasharray="16 12"
              strokeDashoffset={-streamOffset * 1.6}
            />
          ))}

          {/* Bottom High-Pressure Slower Airflow */}
          {[26, 44].map((y, i) => (
            <path
              key={`bot-${i}`}
              d={`M -190 ${y} Q -25 ${y + 6} 180 ${y}`}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeDasharray="12 12"
              strokeDashoffset={-streamOffset}
            />
          ))}

          {/* Massive Pulsing LIFT Vector Arrow */}
          <g transform={`translate(0, -68) scale(${liftPulse})`}>
            <line x1="0" y1="45" x2="0" y2="-25" stroke="#10B981" strokeWidth="7" strokeLinecap="round"/>
            <polygon points="-14,-20 0,-44 14,-20" fill="#10B981"/>
          </g>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 3: Rotation (Vr) & Soaring Upwards (25.38s – 30.30s) ── */
const ArtTakeoffRotation: Art = ({ f, t, fps }) => {
  const pitchAngle = interpolate(c01((t - 25.38) / 3.0), [0, 1], [-2, -18], { easing: ease.out });
  const climbY = interpolate(c01((t - 25.38) / 3.0), [0, 1], [0, -50], { easing: ease.out });

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={24}>
        <g transform={`translate(260, ${150 + climbY})`} filter="url(#f-real-drop)">
          {/* Runway Ground Line */}
          <line x1="-220" y1="80" x2="220" y2="80" stroke="#475569" strokeWidth="4.5"/>
          <line x1="-200" y1="80" x2="200" y2="80" stroke="#FDE047" strokeWidth="3" strokeDasharray="20 14"/>

          {/* Commercial Aircraft Rotating Upwards */}
          <g transform={`rotate(${pitchAngle})`}>
            {/* Aerodynamic Fuselage */}
            <path
              d="M 125 0 C 95 -24 -105 -24 -145 -6 L -170 -38 L -158 0 L -145 14 L 85 14 Z"
              fill="#F8FAFC"
              stroke="#0284C7"
              strokeWidth="3.5"
            />
            {/* Wing Swept Back */}
            <polygon points="-32,6 24,6 -22,48 -54,48" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5"/>
            {/* Engine Thrust Flame Blast */}
            <path d="M -48 30 L -95 30" stroke="#F97316" strokeWidth="5" filter="url(#f-thrust-glow)"/>
          </g>
        </g>
      </In>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   RIGHT — LANDING (লেণ্ডিং)
   ══════════════════════════════════════════════════════════════ */

/* ── SCENE 4: Touchdown, Smoke & Gear Compression (30.38s – 37.02s) ── */
const ArtLandingTouchdown: Art = ({ f, t, fps }) => {
  const smokePuff = (t * 5) % 1;
  const smokeR = smokePuff * 30;
  const smokeOp = 1 - smokePuff;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          {/* Asphalt Runway with Centerline */}
          <rect x="-220" y="65" width="440" height="28" fill="url(#g-asphalt)" stroke="#475569" strokeWidth="2"/>
          <line x1="-200" y1="78" x2="200" y2="78" stroke="#FBBF24" strokeWidth="3" strokeDasharray="24 16"/>

          {/* Heavy Multi-Wheel Main Landing Gear Bogie */}
          <g transform="translate(0, 5)">
            {/* Oleo Shock Strut Compression */}
            <rect x="-9" y="-72" width="18" height="88" rx="4" fill="#64748B" stroke="#1E293B" strokeWidth="2.5"/>
            <rect x="-5" y="-30" width="10" height="46" fill="#F1F5F9"/>
            <line x1="-38" y1="20" x2="38" y2="20" stroke="#334155" strokeWidth="6"/>

            {/* Twin Heavy Tires Touchdown on Tarmac */}
            {[-34, 34].map((tx) => (
              <g key={tx} transform={`translate(${tx}, 20)`}>
                <circle cx="0" cy="0" r="28" fill="#0F172A" stroke="#334155" strokeWidth="3.5"/>
                <circle cx="0" cy="0" r="14" fill="#94A3B8" stroke="#475569" strokeWidth="2"/>
              </g>
            ))}

            {/* Dynamic Friction Smoke Puffs */}
            {[-34, 34].map((tx) => (
              <circle
                key={`smoke-${tx}`}
                cx={tx - 14}
                cy={42}
                r={smokeR}
                fill="#E2E8F0"
                opacity={smokeOp}
                filter="url(#f-thrust-glow)"
              />
            ))}
          </g>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 5: Wing Spoilers & Engine Reverse Thrust (37.02s – 44.58s) ── */
const ArtLandingReverse: Art = ({ f, t, fps }) => {
  const reversePlume = (t * 150) % 80;

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          {/* Wing Structure */}
          <path d="M -165 10 L 75 10 L 135 22 L -145 22 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="3"/>
          {/* Speed-Brake Flight Spoiler Popped Up at 45° */}
          <polygon points="-45,10 45,10 25,-35 -65,-35" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5"/>

          {/* Engine Nacelle with Reverse Thrust Blocker Doors Open */}
          <g transform="translate(0, 48)">
            <rect x="-90" y="-22" width="180" height="44" rx="8" fill="url(#g-engine-metal)" stroke="#64748B" strokeWidth="2.5"/>
            {/* Cascade Vanes Deflecting Forward */}
            <rect x="-28" y="-24" width="56" height="48" fill="#020617" stroke="#F97316" strokeWidth="2"/>
            {/* Forward-Directed Reverse Jet Streamlines (Braking) */}
            {[-1, 1].map((dir) => (
              <path
                key={dir}
                d={`M 0 ${dir * 12} Q ${-35 - reversePlume} ${dir * 38} ${-90 - reversePlume} ${dir * 48}`}
                fill="none"
                stroke="#00E5FF"
                strokeWidth="4"
                filter="url(#f-thrust-glow)"
              />
            ))}
          </g>
        </g>
      </In>
    </>
  );
};

/* ── SCENE 6: Speedometer Deceleration & Safe Stop (44.58s – 48.80s) ── */
const ArtLandingSafeStop: Art = ({ f, t, fps }) => {
  const speedNeedle = interpolate(c01((t - 44.58) / 3.0), [0, 1], [110, -110]);

  return (
    <>
      <In f={f} fps={fps} at={0.0} dy={22}>
        <g transform="translate(260, 140)" filter="url(#f-real-drop)">
          {/* Cockpit Airspeed Indicator Gauge */}
          <circle cx="0" cy="0" r="90" fill="#020617" stroke="#0284C7" strokeWidth="4"/>
          <circle cx="0" cy="0" r="76" fill="#0F172A" stroke="#334155" strokeWidth="2.5"/>

          {/* Gauge Ticks */}
          {[-120, -80, -40, 0, 40, 80, 120].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="-70"
              x2="0"
              y2="-60"
              stroke="#94A3B8"
              strokeWidth="2.5"
              transform={`rotate(${deg})`}
            />
          ))}

          {/* Dynamic Braking Needle */}
          <g transform={`rotate(${speedNeedle})`}>
            <line x1="0" y1="14" x2="0" y2="-66" stroke="#EF4444" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="0" cy="0" r="7" fill="#F8FAFC"/>
          </g>

          {/* Verified Safe Stop Indicator */}
          <g transform="translate(0, 38)">
            <rect x="-52" y="-14" width="104" height="28" rx="8" fill="#065F46" stroke="#10B981" strokeWidth="2"/>
            <text x="0" y="6" textAnchor="middle" fontSize={14} fontWeight={900} fill="#ECFDF5" fontFamily={DS.mono}>
              0 KNOTS
            </text>
          </g>
        </g>
      </In>
    </>
  );
};

/* ─── Scene Registry & Phase Mappings ───────────────────────── */
type SceneId = "takeoffThrust" | "takeoffLift" | "takeoffRotation"
             | "landingTouchdown" | "landingReverse" | "landingSafeStop";

interface Copy { chip: string; tone: Tone }
type Tone = "amber" | "blue" | "cyan" | "green";

const SCENES: Record<SceneId, { Art: Art; copy: Copy }> = {
  takeoffThrust:    { Art: ArtTakeoffThrust,    copy: { chip: "TAKEOFF · ইঞ্জিনৰ সৰ্বোচ্চ শক্তি", tone: "amber" } },
  takeoffLift:      { Art: ArtTakeoffLift,      copy: { chip: "বতাহৰ চাপ আৰু লিফ্ট (LIFT)",      tone: "cyan"  } },
  takeoffRotation:  { Art: ArtTakeoffRotation,  copy: { chip: "মাধ্যাকৰ্ষণ জয় কৰি আকাশলৈ উৰণ", tone: "amber" } },
  landingTouchdown: { Art: ArtLandingTouchdown, copy: { chip: "LANDING · ৰাণৱেত টাচডাউন",       tone: "blue"  } },
  landingReverse:   { Art: ArtLandingReverse,   copy: { chip: "ব্ৰেক আৰু REVERSE THRUST",         tone: "blue"  } },
  landingSafeStop:  { Art: ArtLandingSafeStop,  copy: { chip: "গতি কমাই নিৰাপদ অৱতৰণ",        tone: "green" } },
};

const PHASES = {
  left: [
    { id: "takeoffThrust"    as SceneId, from: 9.50  },
    { id: "takeoffLift"      as SceneId, from: 18.54 },
    { id: "takeoffRotation"  as SceneId, from: 25.38 },
  ],
  right: [
    { id: "landingTouchdown" as SceneId, from: 30.38 },
    { id: "landingReverse"   as SceneId, from: 37.02 },
    { id: "landingSafeStop"  as SceneId, from: 44.58 },
  ],
} as const;

/* ─── Bold & Prominent 33px Text Chip ─────────────────────── */
const TextBlock: React.FC<{ copy: Copy; f: number; t: number; fps: number; idx: number; total: number }> = ({
  copy, f, t, fps, idx, total,
}) => {
  const c =
    copy.tone === "amber" ? DS.amber :
    copy.tone === "blue"  ? DS.blue  :
    copy.tone === "cyan"  ? DS.cyan  : DS.green;

  const grad =
    copy.tone === "amber" ? "linear-gradient(90deg,#C2410C,#F97316)" :
    copy.tone === "blue"  ? "linear-gradient(90deg,#0284C7,#00E5FF)" :
    copy.tone === "cyan"  ? "linear-gradient(90deg,#0D9488,#14B8A6)" :
                            "linear-gradient(90deg,#059669,#10B981)";

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
    point.id.includes("summary") || currentTime >= 48.80
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
  if (point.id.includes("left")  || isLeft  || point.id.includes("takeoff")) side = "left";
  if (point.id.includes("right") || isRight || point.id.includes("landing")) side = "right";
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