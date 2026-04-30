// Reusable mini-components and module helpers used by all module sheets
window.useM = React.useState;
const { useState: useM } = React;

// Module header
function MHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>
      <h2 className="display-sm" style={{ marginBottom: 6 }}>
        {title}
      </h2>
      {sub && <p className="body" style={{ color: 'var(--ink-2)', fontSize: 14 }}>{sub}</p>}
    </div>
  );
}

// Stat block
function Stat({ label, value, color, sub }) {
  return (
    <div className="card" style={{ padding: 14, flex: 1 }}>
      <div className="caption" style={{ marginBottom: 4 }}>{label}</div>
      <div className="data" style={{ fontSize: 22, fontWeight: 500, color: color || 'var(--ink)' }}>{value}</div>
      {sub && <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// Severity scale
function Severity({ value, onChange, max = 6 }) {
  return (
    <div className="scale" style={{ gridTemplateColumns: `repeat(${max}, 1fr)` }}>
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button key={n} className={`scale-btn ${value === n ? 'active' : ''}`} onClick={() => onChange(n)}>{n}</button>
      ))}
    </div>
  );
}

// Trend sparkline
function Spark({ data, color = 'var(--eucalyptus)', height = 40 }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const W = 200, H = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * (H - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
      <polyline points={pts} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / (max - min || 1)) * (H - 4) - 2;
        return <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 3 : 1.5} fill={color} />;
      })}
    </svg>
  );
}

// Evidence rating bar
function EvidenceBar({ level }) {
  const map = { Strong: 4, Moderate: 3, Limited: 2, Unsupported: 1 };
  const colors = { Strong: 'var(--eucalyptus)', Moderate: 'var(--severity-mod)', Limited: 'var(--coral)', Unsupported: 'var(--ink-disabled)' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ width: 10, height: 4, borderRadius: 2, background: i <= map[level] ? colors[level] : 'var(--mint-mist)' }} />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 500, color: colors[level] }}>{level}</span>
    </div>
  );
}

// Toggle row
function ToggleRow({ label, checked, onChange, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {sub && <div className="caption" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>}
      </div>
      <div className={`switch ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)} />
    </div>
  );
}

// Section title
function MSection({ title, children, action }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div className="eyebrow">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

window.HQ_UI = { MHeader, Stat, Severity, Spark, EvidenceBar, ToggleRow, MSection };
