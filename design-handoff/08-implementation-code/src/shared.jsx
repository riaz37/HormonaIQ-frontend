// Shared components, helpers, icons — Morning Garden palette
// Banned in user-facing copy: Wonderful, luminous, glowing, radiant, flourish, journey, wellness,
// take control, listen to your body, your feelings are valid, I hear you, you deserve, be gentle,
// lean into, halfway there, almost there, you've got this, calorie, macro, BMI, goal weight
const { useState, useEffect, useMemo, useRef, createContext, useContext } = React;

// T-49 — 5 phases including luteal-deep tier (Lm = early luteal, Ls = late luteal/peak)
const PHASE_COLORS = {
  F: 'var(--phase-follicular)',
  O: 'var(--phase-ovulatory)',
  L: 'var(--phase-luteal)',          // legacy alias = early luteal
  Lm: 'var(--phase-luteal)',
  Ls: 'var(--phase-luteal-deep)',
  M: 'var(--phase-menstrual)',
};
// T-49 — phase ink for pill/legend text contrast (extended to Lm/Ls)
const PHASE_INK = {
  F: '#3A5C3F',
  O: '#7A5A1F',
  L: '#7A3A2A',
  Lm: '#7A3A2A',
  Ls: '#5C2820',
  M: '#5A2C3A',
  '?': '#3A5C3F',
};

const PHASE_NAMES = {
  F: 'Follicular',
  O: 'Ovulatory',
  L: 'Luteal',
  Lm: 'Early luteal',
  Ls: 'Late luteal',
  M: 'Menstrual',
  '?': 'Variable',
};
// T-93 — custom SVG icons replace emoji set (sage / coral / deep-coral strokes)
function LeafSimple({ size = 16, color = 'var(--coral)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'inline-block', verticalAlign: '-2px' }}>
      <path d="M8 14 Q 2 11 3 5 Q 8 3 13 5 Q 14 11 8 14 Z" fill={color} opacity="0.9" />
      <path d="M8 14 Q 6 9 5 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
    </svg>
  );
}
function WavyLine({ size = 16, color = 'var(--ink-2)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'inline-block', verticalAlign: '-2px' }}>
      <path d="M 1.5 8 Q 4 4, 6.5 8 T 11.5 8 T 16 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
// Phase icon factory — returns a tiny element renderer per phase
const PhaseIconFor = (phase) => {
  switch (phase) {
    case 'F':  return <Sprig size={14} color="var(--sage)" />;
    case 'O':  return <Icon.Sun width={14} height={14} style={{ color: 'var(--butter-deep)' }} />;
    case 'Lm': return <LeafSimple size={14} color="var(--coral)" />;
    case 'Ls': return (
      <span style={{ display: 'inline-block', transform: 'rotate(35deg)' }}>
        <LeafSimple size={14} color="var(--phase-luteal-deep)" />
      </span>
    );
    case 'L':  return <LeafSimple size={14} color="var(--coral)" />;
    case 'M':  return <Icon.Moon width={14} height={14} style={{ color: 'var(--rose)' }} />;
    case '?':  return <WavyLine size={14} color="var(--ink-2)" />;
    default:   return <Sprig size={14} color="var(--sage)" />;
  }
};
const PHASE_VIBES = {
  F:  { word: 'Follicular', icon: '🌱' },
  O:  { word: 'Peak',       icon: '☀️' },
  L:  { word: 'Luteal',     icon: '🍂' },
  Lm: { word: 'Luteal',     icon: '🌗' },
  Ls: { word: 'Late luteal', icon: '🌑' },
  M:  { word: 'Menstrual',  icon: '🌙' },
  '?': { word: 'Variable',  icon: '🍃' },
};

// T-49 — phaseForDay returns 5 phases. `coarse: true` collapses Lm/Ls → 'L' for legacy callers.
function phaseForDay(day, cycleLen, opts) {
  const c = cycleLen || 28;
  const coarse = opts && opts.coarse;
  // T-15 — irregular/PCOS mode returns '?' for any day (uncertain)
  if (opts && opts.irregular) return '?';
  // M = last 5 days of cycle (was first 5 — keep first-5 for back-compat)
  if (day <= 5) return 'M';
  if (day > c - 5) return 'M';
  const fEnd = Math.round(c * 0.45);
  const oEnd = Math.round(c * 0.55);
  const lmEnd = Math.round(c * 0.78);
  if (day <= fEnd) return 'F';
  if (day <= oEnd) return 'O';
  if (day <= lmEnd) return coarse ? 'L' : 'Lm';
  return coarse ? 'L' : 'Ls';
}

// Sprig — friendly leaf logo mark
function Sprig({ size = 28, color = 'var(--eucalyptus)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
      {/* stem */}
      <path d="M 16 28 Q 16 18 16 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {/* leaves */}
      <path d="M 16 22 Q 9 21 7 14 Q 14 14 16 22" fill={color} opacity="0.85" />
      <path d="M 16 17 Q 23 16 25 9 Q 18 9 16 17" fill={color} opacity="0.7" />
      <path d="M 16 12 Q 11 11 10 6 Q 15 6 16 12" fill={color} opacity="0.55" />
      {/* bud */}
      <circle cx="16" cy="6" r="2.4" fill={color} />
    </svg>
  );
}

// T-64 — Wordmark refinement: single Instrument Serif family, italic 400 + roman 500 differentiates;
// "IQ" sits in eucalyptus, kerning tightened.
function Wordmark({ size = 18, color }) {
  return (
    <span style={{ fontSize: size, color: color || 'inherit', whiteSpace: 'nowrap', lineHeight: 1, fontFeatureSettings: '"kern" 1' }}>
      <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontWeight: 400 }}>Hormona</span>
      <span style={{ fontFamily: 'var(--display)', fontStyle: 'normal', fontWeight: 500, marginLeft: -1, color: color || 'var(--eucalyptus)' }}>IQ</span>
    </span>
  );
}

