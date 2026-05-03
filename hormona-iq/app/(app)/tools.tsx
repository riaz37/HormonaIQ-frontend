// Tools — comprehensive 56-feature directory, condition-grouped.
// Port of design-handoff/08-implementation-code/src/tools.jsx
// Wave 4 T-47 — phase-tinted group panels, F-code labels, collapse/expand groups, search.

import { useState, useMemo } from 'react';
import type { ReactElement } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import Svg, { Path, Rect, Circle, Ellipse, Line } from 'react-native-svg';

import {
  cards,
  components as cmp,
  layout,
  typography,
} from '../../src/constants/styles';
import { colors, fonts, radius, spacing } from '../../src/constants/tokens';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface AppState {
  conditions: string[];
  adhd: string | null;
  primaryCondition: string | null;
  ed_safe_mode: string | null;
  featureFlags?: {
    weightTracker?: boolean;
  };
}

const INITIAL_STATE: AppState = {
  conditions: ['PMDD'],
  adhd: null,
  primaryCondition: null,
  ed_safe_mode: null,
  featureFlags: {},
};

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
};

type ToolItem = {
  id: string;
  name: string;
  desc: string;
  I: (props: IconProps) => ReactElement;
  featured?: boolean;
  go: () => void;
};

type GroupPanel =
  | 'group-mint-warm'
  | 'group-sage'
  | 'group-blush'
  | 'group-butter'
  | 'group-cream';

type ToolGroup = {
  id: string;
  label: string;
  show: boolean;
  panel: GroupPanel;
  titleIcon: (props: IconProps) => ReactElement;
  items: ToolItem[];
};

// ─────────────────────────────────────────────
// Inline SVG icon components — Phosphor-style
// ─────────────────────────────────────────────

