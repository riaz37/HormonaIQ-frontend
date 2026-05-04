// ModuleSheet — bottom sheet that renders any feature module.
// Port of design-handoff/08-implementation-code/src/module-sheet.jsx
// Wave 4 T-65 — grab-handle header, no X button, swipe-down to dismiss.

import React, { useRef, type ReactElement } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { typography } from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ModuleSheetProps {
  /** Unique module identifier — shown as debug tooltip in dev builds */
  id: string;
  /** Whether the sheet is visible */
  visible: boolean;
  /** Called when the sheet should close (backdrop tap or swipe-down) */
  onClose: () => void;
  /** The module content to render inside the sheet */
  children?: ReactElement;
}

interface TouchState {
  y: number;
  t: number;
}

// ─────────────────────────────────────────────
// Swipe-down gesture constants (T-65)
// ─────────────────────────────────────────────
const SWIPE_THRESHOLD_PX = 80;
const SWIPE_THRESHOLD_MS = 300;

// ─────────────────────────────────────────────
// ModuleSheet
// ─────────────────────────────────────────────

export function ModuleSheet({
  id,
  visible,
  onClose,
  children,
}: ModuleSheetProps): ReactElement {
  const reduceMotion = useReducedMotion();
  const touchRef = useRef<TouchState | null>(null);

  // Sheet slide-up animation
  const translateY = useSharedValue(400);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: reduceMotion ? 0 : 350,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateY.value = withTiming(400, {
        duration: reduceMotion ? 0 : 200,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [visible, reduceMotion, translateY]);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // T-65 — swipe-down-to-dismiss (Δy > 80px in < 300ms)
  const handleTouchStart = (e: GestureResponderEvent): void => {
    touchRef.current = { y: e.nativeEvent.pageY, t: Date.now() };
  };

  const handleTouchEnd = (e: GestureResponderEvent): void => {
    const start = touchRef.current;
    if (start === null) return;
    const dy = e.nativeEvent.pageY - start.y;
    const dt = Date.now() - start.t;
    if (dy > SWIPE_THRESHOLD_PX && dt < SWIPE_THRESHOLD_MS) {
      onClose();
    }
    touchRef.current = null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable
        style={s.backdrop}
        onPress={onClose}
        accessibilityLabel="Close module sheet"
        accessibilityRole="button"
      >
        {/* Sheet — React Native has no touch event bubbling — modal structure prevents backdrop press */}
        <Animated.View style={[s.sheet, animatedSheetStyle]}>
          <Pressable>
            {/* Sticky header with grab handle */}
            <Pressable
              style={s.header}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onPress={onClose}
              accessibilityLabel="Close panel"
              accessibilityRole="button"
            >
              {/* T-65 grab handle */}
              <View style={s.grabHandle} />
            </Pressable>

            {/* Module content */}
            <ScrollView
              style={s.scrollView}
              contentContainerStyle={s.contentContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {children !== undefined ? children : <Fallback id={id} />}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// Fallback — shown when no children are provided
// ─────────────────────────────────────────────

export interface FallbackProps {
  id: string;
}

export function Fallback({ id }: FallbackProps): ReactElement {
  return (
    <View>
      <Text style={[typography.eyebrow, s.fallbackEyebrow]}>MODULE</Text>
      <Text style={[typography.displaySm, s.fallbackTitle]}>{id}</Text>
      <Text style={typography.body}>
        This module is in your build. Detailed UI coming online.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlayModal,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '88%',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.paper,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // meets tap-target requirement for swipe handle area
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  grabHandle: {
    width: 38,
    height: 4,
    backgroundColor: colors.borderStrong,
    borderRadius: radius.pill,
  },
  scrollView: {
    flexShrink: 1,
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: spacing.sm,
    paddingBottom: 28,
  },

  // Fallback
  fallbackEyebrow: {
    marginBottom: 6,
  },
  fallbackTitle: {
    marginBottom: 10,
  },
});
