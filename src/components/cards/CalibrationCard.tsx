import React, {
  useState,
} from 'react';

import {
  Alert,
  StyleSheet,
  View,
} from 'react-native';

import {
  Button,
  Text,
  TextInput,
} from 'react-native-paper';

import {
  addCalibrationRecord,
} from '../../services/calibrationStorage';

import {
  ProviderPriceId,
} from '../../services/priceEstimator';

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

export type CalibrationCardProps = {
  provider: ProviderPriceId;

  providerName: string;

  estimatedPrice: number;

  estimatedPriceMin?: number;

  estimatedPriceMax?: number;

  distanceKm: number;

  durationMinutes: number;

  origin?: string;

  destination?: string;

  onSaved?: () => void;

  onDismiss?: () => void;
};

function parsePrice(
  value: string,
): number {
  const normalized =
    value
      .trim()
      .replace(/\s/g, '')
      .replace('R$', '')
      .replace(',', '.');

  return Number(
    normalized,
  );
}

export default function CalibrationCard({
  provider,
  providerName,
  estimatedPrice,
  estimatedPriceMin,
  estimatedPriceMax,
  distanceKm,
  durationMinutes,
  origin,
  destination,
  onSaved,
  onDismiss,
}: CalibrationCardProps) {
  const [
    observedPrice,
    setObservedPrice,
  ] = useState('');

  const [
    saving,
    setSaving,
  ] = useState(false);

  async function handleSave() {
    const observed =
      parsePrice(
        observedPrice,
      );

    if (
      !Number.isFinite(
        observed,
      ) ||
      observed <= 0
    ) {
      Alert.alert(
        'Preço encontrado',
        'Informe um preço válido.',
      );

      return;
    }

    setSaving(
      true,
    );

    try {
      await addCalibrationRecord({
        provider,

        distanceKm,

        durationMinutes,

        estimatedPrice,

        estimatedPriceMin,

        estimatedPriceMax,

        observedPrice:
          observed,

        origin,

        destination,
      });

      Alert.alert(
        'Obrigado por colaborar! 💙',
        'O preço informado foi registrado e ajudará o CorridaX a melhorar suas estimativas.',
      );

      setObservedPrice(
        '',
      );

      onSaved?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível registrar o preço informado.';

      Alert.alert(
        'Erro',
        message,
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.header
        }
      >
        <Text
          style={
            styles.title
          }
        >
          Quanto apareceu no {providerName}?
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Informe o preço mostrado no app para esta corrida.
        </Text>
      </View>

      <View
        style={
          styles.routeRow
        }
      >
        <Text
          style={
            styles.routeText
          }
        >
          {distanceKm.toFixed(
            1,
          )}{' '}
          km
          {' • '}
          {Math.round(
            durationMinutes,
          )}{' '}
          min
        </Text>
      </View>

      <TextInput
        label="Preço encontrado"
        value={
          observedPrice
        }
        onChangeText={
          setObservedPrice
        }
        keyboardType="decimal-pad"
        mode="outlined"
        placeholder="Ex.: 35,90"
        left={
          <TextInput.Affix
            text="R$"
          />
        }
        style={
          styles.input
        }
      />

      <Text
        style={
          styles.helper
        }
      >
        Sua informação ajuda o CorridaX a aproximar cada vez mais as estimativas dos preços reais.
      </Text>

      <Button
        mode="contained"
        onPress={
          handleSave
        }
        loading={
          saving
        }
        disabled={
          saving
        }
        style={
          styles.saveButton
        }
        contentStyle={
          styles.buttonContent
        }
      >
        Enviar preço
      </Button>

      {onDismiss ? (
        <Button
          mode="text"
          onPress={
            onDismiss
          }
          disabled={
            saving
          }
          style={
            styles.dismissButton
          }
          textColor={
            COLORS.textSecondary
          }
        >
          Agora não
        </Button>
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      marginTop:
        SPACING.md,

      padding:
        SPACING.md,

      borderRadius:
        RADIUS.lg,

      borderWidth: 1,

      borderColor:
        COLORS.primary,

      backgroundColor:
        COLORS.primarySoft,
    },

    header: {
      marginBottom: 8,
    },

    title: {
      color:
        COLORS.white,

      fontSize: 16,

      fontWeight:
        TYPOGRAPHY.weight.bold,

      lineHeight: 21,
    },

    subtitle: {
      marginTop: 3,

      color:
        COLORS.textSecondary,

      fontSize: 11,

      lineHeight: 16,
    },

    routeRow: {
      marginBottom: 5,
    },

    routeText: {
      color:
        COLORS.primaryLight,

      fontSize: 11,

      fontWeight:
        TYPOGRAPHY.weight.semiBold,
    },

    input: {
      marginTop: 6,

      backgroundColor:
        COLORS.surfaceLight,
    },

    helper: {
      marginTop: 8,

      color:
        COLORS.textSecondary,

      fontSize: 10,

      lineHeight: 15,
    },

    saveButton: {
      marginTop: 12,

      borderRadius:
        RADIUS.lg,
    },

    buttonContent: {
      minHeight: 44,
    },

    dismissButton: {
      marginTop: 1,
    },
  });