function Logo({ size = 18, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <Sprig size={size + 10} color={color || 'var(--eucalyptus)'} />
      <Wordmark size={size} color={color} />
    </div>
  );
}

// Decorative blob
function Blob({ size = 220, color = 'var(--mint-mist)', style = {}, animate }) {
  return (
    <div className={animate ? 'drift' : ''}
      style={{
        position: 'absolute', width: size, height: size, borderRadius: '50%',
        background: color, filter: 'blur(40px)', opacity: 0.55,
        pointerEvents: 'none', ...style,
      }} />
  );
}

// Soft leaf decorations — T-48 leaf-grow animation applied by default
function Leaf({ size = 60, color = 'var(--sage)', style = {}, rotate = 0, animate = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80"
      style={{ position: 'absolute', transform: `rotate(${rotate}deg)`, transformOrigin: 'center', ...style }}
      className={'leaf-deco ' + (animate ? 'leaf-grow' : '')}>
      <path d="M 40 70 Q 8 60 12 24 Q 36 12 60 18 Q 72 44 40 70 Z" fill={color} />
      <path d="M 40 70 Q 30 50 24 26" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

const Icon = {
  Home: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>,
  Plus: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Grid: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  Bars: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><path d="M4 20V12M10 20V8M16 20V14M22 20V4"/></svg>,
  Sun: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>,
  Moon: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z"/></svg>,
  ChevDown: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>,
  ChevLeft: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6"/></svg>,
  ChevRight: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6"/></svg>,
  Check: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l5 5L20 7"/></svg>,
  Sparkle: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z" opacity="0.95"/><circle cx="19" cy="18" r="1.4"/><circle cx="5" cy="19" r="1"/></svg>,
  Heart: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 21s-7-4.5-9.5-9.5C0.5 7 4 3 8 5c1.5 0.7 2.7 2 4 4 1.3-2 2.5-3.3 4-4 4-2 7.5 2 5.5 6.5C19 16.5 12 21 12 21z"/></svg>,
  Settings: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19 15a1.7 1.7 0 0 0 .3 1.8 2 2 0 1 1-2.8 2.8 1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0 1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3 2 2 0 1 1-2.8-2.8 1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.5-1A1.7 1.7 0 0 0 4.2 7.2a2 2 0 1 1 2.8-2.8 1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0 1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3 2 2 0 1 1 2.8 2.8 1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>,
  Info: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4M8 5v.01"/></svg>,
  Bell: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>,
  Wave: (p) => <svg viewBox="0 0 60 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M2 8 Q 8 2, 14 8 T 26 8 T 38 8 T 50 8 T 62 8"/></svg>,
  // T-47 — Phosphor-style additions for Tools tiles & Profile group titles
  Lock: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>,
  Bolt: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>,
  Flask: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 3h6M10 3v6L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3"/></svg>,
  Heartbeat: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12h4l2-5 4 10 2-5h6"/></svg>,
  Drop: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3s7 7 7 12a7 7 0 1 1-14 0c0-5 7-12 7-12z"/></svg>,
  Brain: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 4a3 3 0 0 0-3 3v2a3 3 0 0 0-2 3 3 3 0 0 0 2 3v2a3 3 0 0 0 3 3h2V4H8zM16 4a3 3 0 0 1 3 3v2a3 3 0 0 1 2 3 3 3 0 0 1-2 3v2a3 3 0 0 1-3 3h-2V4h2z"/></svg>,
  Calendar: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>,
  TestTube: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 3v13a3 3 0 0 0 6 0V3M8 3h8M9 12h6"/></svg>,
  Activity: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>,
  Clipboard: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/></svg>,
  Pill: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="9" width="20" height="6" rx="3" transform="rotate(-30 12 12)"/><path d="M12 5l4 7" /></svg>,
  Mic: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>,
  Trash: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>,
  Compass: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M15 9l-2 5-5 2 2-5z"/></svg>,
  Stack: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 7l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 17l9 4 9-4"/></svg>,
  Eye: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
  Tag: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 12L12 4H4v8l8 8 8-8z"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/></svg>,
  Spiral: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 12a3 3 0 1 0 3 3 5 5 0 0 0-5-5 7 7 0 0 0-7 7"/></svg>,
  Hourglass: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 3h12M6 21h12M7 3v3a5 5 0 0 0 10 0V3M7 21v-3a5 5 0 0 1 10 0v3"/></svg>,
  Pulse: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12h3l2-3 4 6 2-3h7"/></svg>,
  Users: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M21 20c0-2.5-1.5-4.5-4-5.4"/></svg>,
  Database: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>,
  Microscope: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 18h12M9 18v-3a4 4 0 0 1 4-4M11 11V6h3v5"/><circle cx="13" cy="14" r="3"/></svg>,
  Anchor: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="5" r="2"/><path d="M12 7v15M5 14a7 7 0 0 0 14 0M3 14h4M17 14h4"/></svg>,
  Phone: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 4h4l2 5-2 1a12 12 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>,
  Question: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-1 1-2 2-2 3M12 17v.01"/></svg>,
  Swap: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 8h14l-3-3M21 16H7l3 3"/></svg>,
  Flame: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3s5 5 5 10a5 5 0 0 1-10 0c0-3 2-5 2-7 1 1 3 2 3-3z"/></svg>,
  Folder: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  Download: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 4v12M7 11l5 5 5-5M5 20h14"/></svg>,
  Cycle: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/></svg>,
};

// Cycle ring — beautiful organic, T-49 5-segment with luteal-deep tier
function CycleRing({ cycleDay, cycleLen, size = 260, animated = true }) {
  const r = size / 2 - 18;
  const cx = size / 2, cy = size / 2;
  const phase = phaseForDay(cycleDay, cycleLen);

  // T-49 — 5 segments: M (early) → F → O → Lm → Ls → M (late, last 5 days)
  const fEnd = Math.round(cycleLen * 0.45);
  const oEnd = Math.round(cycleLen * 0.55);
  const lmEnd = Math.round(cycleLen * 0.78);
  const segs = [
    { from: 1, to: 5, color: 'var(--phase-menstrual)', name: 'M' },
    { from: 6, to: fEnd, color: 'var(--phase-follicular)', name: 'F' },
    { from: fEnd + 1, to: oEnd, color: 'var(--phase-ovulatory)', name: 'O' },
    { from: oEnd + 1, to: lmEnd, color: 'var(--phase-luteal)', name: 'Lm' },
    { from: lmEnd + 1, to: cycleLen - 5, color: 'var(--phase-luteal-deep)', name: 'Ls' },
    { from: cycleLen - 4, to: cycleLen, color: 'var(--phase-menstrual)', name: 'M' },
  ].filter(s => s.from <= s.to);

  function arcPath(from, to) {
    const a1 = ((from - 1) / cycleLen) * 360 - 90;
    const a2 = (to / cycleLen) * 360 - 90;
    const r1 = (a1 * Math.PI) / 180;
    const r2 = (a2 * Math.PI) / 180;
    const x1 = cx + r * Math.cos(r1), y1 = cy + r * Math.sin(r1);
    const x2 = cx + r * Math.cos(r2), y2 = cy + r * Math.sin(r2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const dotAngle = ((cycleDay / cycleLen) * 360 - 90) * Math.PI / 180;
  const dotX = cx + r * Math.cos(dotAngle);
  const dotY = cy + r * Math.sin(dotAngle);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="cring-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--butter)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--butter)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r - 8} fill="url(#cring-glow)" />
      {/* outer track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="1" />
      {segs.map((s, i) => (
        <path key={i} d={arcPath(s.from, s.to)} stroke={s.color} strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.95" />
      ))}
      {/* center plate for legibility */}
      <circle cx={cx} cy={cy} r={r - 22} fill="var(--paper)" opacity="0.92" />
      <circle cx={cx} cy={cy} r={r - 22} fill="none" stroke="var(--border)" strokeWidth="0.5" />
      {/* T-48 — pulse-ring behind central Day label */}
      {animated && (
        <circle cx={cx} cy={cy} r={r - 32} fill="none" stroke="var(--eucalyptus-soft)" strokeWidth="0.8" opacity="0.4">
          <animate attributeName="r" values={`${r - 36};${r - 24};${r - 36}`} dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.45;0.1;0.45" dur="6s" repeatCount="indefinite" />
        </circle>
      )}
      {/* current day dot */}
      <circle cx={dotX} cy={dotY} r="14" fill="var(--paper)" stroke="var(--eucalyptus)" strokeWidth="2.5" />
      <circle cx={dotX} cy={dotY} r="5" fill="var(--eucalyptus)" />
      {animated && (
        <circle cx={dotX} cy={dotY} r="14" fill="none" stroke="var(--eucalyptus)" strokeWidth="2" opacity="0.4">
          <animate attributeName="r" values="14;24;14" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
      )}
      {/* center text */}
      <text x={cx} y={cy - 2} textAnchor="middle" fill="var(--ink)" fontFamily="Instrument Serif" fontSize="44" fontWeight="400">Day {cycleDay}</text>
      <text x={cx} y={cy + 22} textAnchor="middle" fill="var(--ink-3)" fontFamily="Inter" fontSize="11" letterSpacing="2.5">{PHASE_NAMES[phase].toUpperCase()}</text>
    </svg>
  );
}

function ProgressBar({ pct, height = 5 }) {
  return (
    <div style={{ height, background: 'var(--mint-mist)', width: '100%', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg, var(--sage), var(--eucalyptus))', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)', borderRadius: 999 }} />
    </div>
  );
}

// AppContext
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function nextDays(startCycleDay, cycleLen, n = 7) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = ((startCycleDay - 1 + i) % cycleLen) + 1;
    days.push({ cycleDay: d, phase: phaseForDay(d, cycleLen) });
  }
  return days;
}

// DRSP chart — T-57: ink-filled bars, severity dot above, recessed phase bands (5 phases incl luteal-deep),
// vertical 7-day grid lines, larger axis labels, shimmer in on initial render.
function DRSPChart({ data, cycleLen = 28, mono = false, height = 200 }) {
  const W = 360, H = height, pad = { l: 28, r: 12, t: 18, b: 26 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const barW = innerW / cycleLen - 2;
  const yFor = (s) => pad.t + innerH - (s / 6) * innerH;
  const sevDotColor = (s) => {
    if (mono) return '#3A4A3F';
    if (s <= 2) return 'var(--severity-mild)';
    if (s <= 4) return 'var(--severity-mod)';
    return 'var(--severity-severe)';
  };
  const barFill = mono ? '#222' : 'var(--ink)';
  const xFor = (d) => pad.l + ((d - 1) / cycleLen) * innerW;
  const fEnd = Math.round(cycleLen * 0.45);
  const oEnd = Math.round(cycleLen * 0.55);
  const lmEnd = Math.round(cycleLen * 0.78);
  // T-48 shimmer-in: stagger bar opacity via initial transform pulse — applied via CSS class on g.bars
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 30); return () => clearTimeout(t); }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {!mono && (
        <g opacity="0.18">
          <rect x={xFor(1)} y={pad.t} width={xFor(6) - xFor(1)} height={innerH} fill="var(--phase-menstrual)" rx="4" />
          <rect x={xFor(6)} y={pad.t} width={xFor(fEnd + 1) - xFor(6)} height={innerH} fill="var(--phase-follicular)" rx="4" />
          <rect x={xFor(fEnd + 1)} y={pad.t} width={xFor(oEnd + 1) - xFor(fEnd + 1)} height={innerH} fill="var(--phase-ovulatory)" rx="4" />
          <rect x={xFor(oEnd + 1)} y={pad.t} width={xFor(lmEnd + 1) - xFor(oEnd + 1)} height={innerH} fill="var(--phase-luteal)" rx="4" />
          <rect x={xFor(lmEnd + 1)} y={pad.t} width={xFor(Math.max(cycleLen - 4, lmEnd + 2)) - xFor(lmEnd + 1)} height={innerH} fill="var(--phase-luteal-deep)" rx="4" />
          {cycleLen > 5 && (
            <rect x={xFor(Math.max(cycleLen - 4, lmEnd + 2))} y={pad.t} width={xFor(cycleLen + 1) - xFor(Math.max(cycleLen - 4, lmEnd + 2))} height={innerH} fill="var(--phase-menstrual)" rx="4" />
          )}
        </g>
      )}
      {/* horizontal severity gridlines */}
      {[1,2,3,4,5,6].map(s => (
        <g key={s}>
          <line x1={pad.l} x2={W - pad.r} y1={yFor(s)} y2={yFor(s)} stroke={mono ? '#ddd' : 'rgba(60,95,75,0.10)'} strokeWidth="0.5" strokeDasharray={s % 2 ? '0' : '2 3'} />
          <text x={pad.l - 6} y={yFor(s) + 3} textAnchor="end" fontFamily="JetBrains Mono" fontSize="10" fill={mono ? '#444' : 'var(--ink-2)'}>{s}</text>
        </g>
      ))}
      {/* T-57 — vertical grid every 7 days */}
      {!mono && Array.from({ length: Math.floor(cycleLen / 7) + 1 }, (_, i) => i * 7).filter(n => n >= 7 && n <= cycleLen).map(n => (
        <line key={'v' + n} x1={xFor(n)} x2={xFor(n)} y1={pad.t} y2={pad.t + innerH} stroke="rgba(60,95,75,0.08)" strokeWidth="0.6" />
      ))}
      <g style={{ transition: 'opacity 0.4s ease', opacity: mounted ? 1 : 0 }}>
        {data.map(d => {
          const h = pad.t + innerH - yFor(d.score);
          const bx = xFor(d.day) + 1;
          const by = yFor(d.score);
          return (
            <g key={d.day}>
              <rect
                x={bx}
                y={by}
                width={Math.max(barW, 4)}
                height={h}
                fill={barFill}
                opacity={d.estimated ? 0.35 : 0.85}
                rx="3"
              />
              {/* T-57 — severity dot above bar (mild/mod/severe) */}
              {!mono && d.score >= 1 && (
                <circle cx={bx + Math.max(barW, 4) / 2} cy={Math.max(by - 4, pad.t - 4)} r="2.4" fill={sevDotColor(d.score)} opacity="0.9" />
              )}
            </g>
          );
        })}
      </g>
      {[1, 7, 14, 21, 28].filter(n => n <= cycleLen).map(n => (
        <text key={n} x={xFor(n) + 2} y={H - 6} fontFamily="JetBrains Mono" fontSize="10" fill={mono ? '#444' : 'var(--ink-2)'}>{n}</text>
      ))}
    </svg>
  );
}

