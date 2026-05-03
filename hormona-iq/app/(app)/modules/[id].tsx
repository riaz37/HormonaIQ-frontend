// Dynamic module screen — app/(app)/modules/[id].tsx
// Reads `id` from route params, looks up the module in src/data/modules.ts,
// and renders a full screen with typed section renderers.

import { useReducer, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';

import { findModule } from '../../../src/data/modules';
import type { ModuleDef, ModuleSection, ModuleSectionType } from '../../../src/data/modules';
import {
  buttons,
  cards,
  components as cmp,
  typography,
} from '../../../src/constants/styles';
import { colors, fonts, radius, spacing } from '../../../src/constants/tokens';
import {
  AndrogenScreen,
  HomaIRScreen,
  LabVaultScreen,
  MetabolicSnapScreen,
  PcosSymptomTrackerScreen,
} from '../../../src/screens/modules/PcosScreens';
import {
  Endo5DPainScreen,
  EndoBodyMapScreen,
  EndoFlareTrackerScreen,
} from '../../../src/screens/modules/EndoScreens';
import {
  AdhdCycleBrainScreen,
  AdhdFocusTrackerScreen,
  AdhdMoodEnergyScreen,
} from '../../../src/screens/modules/AdhdScreens';
import {
  PeriHrtScreen,
  PeriSleepScreen,
  PeriSymptomRadarScreen,
} from '../../../src/screens/modules/PeriScreens';

// ─────────────────────────────────────────────
// Dedicated screen registry — Phase 2 wiring.
// Module IDs not in this map fall through to the generic SectionRenderer below.
// ─────────────────────────────────────────────
type DedicatedScreen = (props: { onBack: () => void }) => ReactElement;

const DEDICATED_SCREENS: Record<string, DedicatedScreen> = {
  // PCOS
  labVault: LabVaultScreen,
  metabolicSnap: MetabolicSnapScreen,
  androgen: AndrogenScreen,
  homaIR: HomaIRScreen,
  pcosSymptomTracker: PcosSymptomTrackerScreen,
  // Endometriosis
  endoBodyMap: EndoBodyMapScreen,
  endo5DPain: Endo5DPainScreen,
  endoFlareTracker: EndoFlareTrackerScreen,
  // ADHD
  adhdFocusTracker: AdhdFocusTrackerScreen,
  adhdMoodEnergy: AdhdMoodEnergyScreen,
  adhdCycleBrain: AdhdCycleBrainScreen,
  // Perimenopause
  periSymptomRadar: PeriSymptomRadarScreen,
  periHRT: PeriHrtScreen,
  periSleep: PeriSleepScreen,
};

// ─────────────────────────────────────────────
// Condition badge colour map
// ─────────────────────────────────────────────
const CONDITION_BADGE_COLOR: Record<ModuleDef['condition'], string> = {
  pcos: colors.coralSoft,
  endometriosis: colors.rose,
  adhd: colors.butter,
  perimenopause: colors.sageLight,
  pmdd: colors.mintMist,
  general: colors.cream,
};

const CONDITION_BADGE_TEXT: Record<ModuleDef['condition'], string> = {
  pcos: 'PCOS',
  endometriosis: 'Endometriosis',
  adhd: 'ADHD',
  perimenopause: 'Perimenopause',
  pmdd: 'PMDD',
  general: 'General',
};

// ─────────────────────────────────────────────
// ScaleRow — a single labelled 0–10 NRS row
// Extracted into its own component so hooks are not called inside a map.
// ─────────────────────────────────────────────
interface ScaleRowProps {
  label: string;
  accessibilityPrefix?: string;
}

function ScaleRow({ label, accessibilityPrefix }: ScaleRowProps): ReactElement {
  const [selected, setSelected] = useState<number | null>(null);
  const prefix = accessibilityPrefix ?? label;

  return (
    <View style={s.subScaleRow}>
      <Text style={s.subScaleLabel}>{label}</Text>
      <View style={s.scaleRow}>
        {Array.from({ length: 11 }, (_, n) => {
          const active = selected === n;
          return (
            <TouchableOpacity
              key={n}
              onPress={() => setSelected(n)}
              accessibilityLabel={`${prefix}: ${n} out of 10`}
              accessibilityRole="button"
              style={[cmp.scaleBtn, active && cmp.scaleBtnActive]}
              activeOpacity={0.75}
            >
              <Text style={[cmp.scaleBtnLabel, active && cmp.scaleBtnLabelActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// Scale section — 0–10 NRS pills
// ─────────────────────────────────────────────
interface ScaleSectionProps {
  section: ModuleSection;
  reduceMotion: boolean;
}

function ScaleSection({ section }: ScaleSectionProps): ReactElement {
  // Single-scale mode (no items array): one shared NRS row for the whole section
  const [selected, setSelected] = useState<number | null>(null);
  const hasSubItems = section.items !== undefined;

  return (
    <View style={s.sectionCard}>
      <Text style={s.sectionTitle}>{section.title}</Text>
      {section.body !== undefined && (
        <Text style={[typography.caption, s.sectionBody]}>{section.body}</Text>
      )}
      {hasSubItems ? (
        <View style={s.subItemsContainer}>
          {section.items?.map((item) => (
            <ScaleRow key={item} label={item} />
          ))}
        </View>
      ) : (
        <View style={s.scaleRow}>
          {Array.from({ length: 11 }, (_, n) => {
            const active = selected === n;
            return (
              <TouchableOpacity
                key={n}
                onPress={() => setSelected(n)}
                accessibilityLabel={`${section.title}: ${n} out of 10`}
                accessibilityRole="button"
                style={[cmp.scaleBtn, active && cmp.scaleBtnActive]}
                activeOpacity={0.75}
              >
                <Text style={[cmp.scaleBtnLabel, active && cmp.scaleBtnLabelActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Checklist section — checkable items (local state)
// ─────────────────────────────────────────────
interface ChecklistSectionProps {
  section: ModuleSection;
}

type ChecklistAction =
  | { type: 'toggle'; item: string };

function checklistReducer(
  state: ReadonlySet<string>,
  action: ChecklistAction,
): Set<string> {
  const next = new Set(state);
  if (action.type === 'toggle') {
    if (next.has(action.item)) {
      next.delete(action.item);
    } else {
      next.add(action.item);
    }
  }
  return next;
}

function ChecklistSection({ section }: ChecklistSectionProps): ReactElement {
  const [checked, dispatch] = useReducer(checklistReducer, new Set<string>());

  return (
    <View style={s.sectionCard}>
      <Text style={s.sectionTitle}>{section.title}</Text>
      {section.body !== undefined && (
        <Text style={[typography.caption, s.sectionBody]}>{section.body}</Text>
      )}
      {section.items?.map((item) => {
        const isChecked = checked.has(item);
        return (
          <TouchableOpacity
            key={item}
            onPress={() => dispatch({ type: 'toggle', item })}
            accessibilityLabel={`${isChecked ? 'Uncheck' : 'Check'}: ${item}`}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked }}
            style={s.checkRow}
            activeOpacity={0.7}
          >
            <View style={[s.checkbox, isChecked && s.checkboxChecked]}>
              {isChecked && <Text style={s.checkmark}>✓</Text>}
            </View>
            <Text style={[s.checkLabel, isChecked && s.checkLabelChecked]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────
// Info section — title + body + optional bullet list
// ─────────────────────────────────────────────
function InfoSection({ section }: { section: ModuleSection }): ReactElement {
  return (
    <View style={s.sectionCard}>
      <Text style={s.sectionTitle}>{section.title}</Text>
      {section.body !== undefined && (
        <Text style={[typography.body, { fontSize: 14, marginBottom: section.items ? 10 : 0 }]}>
          {section.body}
        </Text>
      )}
      {section.items?.map((item) => (
        <View key={item} style={s.bulletRow}>
          <View style={s.bulletDot} />
          <Text style={[typography.caption, s.bulletText]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// Tracker section — "Log entry" button + empty state
// ─────────────────────────────────────────────
function TrackerSection({ section }: { section: ModuleSection }): ReactElement {
  const [count, setCount] = useState(0);

  return (
    <View style={s.sectionCard}>
      <Text style={s.sectionTitle}>{section.title}</Text>
      {section.body !== undefined && (
        <Text style={[typography.caption, s.sectionBody]}>{section.body}</Text>
      )}
      {count === 0 ? (
        <View style={s.trackerEmpty}>
          <Text style={s.trackerEmptyText}>No entries yet. Tap to log your first.</Text>
        </View>
      ) : (
        <View style={s.trackerLoggedBadge}>
          <Text style={s.trackerLoggedText}>
            {count} {count === 1 ? 'entry' : 'entries'} logged
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => setCount((c) => c + 1)}
        accessibilityLabel={`Log entry for ${section.title}`}
        accessibilityRole="button"
        style={[buttons.soft, { marginTop: 12 }]}
        activeOpacity={0.8}
      >
        <Text style={buttons.softLabel}>+ Log entry</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// Form section — TextInput fields
// ─────────────────────────────────────────────
function FormSection({ section }: { section: ModuleSection }): ReactElement {
  const fields = section.items ?? ['Value', 'Date', 'Notes'];
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f, ''])),
  );

  return (
    <View style={s.sectionCard}>
      <Text style={s.sectionTitle}>{section.title}</Text>
      {section.body !== undefined && (
        <Text style={[typography.caption, s.sectionBody]}>{section.body}</Text>
      )}
      {fields.map((field) => (
        <View key={field} style={s.formField}>
          <Text style={s.formLabel}>{field}</Text>
          <TextInput
            value={values[field] ?? ''}
            onChangeText={(text) =>
              setValues((prev) => ({ ...prev, [field]: text }))
            }
            placeholder={`Enter ${field.toLowerCase()}`}
            placeholderTextColor={colors.ink3}
            accessibilityLabel={`${field} input for ${section.title}`}
            style={s.formInput}
            returnKeyType="done"
          />
        </View>
      ))}
      <TouchableOpacity
        onPress={() => {
          setValues(Object.fromEntries(fields.map((f) => [f, ''])));
        }}
        accessibilityLabel={`Save ${section.title}`}
        accessibilityRole="button"
        style={[buttons.soft, { marginTop: 8 }]}
        activeOpacity={0.8}
      >
        <Text style={buttons.softLabel}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// Section dispatcher
// ─────────────────────────────────────────────
interface SectionRendererProps {
  section: ModuleSection;
  reduceMotion: boolean;
}

function SectionRenderer({ section, reduceMotion }: SectionRendererProps): ReactElement {
  const type: ModuleSectionType = section.type ?? 'info';

  switch (type) {
    case 'scale':
      return <ScaleSection section={section} reduceMotion={reduceMotion} />;
    case 'checklist':
      return <ChecklistSection section={section} />;
    case 'tracker':
      return <TrackerSection section={section} />;
    case 'form':
      return <FormSection section={section} />;
    default:
      return <InfoSection section={section} />;
  }
}

// ─────────────────────────────────────────────
// Not-found fallback
// ─────────────────────────────────────────────
function ModuleNotFound({ id, onBack }: { id: string; onBack: () => void }): ReactElement {
  return (
    <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
      <View style={s.notFoundContainer}>
        <Text style={[typography.h2, { marginBottom: 12 }]}>Module not found</Text>
        <Text style={[typography.caption, { marginBottom: 24, textAlign: 'center' }]}>
          No module with id "{id}" exists.
        </Text>
        <TouchableOpacity
          onPress={onBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={buttons.soft}
          activeOpacity={0.8}
        >
          <Text style={buttons.softLabel}>Go back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────
export default function ModuleScreen(): ReactElement {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const reduceMotion = useReducedMotion() ?? false;

  const moduleId = Array.isArray(id) ? id[0] : id ?? '';

  // Phase 2 — route known IDs to their dedicated rich screens.
  const Dedicated = DEDICATED_SCREENS[moduleId];
  if (Dedicated !== undefined) {
    return <Dedicated onBack={() => router.back()} />;
  }

  const module = findModule(moduleId);

  if (module === undefined) {
    return (
      <ModuleNotFound id={moduleId} onBack={() => router.back()} />
    );
  }

  const badgeBg = CONDITION_BADGE_COLOR[module.condition];
  const badgeText = CONDITION_BADGE_TEXT[module.condition];

  return (
    <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
      {/* Topbar */}
      <View style={s.topbar}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={s.backBtn}
          activeOpacity={0.7}
        >
          <Text style={s.backBtnLabel}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.header}>
          {module.icon !== undefined && (
            <Text style={s.headerIcon}>{module.icon}</Text>
          )}
          <View style={[cmp.badge, { backgroundColor: badgeBg, marginBottom: 10 }]}>
            <Text style={[cmp.badgeLabel, { color: colors.ink2 }]}>{badgeText}</Text>
          </View>
          <Text style={typography.h1}>{module.title}</Text>
          {module.subtitle !== undefined && (
            <Text style={[typography.caption, s.subtitle]}>{module.subtitle}</Text>
          )}
        </View>

        {/* Sections */}
        {module.sections.map((section, index) => (
          <SectionRenderer
            key={`${section.title}-${index}`}
            section={section}
            reduceMotion={reduceMotion}
          />
        ))}

        {/* Disclaimer */}
        <Text style={s.disclaimer}>
          HormonaIQ is not a substitute for medical advice. Always consult your provider.
        </Text>
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
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: 'rgba(250, 251, 246, 0.95)',
  },
  backBtn: {
    height: 44,
    paddingHorizontal: 4,
    justifyContent: 'center',
    minWidth: 44,
  },
  backBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.eucalyptusDeep,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink2,
  },
  // Section card shared container
  sectionCard: {
    ...cards.cardPaper,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 11 * 0.16,
    textTransform: 'uppercase',
    color: colors.eucalyptus,
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 14 * 1.6,
    color: colors.ink2,
    marginBottom: 12,
  },
  // Scale
  scaleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  subItemsContainer: {
    gap: spacing.md,
  },
  subScaleRow: {
    gap: 6,
  },
  subScaleLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink,
  },
  // Checklist
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: 44,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.inkDisabled,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  checkmark: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    color: colors.paper,
    lineHeight: 16,
  },
  checkLabel: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },
  checkLabelChecked: {
    color: colors.ink3,
    textDecorationLine: 'line-through',
  },
  // Info bullets
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.eucalyptus,
    marginTop: 6,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink2,
  },
  // Tracker
  trackerEmpty: {
    backgroundColor: colors.mintPale,
    borderRadius: radius.sm,
    padding: 14,
    alignItems: 'center',
  },
  trackerEmptyText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink3,
    textAlign: 'center',
  },
  trackerLoggedBadge: {
    backgroundColor: colors.sageLight,
    borderRadius: radius.sm,
    padding: 10,
    alignItems: 'center',
  },
  trackerLoggedText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptusDeep,
  },
  // Form
  formField: {
    marginBottom: 12,
  },
  formLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink2,
    marginBottom: 4,
  },
  formInput: {
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: fonts.sans,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.paper,
  },
  // Not found
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  // Disclaimer
  disclaimer: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
