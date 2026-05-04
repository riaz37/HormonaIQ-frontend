// SelectPicker — shared inline option list picker.
// Suitable for small, fixed option sets (up to ~10 items) that
// can be rendered inline without scrolling. For large lists
// (e.g. year of birth) use a modal-based picker instead.

import type { ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, fonts, radius } from '../../constants/tokens';

export interface SelectOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

export interface SelectPickerProps<T extends string> {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (v: T) => void;
  placeholder?: string;
  accessibilityLabel?: string;
}

export function SelectPicker<T extends string>({
  options,
  value,
  onChange,
  placeholder,
  accessibilityLabel,
}: SelectPickerProps<T>): ReactElement {
  return (
    <View style={selectStyles.container} accessibilityLabel={accessibilityLabel}>
      {placeholder && !value && (
        <Text style={selectStyles.placeholder}>{placeholder}</Text>
      )}
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
            style={[selectStyles.option, selected && selectStyles.optionSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={opt.label}
          >
            <Text
              style={[
                selectStyles.optionLabel,
                selected && selectStyles.optionLabelSelected,
              ]}
            >
              {opt.label}
            </Text>
            {selected && <Text style={selectStyles.checkmark}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const selectStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.paper,
  },
  placeholder: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink3,
    padding: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 44,
    backgroundColor: colors.paper,
  },
  optionSelected: {
    backgroundColor: colors.mintPale,
  },
  optionLabel: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  optionLabelSelected: {
    fontFamily: fonts.sansMedium,
    color: colors.eucalyptusDeep,
  },
  checkmark: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptus,
  },
});
