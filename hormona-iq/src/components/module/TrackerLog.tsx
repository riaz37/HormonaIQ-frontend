// TrackerLog — "Log entry" button + scrollable history list with timestamps.
// Pattern derived from the various daily-log surfaces in
// design-handoff/08-implementation-code/src/modules-4-endo.jsx.

import React, { type ReactElement } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import { buttons } from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface TrackerLogEntry {
  id: string;
  timestamp: Date;
  label: string;
  /** Optional secondary line (e.g. value, severity, note). */
  detail?: string;
}

export interface TrackerLogProps {
  entries: TrackerLogEntry[];
  onAdd: () => void;
  /** Custom label for the add button. Defaults to "Log entry". */
  addLabel?: string;
  /** Empty-state message. */
  emptyLabel?: string;
  /** Max visible height before scrolling. */
  maxHistoryHeight?: number;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatTimestamp(d: Date): string {
  // Stable, locale-aware "Mon 12 May, 9:14 AM" style.
  const datePart = d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const timePart = d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${datePart} · ${timePart}`;
}

function sortByRecencyDesc(entries: TrackerLogEntry[]): TrackerLogEntry[] {
  return [...entries].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function TrackerLog({
  entries,
  onAdd,
  addLabel = 'Log entry',
  emptyLabel = 'No entries yet — your history will appear here.',
  maxHistoryHeight = 280,
}: TrackerLogProps): ReactElement {
  const sorted = sortByRecencyDesc(entries);

  return (
    <View>
      <Pressable
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel={addLabel}
        style={({ pressed }) => [buttons.primary, pressed && styles.btnPressed]}
      >
        <PlusGlyph />
        <Text style={buttons.primaryLabel}>{addLabel}</Text>
      </Pressable>

      {sorted.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyLabel}>{emptyLabel}</Text>
        </View>
      ) : (
        <ScrollView
          style={[styles.historyScroll, { maxHeight: maxHistoryHeight }]}
          contentContainerStyle={styles.historyContent}
          showsVerticalScrollIndicator={false}
        >
          {sorted.map((entry, idx) => (
            <View
              key={entry.id}
              style={[styles.row, idx === 0 && styles.rowFirst]}
              accessibilityLabel={`${entry.label}, ${formatTimestamp(entry.timestamp)}`}
            >
              <View style={styles.timestampCol}>
                <Text style={styles.timestampLine}>
                  {formatTimestamp(entry.timestamp)}
                </Text>
              </View>
              <View style={styles.bodyCol}>
                <Text style={styles.entryLabel} numberOfLines={2}>
                  {entry.label}
                </Text>
                {entry.detail !== undefined && (
                  <Text style={styles.entryDetail} numberOfLines={2}>
                    {entry.detail}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function PlusGlyph(): ReactElement {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Polyline
        points="8,2 8,14"
        stroke={colors.paper}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <Polyline
        points="2,8 14,8"
        stroke={colors.paper}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  btnPressed: {
    opacity: 0.9,
  },
  emptyWrap: {
    marginTop: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    alignItems: 'center',
  },
  emptyLabel: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink3,
    textAlign: 'center',
    lineHeight: 18,
  },
  historyScroll: {
    marginTop: spacing.md,
  },
  historyContent: {
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  timestampCol: {
    width: 110,
    paddingTop: 2,
  },
  timestampLine: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink3,
    lineHeight: 14,
  },
  bodyCol: {
    flex: 1,
  },
  entryLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 19,
  },
  entryDetail: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink2,
    lineHeight: 16,
    marginTop: 2,
  },
});