// T-61 — compact 5-phase legend pill
function PhaseLegend({ compact = false }) {
  const items = [
    { k: 'F', n: 'Follicular' },
    { k: 'O', n: 'Ovulatory' },
    { k: 'Lm', n: 'Early luteal' },
    { k: 'Ls', n: 'Late luteal' },
    { k: 'M', n: 'Menstrual' },
  ];
  return (
    <div className="phase-legend" style={{ justifyContent: compact ? 'center' : 'flex-start' }}>
      {items.map(it => (
        <span key={it.k}>
          <i style={{ background: PHASE_COLORS[it.k] }} />
          {it.n}
        </span>
      ))}
    </div>
  );
}

// T-84 — Ora feedback footer for every .ora-card insight.
// Renders three text-link buttons: Helpful · Not for me · Wrong about today
function OraFeedback({ insightId }) {
  const ctx = useContext(AppCtx);
  const state = ctx?.state || {};
  const setState = ctx?.setState || (() => {});
  const stored = (state.oraFeedback || {})[insightId];
  const [ack, setAck] = useState(stored || null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [showHelpful, setShowHelpful] = useState(false);

  const choose = (kind) => {
    setAck(kind);
    setState(s => ({ ...s, oraFeedback: { ...(s.oraFeedback || {}), [insightId]: kind } }));
    if (kind === 'helpful') {
      setShowHelpful(true);
      setTimeout(() => setShowHelpful(false), 1400);
    }
    if (kind === 'wrong') setShowCorrection(true);
  };

  const linkStyle = {
    background: 'none', border: 'none', padding: 0,
    color: 'var(--eucalyptus)', fontSize: 12, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
  };
  const sep = <span style={{ color: 'var(--ink-3)', fontSize: 12, padding: '0 6px' }}>·</span>;

  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(63,111,90,0.12)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', minHeight: 26 }}>
      {ack === 'not_relevant' ? (
        <span className="caption" style={{ fontSize: 12 }}>Got it. I'll dial that back.</span>
      ) : showHelpful ? (
        <span className="caption" style={{ fontSize: 12, color: 'var(--eucalyptus)' }}>
          ✓ noted
        </span>
      ) : (
        <>
          <button style={linkStyle} onClick={() => choose('helpful')}>Helpful</button>
          {sep}
          <button style={linkStyle} onClick={() => choose('not_relevant')}>Not for me</button>
          {sep}
          <button style={linkStyle} onClick={() => choose('wrong')}>Wrong about today</button>
        </>
      )}
      {showCorrection && (
        <div style={{ width: '100%', marginTop: 10, padding: 12, background: 'var(--paper)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <div className="caption" style={{ fontSize: 12, marginBottom: 8 }}>What's off?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button className="btn-soft" style={{ height: 40, fontSize: 13, justifyContent: 'flex-start', paddingLeft: 14 }} onClick={() => { setShowCorrection(false); }}>
              Cycle day looks wrong
            </button>
            <button className="btn-soft" style={{ height: 40, fontSize: 13, justifyContent: 'flex-start', paddingLeft: 14 }} onClick={() => { setShowCorrection(false); }}>
              Predicted phase looks wrong
            </button>
            <button className="btn-ghost" style={{ alignSelf: 'flex-start', fontSize: 12 }} onClick={() => setShowCorrection(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// T-59 — shared EmptyState
function EmptyState({ icon, title, body, cta, ctaLabel }) {
  const I = icon || Icon.Sparkle;
  return (
    <div className="empty-state fade-up">
      <div className="empty-icon leaf-grow">
        <I width="32" height="32" />
      </div>
      <h2 className="h2" style={{ marginBottom: 6 }}>{title}</h2>
      {body && <div className="caption" style={{ maxWidth: 320, lineHeight: 1.5 }}>{body}</div>}
      {cta && ctaLabel && (
        <button className="btn-soft" style={{ marginTop: 18, minWidth: 180 }} onClick={cta}>{ctaLabel}</button>
      )}
    </div>
  );
}

// R7 — PDF generation helper using jspdf (loaded via CDN in HormonaIQ.html)
// generatePDF({ title, subtitle, sections: [{ heading, lines, table?: { headers, rows } }], filename }) → triggers download
function generatePDF(opts) {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert('PDF generator not yet loaded. Please reload and try again.');
    return null;
  }
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const setFont = (sz, weight) => {
    doc.setFont('helvetica', weight || 'normal');
    doc.setFontSize(sz);
  };

  // Header band — eucalyptus accent
  doc.setFillColor(43, 78, 60);
  doc.rect(0, 0, pageW, 6, 'F');

  // Title block
  setFont(20, 'bold');
  doc.setTextColor(43, 78, 60);
  doc.text(opts.title || 'HormonaIQ Patient Report', margin, y + 14);
  y += 28;
  if (opts.subtitle) {
    setFont(11, 'normal');
    doc.setTextColor(100, 110, 100);
    doc.text(opts.subtitle, margin, y);
    y += 16;
  }
  setFont(9, 'normal');
  doc.setTextColor(140, 145, 140);
  doc.text(`Generated ${new Date().toLocaleDateString()} · HormonaIQ`, margin, y);
  y += 22;

  // Divider
  doc.setDrawColor(220, 225, 218);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  const ensureSpace = (h) => {
    if (y + h > pageH - margin - 24) {
      // Footer on previous page
      setFont(8, 'normal');
      doc.setTextColor(160, 165, 160);
      doc.text('HormonaIQ · Patient self-report — discuss with provider', margin, pageH - 24);
      doc.addPage();
      y = margin;
    }
  };

  (opts.sections || []).forEach(section => {
    ensureSpace(40);
    // Section heading
    setFont(13, 'bold');
    doc.setTextColor(43, 78, 60);
    doc.text(section.heading, margin, y);
    y += 14;
    doc.setDrawColor(180, 195, 178);
    doc.line(margin, y, margin + 60, y);
    y += 12;

    // Body lines
    (section.lines || []).forEach(line => {
      ensureSpace(14);
      if (typeof line === 'object' && line.kind === 'kv') {
        setFont(10, 'bold');
        doc.setTextColor(60, 70, 62);
        doc.text(line.key + ':', margin, y);
        setFont(10, 'normal');
        doc.setTextColor(40, 50, 42);
        const keyW = doc.getTextWidth(line.key + ':');
        doc.text(String(line.value || '—'), margin + keyW + 6, y);
        y += 14;
      } else {
        setFont(10, 'normal');
        doc.setTextColor(40, 50, 42);
        const wrapped = doc.splitTextToSize(String(line), pageW - margin * 2);
        wrapped.forEach(w => {
          ensureSpace(13);
          doc.text(w, margin, y);
          y += 13;
        });
      }
    });

    // Optional table
    if (section.table) {
      y += 6;
      const t = section.table;
      const colW = (pageW - margin * 2) / t.headers.length;
      ensureSpace(20);
      setFont(9, 'bold');
      doc.setFillColor(245, 248, 244);
      doc.rect(margin, y - 10, pageW - margin * 2, 18, 'F');
      doc.setTextColor(43, 78, 60);
      t.headers.forEach((h, i) => doc.text(String(h), margin + 6 + i * colW, y + 2));
      y += 14;
      setFont(9, 'normal');
      doc.setTextColor(40, 50, 42);
      t.rows.forEach(row => {
        ensureSpace(14);
        row.forEach((cell, i) => {
          const wrapped = doc.splitTextToSize(String(cell || ''), colW - 8);
          doc.text(wrapped[0] || '', margin + 6 + i * colW, y);
        });
        y += 13;
      });
    }

    y += 14;
  });

  // Final footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    setFont(8, 'normal');
    doc.setTextColor(160, 165, 160);
    doc.text(`Page ${p} of ${pageCount} · HormonaIQ Patient Report — discuss with provider`, margin, pageH - 24);
  }

  doc.save(opts.filename || 'hormonaiq-report.pdf');
  return doc;
}

// R7 — generate Ora insight from real state (extracted from home.jsx logic for consistency across home + ora screens)
function generateOraInsight(state) {
  const entries = state.entries || {};
  const dates = Object.keys(entries).sort();
  const loggedCount = dates.length;
  const conditions = state.conditions || [];

  if (loggedCount === 0) {
    return {
      tier: 'empty',
      headline: "I'm here when you log your first day.",
      body: "Start with one entry. I'll begin to recognize your pattern after about a week, and show you what I'm seeing.",
      cta: { label: 'Log today', route: 'log' },
    };
  }

  if (loggedCount < 7) {
    return {
      tier: 'early',
      headline: "I'm watching, not concluding yet.",
      body: `${loggedCount} day${loggedCount === 1 ? '' : 's'} logged. Show me about ${7 - loggedCount} more and I'll start showing you patterns.`,
      cta: null,
    };
  }

  // Compute DRSP swing if we have enough data
  const cycleLen = state.cycleLen || 28;
  const phaseAvgs = { F: [], O: [], L: [], M: [] };
  dates.forEach(d => {
    const e = entries[d];
    if (!e || !e.drsp) return;
    const start = new Date(state.lastPeriod || dates[0]);
    const day = Math.max(1, ((Math.floor((new Date(d) - start) / 86400000)) % cycleLen) + 1);
    const phase = phaseForDay(day, cycleLen, { coarse: true });
    const vals = Object.values(e.drsp).filter(v => typeof v === 'number');
    if (vals.length === 0) return;
    const max = Math.max(...vals);
    if (phaseAvgs[phase]) phaseAvgs[phase].push(max);
  });
  const avgOf = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : null;
  const lutealAvg = avgOf(phaseAvgs.L);
  const follAvg = avgOf(phaseAvgs.F);

  if (loggedCount < 30) {
    return {
      tier: 'pattern',
      headline: 'Pattern emerging.',
      body: `${loggedCount} days logged. ${lutealAvg && follAvg ? `Your luteal phase looks ${(lutealAvg / Math.max(follAvg, 0.5)).toFixed(1)}× heavier than your follicular phase so far.` : 'Keep logging — your pattern will sharpen with another cycle.'}`,
      cta: null,
    };
  }

  if (lutealAvg && follAvg && lutealAvg / Math.max(follAvg, 0.5) >= 2) {
    return {
      tier: 'pattern',
      headline: 'Confirmed: classic luteal pattern.',
      body: `Your luteal severity is ${(lutealAvg / Math.max(follAvg, 0.5)).toFixed(1)}× your follicular baseline. ${conditions.includes('PMDD') ? 'This is consistent with PMDD criterion A.' : 'This pattern is worth showing your doctor.'}`,
      cta: { label: 'See chart', route: 'chart' },
    };
  }

  return {
    tier: 'pattern',
    headline: `${loggedCount} days. I'm seeing your shape.`,
    body: lutealAvg && follAvg
      ? `Average luteal severity ${lutealAvg.toFixed(1)}/6, follicular ${follAvg.toFixed(1)}/6. Tap chart to see by day.`
      : 'Keep logging — your full pattern will sharpen as cycles accumulate.',
    cta: { label: 'See chart', route: 'chart' },
  };
}

// R7 polish — shared UI primitives for Round-7 final pass

// TimeBadge — section time estimate (e.g., "Section 2 of 5 · ~2 min")
function TimeBadge({ section, total, minutes }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--mint-mist)', borderRadius: 999, fontSize: 11, color: 'var(--ink-2)' }}>
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--eucalyptus)' }} />
      <span>Section {section}{total ? ` of ${total}` : ''}{minutes ? ` · ~${minutes} min` : ''}</span>
    </div>
  );
}

// SectionProgress — slim progress bar with section labels
function SectionProgress({ current, total, labels }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1,
            height: 3,
            background: i < current ? 'var(--eucalyptus)' : i === current ? 'var(--sage)' : 'var(--mint-mist)',
            borderRadius: 999,
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      {labels && (
        <div className="caption" style={{ fontSize: 11, marginTop: 6 }}>
          {labels[current]}{current < total - 1 ? ` · next: ${labels[current + 1]}` : ''}
        </div>
      )}
    </div>
  );
}

// AbandonResume — detect partial-form abandonment + offer resume on next visit
// Usage: const { saved, restore, clear } = useAbandonResume('ehp30', initialItems)
function useAbandonResume(formId, initial) {
  const key = `hq-resume-${formId}`;
  const [saved, setSaved] = React.useState(() => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const persist = (state) => {
    try { sessionStorage.setItem(key, JSON.stringify({ state, savedAt: Date.now() })); } catch {}
  };
  const clear = () => {
    try { sessionStorage.removeItem(key); } catch {}
    setSaved(null);
  };
  return { saved: saved && saved.state, savedAt: saved && saved.savedAt, persist, clear };
}

// EmptyArt — small SVG illustrations for empty states. Replaces text-only empty states.
function EmptyArt({ kind = 'sprig', size = 80 }) {
  if (kind === 'sprig') {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: 'block' }}>
        <circle cx="40" cy="40" r="36" fill="var(--mint-pale)" opacity="0.5" />
        <path d="M 40 64 Q 40 44 40 18" stroke="var(--eucalyptus)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 40 52 Q 22 50 18 36 Q 36 36 40 52" fill="var(--sage)" opacity="0.85" />
        <path d="M 40 40 Q 58 38 62 24 Q 44 24 40 40" fill="var(--eucalyptus)" opacity="0.7" />
        <circle cx="40" cy="18" r="4" fill="var(--eucalyptus-deep)" />
      </svg>
    );
  }
  if (kind === 'wave') {
    return (
      <svg width={size} height={size * 0.6} viewBox="0 0 80 48" style={{ display: 'block' }}>
        <path d="M 4 24 Q 14 8, 24 24 T 44 24 T 64 24 T 80 24" stroke="var(--eucalyptus)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M 4 32 Q 14 16, 24 32 T 44 32 T 64 32 T 80 32" stroke="var(--sage)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" />
      </svg>
    );
  }
  if (kind === 'circle') {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: 'block' }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--eucalyptus)" strokeWidth="2" strokeDasharray="4 6" opacity="0.7" />
        <circle cx="40" cy="40" r="14" fill="var(--mint-pale)" />
        <circle cx="40" cy="40" r="4" fill="var(--eucalyptus-deep)" />
      </svg>
    );
  }
  if (kind === 'shield') {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: 'block' }}>
        <path d="M 40 12 L 60 22 L 60 44 Q 60 58 40 68 Q 20 58 20 44 L 20 22 Z" fill="var(--mint-pale)" stroke="var(--eucalyptus)" strokeWidth="2" />
        <path d="M 30 40 L 38 48 L 52 32" stroke="var(--eucalyptus-deep)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return null;
}

