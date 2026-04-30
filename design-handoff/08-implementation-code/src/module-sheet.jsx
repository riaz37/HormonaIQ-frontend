// ModuleSheet — bottom sheet that renders any feature module
// Wave 4 T-65 — header simplified: grab-handle, no X, module ID as tooltip, swipe-down to dismiss
function ModuleSheet({ id, onClose }) {
  const { Icon, useApp, DRSPChart, ProgressBar, PHASE_COLORS } = window.HQ;
  const { state } = useApp();

  const M = window.HQ_MODULES || {};
  const node = M[id] ? M[id]({ state, Icon, DRSPChart, ProgressBar, PHASE_COLORS }) : <Fallback id={id} />;

  // T-65 — track touch for swipe-down-to-dismiss (Δy > 80px in <300ms)
  const touchRef = React.useRef(null);
  const onTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchRef.current = { y: e.touches[0].clientY, t: Date.now() };
    }
  };
  const onTouchEnd = (e) => {
    const start = touchRef.current;
    if (!start) return;
    const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : start.y;
    const dy = endY - start.y;
    const dt = Date.now() - start.t;
    if (dy > 80 && dt < 300) onClose();
    touchRef.current = null;
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ alignItems: 'flex-end', padding: 0 }}>
      <div className="modal" onClick={e => e.stopPropagation()}
        style={{ borderRadius: '28px 28px 0 0', maxWidth: 440, maxHeight: '88vh', overflowY: 'auto', padding: 0, animation: 'fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div
          title={`${id} — for engineers`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            position: 'sticky', top: 0,
            background: 'var(--surface)',
            padding: '16px 22px 8px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 5,
            borderRadius: '28px 28px 0 0',
            minHeight: 24,
          }}>
          {/* T-65 — grab handle floating 8px above the title row */}
          <div style={{
            width: 38, height: 4, background: 'var(--border-strong)',
            borderRadius: 999, position: 'absolute', left: '50%', top: 8,
            transform: 'translateX(-50%)',
          }} />
        </div>
        <div style={{ padding: '8px 22px 28px' }}>{node}</div>
      </div>
    </div>
  );
}

function Fallback({ id }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>MODULE</div>
      <h2 className="display-sm" style={{ marginBottom: 10 }}>{id}</h2>
      <p className="body">This module is in your build. Detailed UI coming online.</p>
    </div>
  );
}

window.ModuleSheet = ModuleSheet;
