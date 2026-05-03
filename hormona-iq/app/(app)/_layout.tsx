// Tabs shell — five-destination Morning Garden tabbar (Home / Log / Cycle /
// Insights / Profile). Mirrors the `.tabbar` rules in HormonaIQ.html (lines
// 240-274): warm gradient, sage outer border, pill radius, eucalyptus active.

import { Tabs } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import type { ReactElement, ReactNode } from 'react';

import { colors, fonts, radius, shadows } from '../../src/constants/tokens';

interface TabIconProps {
  focused: boolean;
}

function tint(focused: boolean): string {
  return focused ? colors.paper : colors.ink3;
}

function HomeIcon({ focused }: TabIconProps): ReactNode {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1Z"
        stroke={tint(focused)}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LogIcon({ focused }: TabIconProps): ReactNode {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={tint(focused)} strokeWidth={1.6} />
      <Path
        d="M12 8v8M8 12h8"
        stroke={tint(focused)}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CycleIcon({ focused }: TabIconProps): ReactNode {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={12}
        r={8.5}
        stroke={tint(focused)}
        strokeWidth={1.6}
        strokeDasharray="3 3"
      />
      <Circle cx={12} cy={3.5} r={1.6} fill={tint(focused)} />
    </Svg>
  );
}

function InsightsIcon({ focused }: TabIconProps): ReactNode {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19h16M6 16V9m5 7V5m5 11v-4"
        stroke={tint(focused)}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ProfileIcon({ focused }: TabIconProps): ReactNode {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.6} stroke={tint(focused)} strokeWidth={1.6} />
      <Path
        d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5"
        stroke={tint(focused)}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

interface TabConfig {
  name: 'home' | 'log' | 'cycle' | 'insights' | 'profile';
  label: string;
  Icon: (props: TabIconProps) => ReactNode;
}

const TABS: readonly TabConfig[] = [
  { name: 'home', label: 'Home', Icon: HomeIcon },
  { name: 'log', label: 'Log', Icon: LogIcon },
  { name: 'cycle', label: 'Cycle', Icon: CycleIcon },
  { name: 'insights', label: 'Insights', Icon: InsightsIcon },
  { name: 'profile', label: 'Profile', Icon: ProfileIcon },
] as const;

export default function AppTabsLayout(): ReactElement {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={({ state, navigation }) => (
        <View style={styles.tabbarOuter} pointerEvents="box-none">
          <LinearGradient
            colors={[colors.paper, colors.creamWarm]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.tabbar}
          >
            {state.routes.map((route, index) => {
              const config = TABS.find((t) => t.name === route.name);
              if (!config) return null;
              const focused = state.index === index;
              const Icon = config.Icon;
              const handlePress = (): void => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };
              return (
                <Pressable
                  key={route.key}
                  style={[styles.tab, focused && styles.tabActive]}
                  accessibilityRole="button"
                  accessibilityLabel={config.label}
                  accessibilityState={{ selected: focused }}
                  onPress={handlePress}
                  {...(Platform.OS === 'web' ? { onClick: handlePress } : {})}
                >
                  <Icon focused={focused} />
                  <Text
                    style={[styles.tabLabel, focused && styles.tabLabelActive]}
                  >
                    {config.label}
                  </Text>
                </Pressable>
              );
            })}
          </LinearGradient>
        </View>
      )}
    >
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.label }} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabbarOuter: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  tabbar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.tabbarBorder,
    borderRadius: radius.pill,
    padding: 6,
    ...shadows.md,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    gap: 2,
  },
  tabActive: {
    backgroundColor: colors.eucalyptus,
  },
  tabLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.ink3,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.paper,
  },
});