function IconHome({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconPlus({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function IconCalendar({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={16} rx={2} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 9h18M8 3v4M16 3v4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconActivity({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12h4l3-7 4 14 3-7h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconSparkle({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z" opacity={0.95} />
      <Circle cx={19} cy={18} r={1.4} />
      <Circle cx={5} cy={19} r={1} />
    </Svg>
  );
}
function IconEye({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}
function IconWave({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 16" fill="none">
      <Path d="M2 8 Q 8 2, 14 8 T 26 8 T 38 8 T 50 8 T 62 8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
function IconSun({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}
function IconHeart({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 21s-7-4.5-9.5-9.5C0.5 7 4 3 8 5c1.5 0.7 2.7 2 4 4 1.3-2 2.5-3.3 4-4 4-2 7.5 2 5.5 6.5C19 16.5 12 21 12 21z" />
    </Svg>
  );
}
function IconBars({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20V12M10 20V8M16 20V14M22 20V4" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}
function IconDownload({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4v12M7 11l5 5 5-5M5 20h14" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconCompass({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 9l-2 5-5 2 2-5z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconAnchor({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={5} r={2} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 7v15M5 14a7 7 0 0 0 14 0M3 14h4M17 14h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconPill({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={9} width={20} height={6} rx={3} transform="rotate(-30 12 12)" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconBolt({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconUsers({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={8} r={3} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M21 20c0-2.5-1.5-4.5-4-5.4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconClipboard({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x={6} y={4} width={12} height={17} rx={2} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={9} y={2} width={6} height={4} rx={1} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconTag({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12L12 4H4v8l8 8 8-8z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={8} cy={8} r={1.4} fill={color} />
    </Svg>
  );
}
function IconDatabase({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Ellipse cx={12} cy={5} rx={8} ry={3} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconDrop({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3s7 7 7 12a7 7 0 1 1-14 0c0-5 7-12 7-12z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconHeartbeat({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12h4l2-5 4 10 2-5h6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconBell({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 21a2 2 0 0 0 4 0" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconSpiral({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 12a3 3 0 1 0 3 3 5 5 0 0 0-5-5 7 7 0 0 0-7 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconTestTube({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M9 3v13a3 3 0 0 0 6 0V3M8 3h8M9 12h6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconSwap({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 8h14l-3-3M21 16H7l3 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconHourglass({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M6 3h12M6 21h12M7 3v3a5 5 0 0 0 10 0V3M7 21v-3a5 5 0 0 1 10 0v3" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconMicroscope({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M6 18h12M9 18v-3a4 4 0 0 1 4-4M11 11V6h3v5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={13} cy={14} r={3} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconFlask({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M9 3h6M10 3v6L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconBrain({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M8 4a3 3 0 0 0-3 3v2a3 3 0 0 0-2 3 3 3 0 0 0 2 3v2a3 3 0 0 0 3 3h2V4H8zM16 4a3 3 0 0 1 3 3v2a3 3 0 0 1 2 3 3 3 0 0 1-2 3v2a3 3 0 0 1-3 3h-2V4h2z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconMoon({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconFlame({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3s5 5 5 10a5 5 0 0 1-10 0c0-3 2-5 2-7 1 1 3 2 3-3z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconPulse({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12h3l2-3 4 6 2-3h7" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconStack({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 17l9 4 9-4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconLock({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={10} width={16} height={11} rx={2} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconMic({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x={9} y={3} width={6} height={12} rx={3} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconFolder({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconCycle({ width = 20, height = 20, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconChevDown({ width = 16, height = 16, color = 'currentColor' }: IconProps): ReactElement {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// Panel background colors per group-panel class
// ─────────────────────────────────────────────

const PANEL_BG: Record<GroupPanel, string> = {
  'group-mint-warm': colors.mintPale,
  'group-sage': '#EEF4EE',
  'group-blush': '#FAF0EE',
  'group-butter': '#FBF6E9',
  'group-cream': colors.cream,
};

// ─────────────────────────────────────────────
// CollapsibleGroup — animated chevron header
// ─────────────────────────────────────────────

interface CollapsibleGroupProps {
  group: ToolGroup;
  isOpen: boolean;
  filteredItems: ToolItem[];
  query: string;
  reduceMotion: boolean;
  onToggle: () => void;
}

function CollapsibleGroup({
  group,
  isOpen,
  filteredItems,
  query,
  reduceMotion,
  onToggle,
}: CollapsibleGroupProps): ReactElement {
  const rotation = useSharedValue(isOpen ? 0 : -90);

  const animatedChevron = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleToggle = (): void => {
    if (!reduceMotion) {
      rotation.value = withTiming(isOpen ? -90 : 0, { duration: 200 });
    } else {
      rotation.value = isOpen ? -90 : 0;
    }
    onToggle();
  };

  const TI = group.titleIcon;
  const bgColor = PANEL_BG[group.panel];

  return (
    <View style={[s.groupPanel, { backgroundColor: bgColor }]}>
      <TouchableOpacity
        onPress={handleToggle}
        {...(Platform.OS === 'web' ? { onClick: handleToggle } : {})}
        accessibilityLabel={`${isOpen ? 'Collapse' : 'Expand'} ${group.label} group`}
        accessibilityRole="button"
        style={[s.groupHeader, { marginBottom: isOpen ? spacing.md : 0 }]}
        activeOpacity={0.7}
      >
        <TI width={16} height={16} color={colors.eucalyptusDeep} />
        <Text style={[typography.eyebrow, s.groupLabel]}>
          {group.label.toUpperCase()} · {filteredItems.length}
          {filteredItems.length !== group.items.length ? ` of ${group.items.length}` : ''}
        </Text>
        <Animated.View style={animatedChevron}>
          <IconChevDown width={16} height={16} color={colors.ink3} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <View style={s.tileGrid}>
          {filteredItems.map((item, index) => (
            <ToolTile
              key={item.id}
              item={item}
              groupId={group.id}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// ToolTile — individual feature card
// ─────────────────────────────────────────────

interface ToolTileProps {
  item: ToolItem;
  groupId: string;
  index: number;
  reduceMotion: boolean;
}

function ToolTile({ item, groupId, index, reduceMotion }: ToolTileProps): ReactElement {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 12);

  // Stagger fade-up on mount
  useState(() => {
    if (!reduceMotion) {
      const delay = Math.min(60 + index * 40, 300);
      const timer = setTimeout(() => {
        opacity.value = withTiming(1, { duration: 280 });
        translateY.value = withTiming(0, { duration: 280 });
      }, delay);
      return () => clearTimeout(timer);
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const isMintCard = item.featured && (groupId === 'pmdd' || groupId === 'core');
  const cardStyle = isMintCard ? cards.cardMint : cards.cardWarm;
  const TileIcon = item.I;

  return (
    <Animated.View style={[s.tileWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={item.go}
        {...(Platform.OS === 'web' ? { onClick: item.go } : {})}
        accessibilityLabel={`${item.name}: ${item.desc}`}
        accessibilityRole="button"
        style={[cardStyle, s.tile]}
        activeOpacity={0.75}
      >
        <View style={s.tileIconBg}>
          <TileIcon width={20} height={20} color={colors.eucalyptusDeep} />
        </View>
        <View style={s.tileTextBlock}>
          <Text style={s.tileName}>{item.name}</Text>
          <Text style={[typography.caption, s.tileDesc]}>{item.desc}</Text>
        </View>
        <Text style={s.tileCode}>{item.id}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// ToolsScreen
// ─────────────────────────────────────────────

export default function ToolsScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion() ?? false;

  const [state] = useState<AppState>(INITIAL_STATE);
  const [filter, setFilter] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const conditions = state.conditions ?? [];
  const hasPMDD = conditions.includes('PMDD');
  const hasPCOS = conditions.includes('PCOS');
  const hasPeri = conditions.includes('Perimenopause');
  const hasEndo = conditions.includes('Endometriosis');
  const hasADHD =
    state.adhd === 'Yes' ||
    state.adhd === 'I think so' ||
    conditions.includes('ADHD overlap');

  // ── Group catalog ──────────────────────────────────────────────────────────

  const groups: ToolGroup[] = useMemo(() => [
    {
      id: 'core',
      label: 'Core',
      show: true,
      panel: 'group-mint-warm',
      titleIcon: IconSparkle,
      items: [
        { id: 'F1', name: 'Today hub', desc: 'Phase-aware home', I: IconHome, featured: true, go: () => router.push('/(app)/home') },
        { id: 'F2', name: '30-second log', desc: 'Daily DRSP capture', I: IconPlus, go: () => router.push('/(app)/log') },
        { id: 'F3', name: 'Cycle calendar', desc: 'Ring view', I: IconCalendar, go: () => router.push('/(app)/cycle') },
        { id: 'F8', name: 'Insights', desc: 'Charts & patterns', I: IconActivity, go: () => router.push('/(app)/insights') },
        { id: 'F20', name: 'Ora', desc: 'AI companion', I: IconSparkle, go: () => router.push('/(app)/ora') },
        { id: 'F7', name: 'Phase education', desc: "What's happening today", I: IconEye, go: () => router.push('/(app)/modules/phaseEd') },
        { id: 'F11', name: 'Pattern engine', desc: 'After 2 cycles', I: IconWave, go: () => router.push('/(app)/modules/patterns') },
        { id: 'F29', name: 'Energy forecast', desc: 'Tomorrow at a glance', I: IconSun, go: () => router.push('/(app)/modules/energy') },
      ],
    },
    {
      id: 'pmdd',
      label: 'PMDD',
      show: hasPMDD,
      panel: 'group-sage',
      titleIcon: IconHeart,
      items: [
        { id: 'F4', name: 'DRSP tracker', desc: '11-domain daily', I: IconBars, featured: true, go: () => router.push('/(app)/log') },
        { id: 'F9', name: 'PMDD log summary', desc: '2-cycle physician report', I: IconDownload, go: () => router.push('/(app)/modules/pmddPDF') },
        { id: 'F19', name: 'Support', desc: '3 tiers, calm by default', I: IconHeart, go: () => router.push('/(app)/modules/crisis') },
        { id: 'F34', name: 'Luteal predictor', desc: 'With confidence interval', I: IconCompass, go: () => router.push('/(app)/modules/lutealPred') },
        { id: 'F35', name: 'Safety plan', desc: "Built when you're well", I: IconAnchor, go: () => router.push('/(app)/modules/safetyPlan') },
        { id: 'F36', name: 'SSRI luteal dosing', desc: 'Adherence × DRSP', I: IconPill, go: () => router.push('/(app)/modules/ssri') },
        { id: 'F37', name: 'Supplements', desc: 'With evidence ratings', I: IconSparkle, go: () => router.push('/(app)/modules/supps') },
        { id: 'F38', name: 'Rage / mood episodes', desc: 'One-tap capture', I: IconBolt, go: () => router.push('/(app)/modules/rage') },
        { id: 'F39', name: 'Relationship impact', desc: 'For Criterion B', I: IconUsers, go: () => router.push('/(app)/modules/relImpact') },
        { id: 'F40', name: 'Work / academic impact', desc: 'For accommodations', I: IconClipboard, go: () => router.push('/(app)/modules/workImpact') },
        { id: 'F41', name: 'Trigger correlation', desc: 'Sleep, stress, alcohol…', I: IconTag, go: () => router.push('/(app)/modules/triggers') },
        { id: 'F42', name: 'Phase-matched community', desc: 'Anonymous, no profiles', I: IconUsers, go: () => router.push('/(app)/modules/community') },
      ],
    },
    {
      id: 'pcos',
      label: 'PCOS',
      show: hasPCOS,
      panel: 'group-blush',
      titleIcon: IconFlask,
      items: [
        { id: 'F12', name: 'Lab value vault', desc: 'Testosterone, AMH, more', I: IconDatabase, featured: true, go: () => router.push('/(app)/modules/labVault') },
        { id: 'F18', name: 'Androgen tracker', desc: 'Acne, hirsutism, hair', I: IconDrop, go: () => router.push('/(app)/modules/androgen') },
        { id: 'F28', name: 'Metabolic snapshot', desc: 'Daily proxy markers · post-meal energy / cravings', I: IconHeartbeat, go: () => router.push('/(app)/modules/metabolicSnap') },
        { id: 'F43', name: 'HOMA-IR calculator', desc: 'Insulin resistance score', I: IconSparkle, go: () => router.push('/(app)/modules/homaIR') },
        { id: 'F44', name: 'PCOS medications', desc: 'Metformin, spiro…', I: IconPill, go: () => router.push('/(app)/modules/pcosMed') },
        { id: 'F45', name: 'Endometrial flag', desc: 'Amenorrhea risk monitor', I: IconBell, go: () => router.push('/(app)/modules/endoFlag') },
        { id: 'F46', name: 'Hair shedding', desc: 'Strand count + Ludwig', I: IconWave, go: () => router.push('/(app)/modules/hair') },
        { id: 'F47', name: 'Ovulation detection', desc: 'OPK, BBT, PdG', I: IconSpiral, go: () => router.push('/(app)/modules/ovulation') },
        { id: 'F48', name: 'Inositol protocol', desc: '40:1 myo + DCI', I: IconTestTube, go: () => router.push('/(app)/modules/inositol') },
        ...(state.featureFlags?.weightTracker
          ? [{ id: 'F49', name: 'Weight (non-punitive)', desc: 'Metabolic trend only', I: IconActivity, go: () => router.push('/(app)/modules/weight') }]
          : []),
        { id: 'F50', name: 'Treatment compare', desc: '3 months vs now', I: IconSwap, go: () => router.push('/(app)/modules/txCompare') },
        { id: 'F51', name: 'Doctor prep', desc: 'Phenotype-tailored', I: IconClipboard, go: () => router.push('/(app)/modules/docPrep') },
        { id: 'F52', name: 'Fertility mode', desc: 'TTC tracking', I: IconHeart, go: () => router.push('/(app)/modules/fertility') },
        { id: 'F53', name: 'Metabolic syndrome', desc: '5-criteria status', I: IconHeartbeat, go: () => router.push('/(app)/modules/metaSyn') },
        { id: 'F54', name: 'Phenotype helper', desc: 'A / B / C / D', I: IconTag, go: () => router.push('/(app)/modules/phenotype') },
        { id: 'F55', name: 'Ultrasound vault', desc: 'AFC, ovarian volume', I: IconMicroscope, go: () => router.push('/(app)/modules/ultrasound') },
        { id: 'F56', name: 'Annual review', desc: '9 monitoring standards', I: IconHourglass, go: () => router.push('/(app)/modules/annual') },
      ],
    },
    {
      id: 'peri',
      label: 'Perimenopause',
      show: hasPeri,
      panel: 'group-butter',
      titleIcon: IconSun,
      items: [
        { id: 'F16', name: 'Hot flash logger', desc: 'With CV risk pattern', I: IconFlame, featured: true, go: () => router.push('/(app)/modules/hotFlash') },
        { id: 'F17', name: 'HRT effectiveness', desc: 'Before / after', I: IconSwap, go: () => router.push('/(app)/modules/hrt') },
        { id: 'F22', name: 'Stage identifier', desc: 'STRAW+10', I: IconCompass, go: () => router.push('/(app)/modules/straw') },
        { id: 'F25', name: 'Greene scale', desc: '21-item weekly', I: IconClipboard, go: () => router.push('/(app)/modules/greene') },
        { id: 'F26', name: 'GSM tracker', desc: 'Genitourinary, discreet', I: IconDrop, go: () => router.push('/(app)/modules/gsm') },
        { id: 'F27', name: 'Brain fog', desc: 'EMQ-R adapted', I: IconBrain, go: () => router.push('/(app)/modules/brainFog') },
        { id: 'F65', name: 'DEXA bone density', desc: 'T-score + FRAX trend', I: IconDatabase, go: () => router.push('/(app)/modules/dexa') },
        { id: 'F66', name: 'Blood pressure', desc: 'BP + pulse log', I: IconHeartbeat, go: () => router.push('/(app)/modules/bp') },
        { id: 'F71', name: 'Non-HRT treatments', desc: 'SSRI, gabapentin, more', I: IconPill, go: () => router.push('/(app)/modules/periNonHrt') },
        { id: 'F78', name: 'Cardiovascular risk', desc: 'BP × lipids × Framingham', I: IconHeartbeat, go: () => router.push('/(app)/modules/cvDash') },
        { id: 'F79', name: 'Bone health', desc: 'DEXA × calcium × FRAX', I: IconAnchor, go: () => router.push('/(app)/modules/boneDash') },
        { id: 'F81', name: 'MRS scale', desc: '11-item Menopause Rating', I: IconClipboard, go: () => router.push('/(app)/modules/mrs') },
        { id: 'F82', name: 'FSFI', desc: 'Sexual function index', I: IconHeart, go: () => router.push('/(app)/modules/fsfi') },
        { id: 'F83', name: 'DIVA', desc: 'GSM functional impact', I: IconDrop, go: () => router.push('/(app)/modules/diva') },
        { id: 'F84', name: 'ICIQ-UI', desc: 'Urinary incontinence', I: IconDrop, go: () => router.push('/(app)/modules/iciq') },
        { id: 'F85', name: 'Joint pain log', desc: 'Body map + stiffness', I: IconActivity, go: () => router.push('/(app)/modules/joint') },
        { id: 'F86', name: 'Headache / migraine', desc: 'Episode log + cyclical detect', I: IconBolt, go: () => router.push('/(app)/modules/headache') },
        { id: 'F87', name: 'Palpitations', desc: 'Episode log + pattern', I: IconPulse, go: () => router.push('/(app)/modules/palp') },
        { id: 'F90', name: 'Skin & hair changes', desc: 'Weekly tracker', I: IconWave, go: () => router.push('/(app)/modules/skinHair') },
        { id: 'F91', name: 'Bladder symptoms', desc: 'Frequency + nocturia', I: IconDrop, go: () => router.push('/(app)/modules/bladder') },
      ],
    },
    {
      id: 'endo',
      label: 'Endometriosis',
      show: hasEndo,
      panel: 'group-blush',
      titleIcon: IconHeart,
      items: [
        { id: 'F92', name: 'Endometriosis setup', desc: '3-branch onboarding', I: IconCompass, featured: true, go: () => router.push('/(app)/modules/endoOnboarding') },
        { id: 'F93', name: '5-D pain log', desc: 'Daily pain × 5 dimensions', I: IconDrop, go: () => router.push('/(app)/modules/endo5DPain') },
        { id: 'F94', name: 'Pain body map', desc: 'Tag zones + character', I: IconEye, go: () => router.push('/(app)/modules/endoBodyMap') },
        { id: 'F95', name: 'Bowel symptoms', desc: 'BSS + rectal bleeding flag', I: IconActivity, go: () => router.push('/(app)/modules/endoBowel') },
        { id: 'F96', name: 'PBAC bleeding', desc: 'Quantified flow + HMB flag', I: IconDrop, go: () => router.push('/(app)/modules/endoPbac') },
        { id: 'F97', name: 'Fatigue + brain fog', desc: 'Daily severity', I: IconBrain, go: () => router.push('/(app)/modules/endoFatigue') },
        { id: 'F98', name: 'Sleep (endo)', desc: 'Pain woke me + sweats', I: IconMoon, go: () => router.push('/(app)/modules/endoSleep') },
        { id: 'F99', name: 'PHQ-9', desc: 'Monthly safety screen', I: IconClipboard, go: () => router.push('/(app)/modules/phq9') },
        { id: 'F100', name: 'GAD-7', desc: 'Bi-weekly anxiety', I: IconClipboard, go: () => router.push('/(app)/modules/gad7') },
        { id: 'F101', name: 'EHP-30', desc: 'Endo QoL — monthly', I: IconClipboard, go: () => router.push('/(app)/modules/ehp30') },
        { id: 'F102', name: 'EHP-5', desc: 'Endo QoL — weekly', I: IconClipboard, go: () => router.push('/(app)/modules/ehp5') },
        { id: 'F103', name: 'B&B Scale', desc: 'Pelvic pain functional', I: IconClipboard, go: () => router.push('/(app)/modules/bnb') },
        { id: 'F104', name: 'Treatment log', desc: 'Hormonal, surgical, PFPT', I: IconPill, go: () => router.push('/(app)/modules/endoTreatment') },
        { id: 'F105', name: 'Surgical history', desc: 'rASRM + #ENZIAN vault', I: IconFolder, go: () => router.push('/(app)/modules/endoSurgical') },
        { id: 'F106', name: 'Lab vault', desc: 'CA-125, AMH, CRP, TSH', I: IconFlask, go: () => router.push('/(app)/modules/endoLab') },
        { id: 'F107', name: 'Imaging vault', desc: 'Endometriomas + DIE sites', I: IconMicroscope, go: () => router.push('/(app)/modules/endoImaging') },
        { id: 'F108', name: 'DIE safety system', desc: '9 red-flag rules', I: IconBell, go: () => router.push('/(app)/modules/endoSafety') },
        { id: 'F109', name: 'Physician report', desc: '12-section PDF', I: IconDownload, go: () => router.push('/(app)/modules/endoPhysicianReport') },
        { id: 'F110', name: 'Comorbidities', desc: 'IBS, fibro, hypothyroid', I: IconStack, go: () => router.push('/(app)/modules/endoComorbidity') },
        { id: 'F111', name: 'Med adherence', desc: 'NSAID + hormonal', I: IconPill, go: () => router.push('/(app)/modules/endoMedLog') },
        { id: 'F112', name: 'Triggers', desc: 'Food / stress / activity', I: IconTag, go: () => router.push('/(app)/modules/endoTriggers') },
        { id: 'F113', name: 'PFPT log', desc: 'Pelvic floor sessions', I: IconActivity, go: () => router.push('/(app)/modules/endoPfpt') },
        { id: 'F115', name: 'Endometrioma trend', desc: 'Size growth chart', I: IconMicroscope, go: () => router.push('/(app)/modules/endoEndometriomaTrend') },
        { id: 'F116', name: 'Low-FODMAP', desc: '8-week protocol', I: IconCompass, go: () => router.push('/(app)/modules/endoFodmap') },
        { id: 'F117', name: 'Cycle-GI engine', desc: 'IBS-vs-endo distinction', I: IconWave, go: () => router.push('/(app)/modules/endoCycleGI') },
        { id: 'F118', name: 'NSAID overuse', desc: '>50% days alert', I: IconBell, go: () => router.push('/(app)/modules/endoNsaidOveruse') },
        { id: 'F119', name: 'Staging display', desc: 'rASRM + #ENZIAN', I: IconTag, go: () => router.push('/(app)/modules/endoStaging') },
        { id: 'F120', name: 'Export formats', desc: 'PDF / CSV / link', I: IconDownload, go: () => router.push('/(app)/modules/endoExportFormats') },
        { id: 'F121', name: 'Research export', desc: 'Anonymized, opt-in', I: IconDatabase, go: () => router.push('/(app)/modules/endoResearchExport') },
      ],
    },
    {
      id: 'adhd',
      label: 'ADHD × cycle',
      show: hasADHD,
      panel: 'group-mint-warm',
      titleIcon: IconBolt,
      items: [
        { id: 'F122', name: 'ADHD setup', desc: '3-branch onboarding', I: IconCompass, featured: true, go: () => router.push('/(app)/modules/adhdOnboarding') },
        { id: 'F123', name: 'Daily ADHD log', desc: '5 domains + RSD + meds', I: IconBrain, go: () => router.push('/(app)/modules/adhdDailyLogRich') },
        { id: 'F124', name: 'ASRS-5', desc: 'WHO 6-item screen', I: IconClipboard, go: () => router.push('/(app)/modules/asrs5') },
        { id: 'F125', name: 'ADHD-RS', desc: '18-item severity', I: IconClipboard, go: () => router.push('/(app)/modules/adhdRs') },
        { id: 'F126', name: 'CAARS Emotional Lability', desc: '8-item T-score', I: IconClipboard, go: () => router.push('/(app)/modules/caarsEL') },
        { id: 'F127', name: 'WFIRS-S', desc: '50-item functional', I: IconClipboard, go: () => router.push('/(app)/modules/wfirs') },
        { id: 'F128', name: 'PHQ-9 (ADHD)', desc: 'Monthly safety screen', I: IconClipboard, go: () => router.push('/(app)/modules/phq9') },
        { id: 'F129', name: 'GAD-7 (ADHD)', desc: 'Bi-weekly anxiety', I: IconClipboard, go: () => router.push('/(app)/modules/gad7') },
        { id: 'F130', name: 'ISI', desc: 'Insomnia severity', I: IconMoon, go: () => router.push('/(app)/modules/isi') },
        { id: 'F131', name: 'RSD episode log', desc: 'Quick-add pattern tracker', I: IconHeart, go: () => router.push('/(app)/modules/adhdRSDEpisode') },
        { id: 'F132', name: 'Hyperfocus + crash', desc: 'Episode log', I: IconBolt, go: () => router.push('/(app)/modules/adhdHyperfocus') },
        { id: 'F133', name: 'Med log + BP', desc: 'Real medication tracker', I: IconPill, go: () => router.push('/(app)/modules/adhdMedLogReal') },
        { id: 'F134', name: 'Hormonal-ADHD engine', desc: 'Cycle correlation (60d)', I: IconCycle, featured: true, go: () => router.push('/(app)/modules/adhdHormonalEngine') },
        { id: 'F135', name: 'Masking effort', desc: 'Daily NRS + burnout flag', I: IconEye, go: () => router.push('/(app)/modules/adhdMaskingDaily') },
        { id: 'F136', name: 'Sleep circadian', desc: 'DLMO phase delay detect', I: IconMoon, go: () => router.push('/(app)/modules/adhdCircadian') },
        { id: 'F137', name: 'Brown EF/A', desc: '5-cluster monthly', I: IconBrain, go: () => router.push('/(app)/modules/brownEFA') },
        { id: 'F138', name: 'ADHD physician report', desc: 'Cycle × med PDF', I: IconDownload, go: () => router.push('/(app)/modules/adhdPhysicianReportReal') },
        { id: 'F139', name: 'Time blindness', desc: 'Impact + strategy log', I: IconHourglass, go: () => router.push('/(app)/modules/adhdTimeBlindness') },
        { id: 'F140', name: 'BFRB + sensory', desc: 'Skin/hair-pull + sensory', I: IconWave, go: () => router.push('/(app)/modules/adhdBfrb') },
        { id: 'F141', name: 'Supplements + lifestyle', desc: 'Omega-3, exercise, melatonin', I: IconSparkle, go: () => router.push('/(app)/modules/adhdSupplements') },
        { id: 'F142', name: 'Body doubling', desc: 'Session × productivity', I: IconUsers, go: () => router.push('/(app)/modules/adhdBodyDoubling') },
        { id: 'F143', name: 'Accommodation letter', desc: 'ADA-ready PDF', I: IconClipboard, go: () => router.push('/(app)/modules/adhdAccommodationGen') },
        { id: 'F144', name: 'Peri × ADHD', desc: 'HRT response tracking', I: IconStack, go: () => router.push('/(app)/modules/adhdPerimenopauseIntersect') },
        { id: 'F145', name: 'Burnout risk', desc: 'Detection + recovery', I: IconBell, go: () => router.push('/(app)/modules/adhdBurnoutDetect') },
        { id: 'F146', name: 'PMDD × ADHD', desc: 'Double-peak detection', I: IconStack, go: () => router.push('/(app)/modules/adhdPmddIntersection') },
        { id: 'F147', name: 'Financial dysregulation', desc: 'Weekly impulse log', I: IconDatabase, go: () => router.push('/(app)/modules/adhdFinancial') },
        { id: 'F148', name: 'CBT skill library', desc: 'Safren protocol cards', I: IconFolder, go: () => router.push('/(app)/modules/adhdCbtLibrary') },
        { id: 'F149', name: 'Postpartum ADHD', desc: 'EPDS + ADHD overlay', I: IconHeart, go: () => router.push('/(app)/modules/adhdPostpartum') },
        { id: 'F150', name: 'Late diagnosis', desc: '6-article support', I: IconCompass, go: () => router.push('/(app)/modules/adhdLateDiagnosis') },
        { id: 'F151', name: 'Relationship impact', desc: 'Weekly conflict log', I: IconUsers, go: () => router.push('/(app)/modules/adhdRelationship') },
      ],
    },
    {
      id: 'cross',
      label: 'Cross-condition',
      show: true,
      panel: 'group-cream',
      titleIcon: IconStack,
      items: [
        { id: 'F21', name: 'ADHD-PMDD overlap', desc: '46% comorbidity check', I: IconStack, featured: true, go: () => router.push('/(app)/modules/overlap') },
        { id: 'F23', name: 'Multi-condition overlay', desc: 'Single timeline', I: IconBars, go: () => router.push('/(app)/modules/overlay') },
        { id: 'F24', name: 'Irregular cycle mode', desc: 'Anovulatory aware', I: IconCycle, go: () => router.push('/(app)/modules/irregular') },
        { id: 'F30', name: 'Comprehensive PDF', desc: 'All conditions', I: IconDownload, go: () => router.push('/(app)/modules/compPDF') },
      ],
    },
    {
      id: 'food',
      label: 'Food & Diet',
      show: state.ed_safe_mode !== 'yes',
      panel: 'group-cream',
      titleIcon: IconMic,
      items: [
        { id: 'F31', name: 'Voice diet log', desc: 'Tell Ora what you ate', I: IconMic, featured: true, go: () => router.push('/(app)/ora') },
        { id: 'F32', name: 'Diet × symptoms', desc: 'Correlation engine', I: IconWave, go: () => router.push('/(app)/modules/dietSym') },
        { id: 'F33', name: 'Food photo (beta)', desc: 'Phase-aware feedback', I: IconEye, go: () => router.push('/(app)/modules/foodPhoto') },
      ],
    },
    {
      id: 'system',
      label: 'Privacy & system',
      show: true,
      panel: 'group-cream',
      titleIcon: IconLock,
      items: [
        { id: 'F5', name: 'Onboarding', desc: 'Re-run setup', I: IconCompass, go: () => router.push('/(onboarding)/start') },
        { id: 'F6', name: 'Privacy dashboard', desc: 'Where your data lives', I: IconLock, featured: true, go: () => router.push('/(app)/modules/privacy') },
        { id: 'F10', name: 'Notifications', desc: 'Phase-aware push', I: IconBell, go: () => router.push('/(app)/modules/notif') },
      ],
    },
  ], [hasPMDD, hasPCOS, hasPeri, hasEndo, hasADHD, state.ed_safe_mode, state.featureFlags?.weightTracker]);

  // ── Total count ─────────────────────────────────────────────────────────────
  const total = useMemo(
    () => groups.reduce((acc, g) => acc + g.items.length, 0),
    [groups],
  );

  // ── Default open groups ──────────────────────────────────────────────────────
  const primary =
    state.primaryCondition ??
    (hasPMDD ? 'PMDD' : hasPCOS ? 'PCOS' : hasEndo ? 'Endometriosis' : hasPeri ? 'Perimenopause' : null);
  const primaryGroupId =
    primary === 'PMDD'
      ? 'pmdd'
      : primary === 'PCOS'
      ? 'pcos'
      : primary === 'Endometriosis'
      ? 'endo'
      : primary === 'Perimenopause'
      ? 'peri'
      : null;

  const defaultOpenIds = useMemo(
    () =>
      new Set<string>(
        ['core', primaryGroupId, hasADHD ? 'adhd' : null].filter(
          (x): x is string => x !== null,
        ),
      ),
    [primaryGroupId, hasADHD],
  );

  const [openGroups, setOpenGroups] = useState<Set<string>>(defaultOpenIds);

  const toggleGroup = (id: string): void => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // ── Search ───────────────────────────────────────────────────────────────────
  const matchesQuery = (item: ToolItem): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    );
  };

  // ── Filter tabs ──────────────────────────────────────────────────────────────
  type FilterTab = { k: string; label: string };
  const filterTabs: FilterTab[] = [
    { k: 'all', label: 'All' },
    { k: 'core', label: 'Core' },
    ...(hasPMDD ? [{ k: 'pmdd', label: 'PMDD' }] : []),
    ...(hasPCOS ? [{ k: 'pcos', label: 'PCOS' }] : []),
    ...(hasPeri ? [{ k: 'peri', label: 'Peri' }] : []),
    ...(hasEndo ? [{ k: 'endo', label: 'Endo' }] : []),
    ...(hasADHD ? [{ k: 'adhd', label: 'ADHD' }] : []),
    { k: 'cross', label: 'Cross' },
    ...(state.ed_safe_mode === 'yes' ? [] : [{ k: 'food', label: 'Food' }]),
    { k: 'system', label: 'System' },
  ];

  const visibleGroups = groups.filter(
    (g) => g.show && (filter === 'all' || filter === g.id),
  );

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
            EVERYTHING IN HORMONAIQ
          </Text>
          <Text style={typography.display}>
            Your{' '}
            <Text style={[typography.italicDisplay, { color: colors.eucalyptus }]}>
              full toolkit.
            </Text>
          </Text>
          <Text style={[typography.caption, s.subtitleText]}>
            {total} tools · adjusted to{' '}
            {conditions.length > 0 ? conditions.join(', ') : 'your profile'}
            {hasADHD ? ' + ADHD' : ''}
          </Text>

          {/* Search */}
          <TextInput
            style={s.searchInput}
            placeholder="Search tools…"
            placeholderTextColor={colors.ink3}
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Search tools"
            accessibilityRole="search"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filterScroll}
          contentContainerStyle={s.filterContent}
        >
          {filterTabs.map((tab) => {
            const active = filter === tab.k;
            const handleFilter = (): void => setFilter(tab.k);
            return (
              <TouchableOpacity
                key={tab.k}
                onPress={handleFilter}
                {...(Platform.OS === 'web' ? { onClick: handleFilter } : {})}
                accessibilityLabel={`Filter by ${tab.label}`}
                accessibilityRole="button"
                style={[cmp.chip, active && cmp.chipActive]}
                activeOpacity={0.7}
              >
                <Text style={[cmp.chipLabel, active && cmp.chipLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Groups */}
        {visibleGroups.map((group) => {
          const filteredItems = group.items.filter(matchesQuery);
          if (query && filteredItems.length === 0) return null;
          const isOpen = !!query || openGroups.has(group.id);

          return (
            <CollapsibleGroup
              key={group.id}
              group={group}
              isOpen={isOpen}
              filteredItems={filteredItems}
              query={query}
              reduceMotion={reduceMotion}
              onToggle={() => toggleGroup(group.id)}
            />
          );
        })}

        {/* Bottom spacer */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>


    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 22,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 14,
    marginTop: 4,
    color: colors.ink2,
  },
  searchInput: {
    marginTop: 14,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: fonts.sans,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
  },
  filterScroll: {
    marginBottom: 18,
  },
  filterContent: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  groupPanel: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
  },
  groupLabel: {
    flex: 1,
    margin: 0,
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  tileWrapper: {
    width: '47.5%',
  },
  tile: {
    padding: spacing.md,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    minHeight: 118,
  },
  tileIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.mintMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTextBlock: {
    flex: 1,
    gap: 2,
  },
  tileName: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    lineHeight: 14 * 1.25,
    color: colors.ink,
  },
  tileDesc: {
    fontSize: 12,
    color: colors.ink3,
  },
  tileCode: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.inkDisabled,
    alignSelf: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 46, 37, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: 36,
  },
  closeBtn: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.eucalyptus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.paper,
    letterSpacing: 0.15,
  },
});
