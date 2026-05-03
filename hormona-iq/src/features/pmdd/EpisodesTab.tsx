// ─────────────────────────────────────────────────────────────────────────────
// EpisodesTab — F38 · MOOD EPISODES
// Tab id: 'rage'
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { buttons, cards, typography } from '../../constants/styles';
import { colors, fonts, radius } from '../../constants/tokens';
import { Chip, MHeader, MSection, SeverityScale } from './primitives';
import { formatEpisodeTime } from './types';
import type { PMDDState, RageEpisode } from './types';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const EPISODE_TYPES = ['Rage', 'Crying', 'Dissociation', 'Panic', 'Numbness'];

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface EpisodesTabProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function EpisodesTab({ state, setState }: EpisodesTabProps) {
  const [intensity, setIntensity] = useState(0);
  const [type, setType] = useState<string | null>(null);
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const episodes = state.rageEpisodes;
  const recent = episodes.slice(0, 5);

  const save = useCallback(() => {
    if (!type || !intensity) return;
    const evt: RageEpisode = {
      at: Date.now(),
      type,
      intensity,
      duration: duration || null,
      note: note || null,
    };
    setState((prev) => ({
      ...prev,
      rageEpisodes: [evt, ...prev.rageEpisodes].slice(0, 200),
    }));
    setIntensity(0);
    setType(null);
    setDuration('');
    setNote('');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }, [type, intensity, duration, note, setState]);

  const canSave = !!type && intensity > 0;

  return (
    <View>
      <MHeader
        eyebrow="F38 · MOOD EPISODES"
        title="One-tap "
        titleAccent="capture."
        sub="No judgement. Just data for your DRSP."
      />
      <MSection title="WHAT'S HAPPENING">
        <View style={s.chipRow}>
          {EPISODE_TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              active={type === t}
              onPress={() => setType(t)}
              accessibilityLabel={`Select episode type: ${t}`}
            />
          ))}
        </View>
      </MSection>
      <MSection title="INTENSITY 1–5">
        <SeverityScale
          value={intensity}
          onChange={setIntensity}
          max={5}
          accessibilityHint="Rate the intensity of this episode"
        />
      </MSection>
      <MSection title="DURATION (OPTIONAL)">
        <TextInput
          style={s.textInput}
          placeholder="e.g. 22 min"
          value={duration}
          onChangeText={setDuration}
          placeholderTextColor={colors.inkDisabled}
          accessibilityLabel="Episode duration, optional"
        />
      </MSection>
      <MSection title="WHAT TRIGGERED IT (OPTIONAL)">
        <TextInput
          style={s.textInput}
          placeholder="e.g. Snapped over dishes"
          value={note}
          onChangeText={setNote}
          placeholderTextColor={colors.inkDisabled}
          accessibilityLabel="What triggered this episode, optional"
        />
      </MSection>
      <TouchableOpacity
        style={[
          buttons.primary,
          s.fullWidth,
          { marginBottom: 18 },
          !canSave && { opacity: 0.5 },
        ]}
        onPress={save}
        disabled={!canSave}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          savedFlash ? 'Episode saved' : 'Save episode — takes about 3 seconds'
        }
        accessibilityState={{ disabled: !canSave }}
      >
        <Text style={buttons.primaryLabel}>
          {savedFlash ? '✓ Saved' : 'Save · 3 sec'}
        </Text>
      </TouchableOpacity>
      <MSection title={recent.length ? 'RECENT EPISODES' : 'NO EPISODES YET'}>
        {recent.length === 0 && (
          <Text style={[typography.caption, { fontSize: 12 }]}>
            Saved episodes appear here for cycle-by-cycle DRSP context.
          </Text>
        )}
        {recent.map((r, i) => (
          <View key={i} style={[cards.card, s.episodeCard]}>
            <View style={s.episodeHeader}>
              <Text style={s.episodeType}>
                {r.type} · {r.intensity}/5
              </Text>
              {r.duration && (
                <Text style={[typography.caption, { fontSize: 11 }]}>
                  {r.duration}
                </Text>
              )}
            </View>
            <Text style={[typography.caption, { fontSize: 12, marginBottom: 2 }]}>
              {formatEpisodeTime(r.at)}
            </Text>
            {r.note && (
              <Text style={s.episodeNote}>"{r.note}"</Text>
            )}
          </View>
        ))}
      </MSection>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink,
    backgroundColor: colors.paper,
    width: '100%',
  },
  episodeCard: {
    padding: 12,
    marginBottom: 6,
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  episodeType: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
  },
  episodeNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.ink2,
  },
});
