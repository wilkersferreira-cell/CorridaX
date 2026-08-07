import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from 'react-native-paper';

import { ComparisonMode } from '../../services/comparison';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  value: ComparisonMode;
  onChange: (mode: ComparisonMode) => void;
};

type ModeOption = {
  id: ComparisonMode;
  icon: string;
  label: string;
  description: string;
};

const MODES: ModeOption[] = [
  {
    id: 'balanced',
    icon: '⚖️',
    label: 'Equilibrado',
    description: 'Preço + tempo',
  },
  {
    id: 'economy',
    icon: '💰',
    label: 'Economizar',
    description: 'Menor preço',
  },
  {
    id: 'fast',
    icon: '⚡',
    label: 'Rápido',
    description: 'Menor tempo',
  },
];

export default function ComparisonModeSelector({
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Qual é sua prioridade?
        </Text>

        <Text style={styles.subtitle}>
          O CorridaX ajusta a recomendação para você
        </Text>
      </View>

      <View style={styles.options}>
        {MODES.map((mode) => {
          const selected =
            value === mode.id;

          return (
            <Pressable
              key={mode.id}
              onPress={() =>
                onChange(mode.id)
              }
              style={({ pressed }) => [
                styles.option,
                selected &&
                  styles.optionSelected,
                pressed &&
                  styles.optionPressed,
              ]}
            >
              <Text style={styles.icon}>
                {mode.icon}
              </Text>

              <Text
                style={[
                  styles.label,
                  selected &&
                    styles.labelSelected,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {mode.label}
              </Text>

              <Text
                style={[
                  styles.description,
                  selected &&
                    styles.descriptionSelected,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {mode.description}
              </Text>

              {selected && (
                <View
                  style={
                    styles.selectedIndicator
                  }
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,

    padding: SPACING.lg,

    backgroundColor: COLORS.surfaceLight,

    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    borderRadius: RADIUS.xl,

    ...SHADOWS.sm,
  },

  header: {
    marginBottom: SPACING.md,
  },

  title: {
    color: COLORS.white,

    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  subtitle: {
    marginTop: SPACING.xs,

    color: COLORS.textSecondary,

    fontSize: TYPOGRAPHY.size.xs,
  },

  options: {
    flexDirection: 'row',
  },

  option: {
    position: 'relative',

    flex: 1,

    minHeight: 92,

    marginHorizontal: SPACING.xs,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    borderRadius: RADIUS.lg,

    overflow: 'hidden',
  },

  optionSelected: {
    backgroundColor: COLORS.primarySoft,

    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },

  optionPressed: {
    opacity: 0.8,
  },

  icon: {
    fontSize: TYPOGRAPHY.size.xl,
  },

  label: {
    marginTop: SPACING.xs,

    color: COLORS.textSecondary,

    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semiBold,

    textAlign: 'center',
  },

  labelSelected: {
    color: COLORS.primaryLight,
  },

  description: {
    marginTop: SPACING.xs,

    color: COLORS.textMuted,

    fontSize: TYPOGRAPHY.size.xs,

    textAlign: 'center',
  },

  descriptionSelected: {
    color: COLORS.text,
  },

  selectedIndicator: {
    position: 'absolute',

    bottom: 0,
    left: 12,
    right: 12,

    height: 3,

    borderRadius: RADIUS.round,

    backgroundColor: COLORS.primary,
  },
});