// ShareInsight — small action row for copying or emailing an insight (replaces screenshot-as-workaround per Iris's Q3 ask)
function ShareInsight({ title, body, label = 'Share' }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    const text = `${title}\n\n${body}\n\n— from HormonaIQ`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }).catch(() => {});
    }
  };
  const handleEmail = () => {
    const subject = encodeURIComponent(title);
    const text = encodeURIComponent(`${body}\n\n— from HormonaIQ`);
    window.location.href = `mailto:?subject=${subject}&body=${text}`;
  };
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(63,111,90,0.12)' }}>
      <button onClick={handleCopy} style={{ background: 'none', border: 'none', color: 'var(--eucalyptus)', fontSize: 12, fontWeight: 500, cursor: 'pointer', padding: 0 }}>
        {copied ? '✓ copied' : `${label} · copy`}
      </button>
      <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>·</span>
      <button onClick={handleEmail} style={{ background: 'none', border: 'none', color: 'var(--eucalyptus)', fontSize: 12, fontWeight: 500, cursor: 'pointer', padding: 0 }}>
        email
      </button>
    </div>
  );
}

// useStaggeredReminders — determines which monthly clinical instrument is "due this week"
// based on staggered cadence (week 1 = ASRS-5, week 2 = ADHD-RS, etc.)
function useStaggeredReminders(state) {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const week = Math.ceil(dayOfMonth / 7);  // 1-5
  const conditions = state.conditions || [];
  const hasAdhd = state.adhd === 'Yes' || conditions.includes('ADHD overlap');
  const hasEndo = conditions.includes('Endometriosis');
  const due = [];
  // Get the most recent log date for an instrument
  const lastLog = (logKey) => {
    const log = state[logKey] || {};
    const dates = Object.keys(log).sort();
    return dates.length ? new Date(dates[dates.length - 1]) : null;
  };
  const daysSince = (d) => d ? Math.floor((today - d) / 86400000) : 999;

  // ADHD weekly schedule (staggered)
  if (hasAdhd) {
    if (week === 1 && daysSince(lastLog('adhdAsrs5Log')) >= 25) due.push({ id: 'asrs5', label: 'ASRS-5 monthly screen', module: 'asrs5', minutes: 2 });
    if (week === 2 && daysSince(lastLog('adhdRsLog')) >= 25) due.push({ id: 'adhdRs', label: 'ADHD-RS monthly severity', module: 'adhdRs', minutes: 5 });
    if (week === 3 && daysSince(lastLog('adhdWfirsLog')) >= 25) due.push({ id: 'wfirs', label: 'WFIRS-S functional impairment', module: 'wfirs', minutes: 8 });
    if (week === 4 && daysSince(lastLog('adhdBrownEfLog')) >= 25) due.push({ id: 'brownEFA', label: 'Brown EF/A monthly profile', module: 'brownEFA', minutes: 5 });
    // GAD-7 bi-weekly
    if ((week === 2 || week === 4) && daysSince(lastLog('adhdGad7Log')) >= 13) due.push({ id: 'gad7', label: 'GAD-7 anxiety screen', module: 'gad7', minutes: 2 });
    // PHQ-9 monthly (always week 1 for ADHD)
    if (week === 1 && daysSince(lastLog('adhdPhq9Log')) >= 25) due.push({ id: 'phq9', label: 'PHQ-9 safety screen', module: 'phq9', minutes: 2 });
    // ISI monthly week 3
    if (week === 3 && daysSince(lastLog('adhdIsiLog')) >= 25) due.push({ id: 'isi', label: 'ISI sleep severity', module: 'isi', minutes: 2 });
    // CAARS-EL monthly week 2
    if (week === 2 && daysSince(lastLog('adhdCaarsLog')) >= 25) due.push({ id: 'caarsEL', label: 'CAARS Emotional Lability', module: 'caarsEL', minutes: 2 });
  }
  // Endo weekly schedule
  if (hasEndo) {
    if (week === 1 && daysSince(lastLog('endoEhp30Log')) >= 25) due.push({ id: 'ehp30', label: 'EHP-30 endo quality of life', module: 'ehp30', minutes: 7 });
    if (week === 2 && daysSince(lastLog('endoBnbLog')) >= 25) due.push({ id: 'bnb', label: 'B&B Scale', module: 'bnb', minutes: 2 });
    // EHP-5 weekly
    if (daysSince(lastLog('endoEhp5Log')) >= 6) due.push({ id: 'ehp5', label: 'EHP-5 weekly check-in', module: 'ehp5', minutes: 1 });
    // PHQ-9 monthly week 1
    if (week === 1 && daysSince(lastLog('endoPhq9Log')) >= 25) due.push({ id: 'phq9', label: 'PHQ-9 safety screen', module: 'phq9', minutes: 2 });
    // GAD-7 bi-weekly
    if ((week === 2 || week === 4) && daysSince(lastLog('endoGad7Log')) >= 13) due.push({ id: 'gad7', label: 'GAD-7 anxiety screen', module: 'gad7', minutes: 2 });
  }
  return due;
}

window.HQ = window.HQ || {};
Object.assign(window.HQ, {
  PHASE_COLORS, PHASE_INK, PHASE_NAMES, PHASE_VIBES,
  phaseForDay, Sprig, Wordmark, Logo, Blob, Leaf, Icon, CycleRing,
  AppCtx, useApp, nextDays, ProgressBar, DRSPChart,
  PhaseLegend, EmptyState,
  // T-93 — custom phase icon set
  PhaseIconFor, LeafSimple, WavyLine,
  // T-84 — Ora feedback footer
  OraFeedback,
  // R7 — PDF + Ora insight helpers
  generatePDF, generateOraInsight,
  // R7 polish — shared primitives for final pass
  TimeBadge, SectionProgress, useAbandonResume, EmptyArt, useStaggeredReminders, ShareInsight,
});
