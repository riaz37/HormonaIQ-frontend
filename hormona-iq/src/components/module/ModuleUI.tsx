// Reusable mini-components and module helpers used by all module sheets.
// Port of design-handoff/08-implementation-code/src/module-ui.jsx and
// shared primitives from modules-4-endo.jsx / modules-5-adhd.jsx.

import React, { type ReactElement, type ReactNode, useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { useReducedMotion } from 'react-native-reanimated';

import { typography, cards, components as cmp } from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';

// ─────────────────────────────────────────────
// Shared severity helper — mirrors sevColor() in modules-4-endo.jsx
// ─────────────────────────────────────────────

export type Severity0to3 = 0 | 1 | 2 | 3;

export function severityColorForNrs(n: number | null | undefined): string {
  if (n == null || n === 0) return colors.mintMist;
  if (n <= 3) return colors.severityMild;
  if (n <= 6) return colors.severityMod;
  return colors.severitySevere;
}

export function severityColorForLevel(level: Severity0to3): string {
  switch (level) {
    case 0:
      return colors.mintMist;
    case 1:
      return colors.severityMild;
    case 2:
      return colors.severityMod;
    case 3:
      return colors.severitySevere;
  }
}

// ─────────────────────────────────────────────
// MHeader — supports both eyebrow/title/sub variant (legacy)
// and back-button + title/subtitle variant (new).
// ─────────────────────────────────────────────

export interface MHeaderProps {
  title: string;
  /** Subtitle text below title (preferred, new API). */
  subtitle?: string;
  /** Legacy: kept for back-compat with existing callers. */
  sub?: string;
  /** Optional eyebrow shown above title. */
  eyebrow?: string;
  /** When provided, renders a tappable back chevron at the start of the row. */
  onBack?: () => void;
}

export function MHeader({
  title,
  subtitle,
  sub,
  eyebrow,
  onBack,
}: MHeaderProps): ReactElement {
  const sublineText = subtitle ?? sub;

  return (
    <View style={s.mHeaderWrap}>
      {onBack !== undefined && (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={({ pressed }) => [s.backButton, pressed && s.backButtonPressed]}
        >
          <BackChevron />
        </Pressable>
      )}
      {eyebrow !== undefined && (
        <Text style={typography.eyebrow}>{eyebrow}</Text>
      )}
      <Text style={[typography.displaySm, s.mHeaderTitle]}>{title}</Text>
      {sublineText !== undefined && (
        <Text style={[typography.body, s.mHeaderSub]}>{sublineText}</Text>
      )}
    </View>
  );
}

function BackChevron(): ReactElement {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Polyline
        points="12.5,4 6.5,10 12.5,16"
        stroke={colors.eucalyptusDeep}
        strokeWidth={1.75}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// Stat — supports trend arrow (up/down/neutral) and legacy `color`/`sub` props.
// ─────────────────────────────────────────────

export type Trend = 'up' | 'down' | 'neutral';

export interface StatProps {
  label: string;
  value: string | number;
  /** Optional override colour for the value. */
  color?: string;
  /** Caption shown below the value. */
  sub?: string;
  /** Trend indicator drawn beside the value. */
  trend?: Trend;
}

export function Stat({ label, value, color, sub, trend }: StatProps): ReactElement {
  return (
    <View style={[cards.cardPaper, s.statCard]}>
      <Text style={[typography.caption, s.statLabel]}>{label}</Text>
      <View style={s.statValueRow}>
        <Text
          style={[
            s.statValue,
            color !== undefined ? { color } : undefined,
          ]}
        >
          {value}
        </Text>
        {trend !== undefined && <TrendArrow trend={trend} />}
      </View>
      {sub !== undefined && <Text style={s.statSub}>{sub}</Text>}
    </View>
  );
}

function TrendArrow({ trend }: { trend: Trend }): ReactElement {
  const tint =
    trend === 'up'
      ? colors.eucalyptus
      : trend === 'down'
        ? colors.coral
        : colors.ink3;
  // Up: ▲ pointing up means improvement. Down: ▼. Neutral: ─.
  const points =
    trend === 'up'
      ? '2,10 7,3 12,10'
      : trend === 'down'
        ? '2,4 7,11 12,4'
        : '2,7 12,7';
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      accessibilityLabel={`Trend ${trend}`}
    >
      <Polyline
        points={points}
        stroke={tint}
        strokeWidth={1.75}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// Severity — 1..max scale (legacy)
// ─────────────────────────────────────────────

export interface SeverityProps {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}

export function Severity({ value, onChange, max = 6 }: SeverityProps): ReactElement {
  return (
    <View style={s.severityRow}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
        const active = value === n;
        return (
          <Pressable
            key={n}
            style={[cmp.scaleBtn, active && cmp.scaleBtnActive]}
            onPress={() => onChange(n)}
            accessibilityRole="button"
            accessibilityLabel={`Severity ${n} of ${max}`}
            accessibilityState={{ selected: active }}
          >
            <Text style={[cmp.scaleBtnLabel, active && cmp.scaleBtnLabelActive]}>
              {n}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────
// NRS — 0–10 numeric pain picker (port of NRS in modules-4-endo.jsx)
// ─────────────────────────────────────────────

export interface NRSProps {
  value: number | null;
  onChange: (n: number) => void;
  disabled?: boolean;
  /** Optional caption rendered above the row. */
  label?: string;
}

export function NRS({ value, onChange, disabled, label }: NRSProps): ReactElement {
  return (
    <View>
      {label !== undefined && (
        <Text style={[typography.caption, s.nrsLabel]}>{label}</Text>
      )}
      <View style={s.nrsRow}>
        {Array.from({ length: 11 }, (_, n) => {
          const active = value === n;
          const fill = active ? severityColorForNrs(n) : colors.paper;
          const labelColor = active ? colors.paper : colors.ink;
          return (
            <Pressable
              key={n}
              disabled={disabled === true}
              onPress={() => onChange(n)}
              accessibilityRole="button"
              accessibilityLabel={`Pain level ${n} out of 10`}
              accessibilityState={{ selected: active, disabled: disabled === true }}
              style={({ pressed }) => [
                s.nrsCell,
                { backgroundColor: fill },
                pressed && !disabled && s.nrsCellPressed,
                disabled === true && s.nrsCellDisabled,
              ]}
            >
              <Text style={[s.nrsCellLabel, { color: labelColor }]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// ScaleRow — labelled 1–5 severity row with circle dots.
// ─────────────────────────────────────────────

export interface ScaleRowProps {
  value: number | null;
  onChange: (n: number) => void;
  /** Endpoint anchor labels [left, right]. */
  labels?: [string, string];
  /** Number of circles. Defaults to 5. */
  steps?: number;
  /** Optional row title. */
  label?: string;
}

export function ScaleRow({
  value,
  onChange,
  labels,
  steps = 5,
  label,
}: ScaleRowProps): ReactElement {
  return (
    <View style={s.scaleRowWrap}>
      {label !== undefined && (
        <Text style={s.scaleRowTitle}>{label}</Text>
      )}
      <View style={s.scaleRowCircles}>
        {Array.from({ length: steps }, (_, i) => i + 1).map((n) => {
          const active = value === n;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              accessibilityRole="button"
              accessibilityLabel={`Rating ${n} of ${steps}`}
              accessibilityState={{ selected: active }}
              style={s.scaleCircleHit}
            >
              <View style={[s.scaleCircle, active && s.scaleCircleActive]}>
                <Text
                  style={[
                    s.scaleCircleLabel,
                    active && s.scaleCircleLabelActive,
                  ]}
                >
                  {n}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      {labels !== undefined && (
        <View style={s.scaleRowAnchors}>
          <Text style={s.scaleAnchor}>{labels[0]}</Text>
          <Text style={s.scaleAnchor}>{labels[1]}</Text>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Spark — trend sparkline
// ─────────────────────────────────────────────

export interface SparkProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Spark({
  data,
  color = colors.eucalyptus,
  height = 40,
}: SparkProps): ReactElement {
  const W = 200;
  const H = height;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const pts = data
    .map((v, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * W : W / 2;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      accessibilityLabel="Trend sparkline"
    >
      <Polyline
        points={pts}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = data.length > 1 ? (i / (data.length - 1)) * W : W / 2;
        const y = H - ((v - min) / range) * (H - 4) - 2;
        const r = i === data.length - 1 ? 3 : 1.5;
        return <Circle key={i} cx={x} cy={y} r={r} fill={color} />;
      })}
    </Svg>
  );
}

// ─────────────────────────────────────────────
// EvidenceBar — supports legacy capitalised levels and lowercase.
// ─────────────────────────────────────────────

export type EvidenceLevel =
  | 'strong'
  | 'moderate'
  | 'emerging'
  | 'limited'
  | 'Strong'
  | 'Moderate'
  | 'Limited'
  | 'Unsupported';

export interface EvidenceBarProps {
  level: EvidenceLevel;
}

interface EvidenceMeta {
  fill: number;
  color: string;
  label: string;
}

const EVIDENCE_META: Record<EvidenceLevel, EvidenceMeta> = {
  strong: { fill: 4, color: colors.eucalyptus, label: 'Strong' },
  moderate: { fill: 3, color: colors.severityMod, label: 'Moderate' },
  emerging: { fill: 2, color: colors.butterDeep, label: 'Emerging' },
  limited: { fill: 1, color: colors.coral, label: 'Limited' },
  Strong: { fill: 4, color: colors.eucalyptus, label: 'Strong' },
  Moderate: { fill: 3, color: colors.severityMod, label: 'Moderate' },
  Limited: { fill: 2, color: colors.coral, label: 'Limited' },
  Unsupported: { fill: 1, color: colors.inkDisabled, label: 'Unsupported' },
};

export function EvidenceBar({ level }: EvidenceBarProps): ReactElement {
  const meta = EVIDENCE_META[level];

  return (
    <View
      style={s.evidenceWrap}
      accessibilityLabel={`Evidence level: ${meta.label}`}
    >
      <View style={s.evidencePips}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              s.evidencePip,
              { backgroundColor: i <= meta.fill ? meta.color : colors.mintMist },
            ]}
          />
        ))}
      </View>
      <Text style={[s.evidenceLabel, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// ToggleRow
// ─────────────────────────────────────────────

export interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  sub?: string;
}

export function ToggleRow({ label, checked, onChange, sub }: ToggleRowProps): ReactElement {
  return (
    <View style={s.toggleRow}>
      <View style={s.toggleTextWrap}>
        <Text style={s.toggleLabel}>{label}</Text>
        {sub !== undefined && (
          <Text style={[typography.caption, s.toggleSub]}>{sub}</Text>
        )}
      </View>
      <Pressable
        style={[s.switchTrack, checked && s.switchTrackOn]}
        onPress={() => onChange(!checked)}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={[s.switchThumb, checked && s.switchThumbOn]} />
      </Pressable>
    </View>
  );
}

// ─────────────────────────────────────────────
// MSection — title bar + optional collapse toggle
// ─────────────────────────────────────────────

export interface MSectionProps {
  title: string;
  children: ReactNode;
  /** Optional trailing action node (legacy). */
  action?: ReactNode;
  /** When true, the section can be collapsed via a chevron toggle. */
  collapsible?: boolean;
  /** Initial collapsed state when `collapsible`. */
  defaultCollapsed?: boolean;
  /** Optional content container override. */
  contentStyle?: ViewStyle;
}

export function MSection({
  title,
  children,
  action,
  collapsible = false,
  defaultCollapsed = false,
  contentStyle,
}: MSectionProps): ReactElement {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const reduceMotion = useReducedMotion();

  // Reduced-motion aware: we just toggle visibility — no animation either way.
  // Collapsed visual state is the absence of children — no height animation
  // (RN doesn't animate height cheaply; transform/opacity only per spec).
  void reduceMotion;

  const onToggle = useCallback(() => setCollapsed((c) => !c), []);

  const headerInner = (
    <View style={s.sectionHeader}>
      <Text style={typography.eyebrow}>{title}</Text>
      <View style={s.sectionHeaderTrailing}>
        {action}
        {collapsible && <Chevron expanded={!collapsed} />}
      </View>
    </View>
  );

  return (
    <View style={s.sectionWrap}>
      {collapsible ? (
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={`${title}, ${collapsed ? 'expand' : 'collapse'} section`}
          accessibilityState={{ expanded: !collapsed }}
          hitSlop={spacing.sm}
        >
          {headerInner}
        </Pressable>
      ) : (
        headerInner
      )}
      {!collapsed && <View style={contentStyle}>{children}</View>}
    </View>
  );
}

function Chevron({ expanded }: { expanded: boolean }): ReactElement {
  const points = expanded ? '4,7 9,12 14,7' : '7,4 12,9 7,14';
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Polyline
        points={points}
        stroke={colors.ink2}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// Checklist — checkable list with controlled or uncontrolled state.
// ─────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface ChecklistProps {
  items: ChecklistItem[];
  /** Controlled checked ids. */
  checked?: string[];
  /** Initial checked ids when uncontrolled. */
  defaultChecked?: string[];
  onChange?: (checked: string[]) => void;
}

export function Checklist({
  items,
  checked,
  defaultChecked,
  onChange,
}: ChecklistProps): ReactElement {
  const [local, setLocal] = useState<string[]>(defaultChecked ?? []);
  const value = checked ?? local;
  const valueSet = useMemo(() => new Set(value), [value]);

  const toggle = useCallback(
    (id: string) => {
      const next = valueSet.has(id)
        ? value.filter((x) => x !== id)
        : [...value, id];
      if (checked === undefined) setLocal(next);
      onChange?.(next);
    },
    [checked, onChange, value, valueSet],
  );

  return (
    <View style={s.checklistWrap}>
      {items.map((item) => {
        const isChecked = valueSet.has(item.id);
        return (
          <Pressable
            key={item.id}
            onPress={() => toggle(item.id)}
            accessibilityRole="checkbox"
            accessibilityLabel={item.label}
            accessibilityState={{ checked: isChecked }}
            style={({ pressed }) => [
              s.checklistRow,
              pressed && s.checklistRowPressed,
            ]}
          >
            <View style={[s.checkbox, isChecked && s.checkboxChecked]}>
              {isChecked && <CheckGlyph />}
            </View>
            <Text style={s.checklistLabel}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function CheckGlyph(): ReactElement {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14">
      <Polyline
        points="2.5,7 6,10 11.5,4"
        stroke={colors.paper}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  // MHeader
  mHeaderWrap: {
    marginBottom: spacing.md,
    paddingLeft: 0,
  },
  mHeaderTitle: {
    marginBottom: spacing.xs,
    marginTop: 6,
  },
  mHeaderSub: {
    color: colors.ink2,
    fontSize: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    marginBottom: spacing.xs,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  backButtonPressed: {
    backgroundColor: colors.mintPale,
  },

  // Stat
  statCard: {
    padding: 16,
    flex: 1,
  },
  statLabel: {
    marginBottom: spacing.xs,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontFamily: fonts.monoMedium,
    fontSize: 22,
    color: colors.ink,
  },
  statSub: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    marginTop: 2,
  },

  // Severity
  severityRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },

  // NRS
  nrsLabel: {
    marginBottom: 6,
  },
  nrsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  nrsCell: {
    flex: 1,
    minHeight: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nrsCellPressed: {
    opacity: 0.85,
  },
  nrsCellDisabled: {
    opacity: 0.4,
  },
  nrsCellLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
  },

  // ScaleRow
  scaleRowWrap: {
    marginBottom: spacing.md,
  },
  scaleRowTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  scaleRowCircles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  scaleCircleHit: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleCircleActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  scaleCircleLabel: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink2,
  },
  scaleCircleLabelActive: {
    color: colors.paper,
  },
  scaleRowAnchors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  scaleAnchor: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    flexShrink: 1,
    maxWidth: '45%',
  },

  // EvidenceBar
  evidenceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  evidencePips: {
    flexDirection: 'row',
    gap: 2,
  },
  evidencePip: {
    width: 10,
    height: 4,
    borderRadius: 2,
  },
  evidenceLabel: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
  },

  // ToggleRow
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 44,
  },
  toggleTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  toggleLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
  },
  toggleSub: {
    fontSize: 12,
    marginTop: 2,
  },
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchTrackOn: {
    backgroundColor: colors.eucalyptus,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },

  // MSection
  sectionWrap: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  sectionHeaderTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  // Checklist
  checklistWrap: {
    gap: 2,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    minHeight: 44,
  },
  checklistRowPressed: {
    opacity: 0.7,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  checklistLabel: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },
});
