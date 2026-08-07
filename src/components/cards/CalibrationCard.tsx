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
  Card,
  Text,
  TextInput,
} from 'react-native-paper';

import {
  addCalibrationRecord,
} from '../../services/calibrationStorage';

import {
  ProviderPriceId,
} from '../../services/priceEstimator';

type Props = {
  provider: ProviderPriceId;

  providerName: string;

  estimatedPrice: number;

  distanceKm: number;

  durationMinutes: number;

  onSaved?: () => void;
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

  return Number(normalized);
}

export default function CalibrationCard({
  provider,
  providerName,
  estimatedPrice,
  distanceKm,
  durationMinutes,
  onSaved,
}: Props) {
  const [
    observedPrice,
    setObservedPrice,
  ] = useState('');

  const [
    promotionalPrice,
    setPromotionalPrice,
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
      !Number.isFinite(observed) ||
      observed <= 0
    ) {
      Alert.alert(
        'Preço observado',
        'Informe um preço válido.',
      );

      return;
    }

    let promotional:
      number | undefined;

    if (
      promotionalPrice.trim()
    ) {
      const parsedPromotion =
        parsePrice(
          promotionalPrice,
        );

      if (
        !Number.isFinite(
          parsedPromotion,
        ) ||
        parsedPromotion <= 0
      ) {
        Alert.alert(
          'Preço promocional',
          'Informe um preço promocional válido ou deixe o campo vazio.',
        );

        return;
      }

      promotional =
        parsedPromotion;
    }

    setSaving(true);

    try {
      const result =
        await addCalibrationRecord({
          provider,

          distanceKm,

          durationMinutes,

          estimatedPrice,

          observedPrice:
            observed,

          promotionalPrice:
            promotional,
        });

      const directionText =
        result.direction === 'above'
          ? 'acima'
          : result.direction ===
              'below'
            ? 'abaixo'
            : 'exatamente igual ao';

      Alert.alert(
        'Observação registrada',
        `O CorridaX ficou ${result.percentageError.toFixed(
          2,
        )}% ${directionText} preço observado.`,
      );

      setObservedPrice('');

      setPromotionalPrice('');

      onSaved?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível registrar a observação.';

      Alert.alert(
        'Erro',
        message,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>
          📊 Calibração de preço
        </Text>

        <Text style={styles.provider}>
          {providerName}
        </Text>

        <View style={styles.summary}>
          <Text style={styles.label}>
            Estimativa CorridaX
          </Text>

          <Text style={styles.price}>
            {estimatedPrice.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              },
            )}
          </Text>

          <Text style={styles.route}>
            {distanceKm.toFixed(1)} km
            {' • '}
            {Math.round(
              durationMinutes,
            )}{' '}
            min
          </Text>
        </View>

        <TextInput
          label="Preço observado"
          value={observedPrice}
          onChangeText={
            setObservedPrice
          }
          keyboardType="decimal-pad"
          mode="outlined"
          placeholder="Ex.: 43,99"
          style={styles.input}
        />

        <TextInput
          label="Preço promocional (opcional)"
          value={promotionalPrice}
          onChangeText={
            setPromotionalPrice
          }
          keyboardType="decimal-pad"
          mode="outlined"
          placeholder="Ex.: 31,93"
          style={styles.input}
        />

        <Text style={styles.helper}>
          Use como preço observado o
          valor normal exibido pela
          plataforma. Promoções devem
          ser registradas separadamente.
        </Text>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.button}
        >
          Registrar observação
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles =
  StyleSheet.create({
    card: {
      marginTop: 16,
      borderRadius: 22,
      backgroundColor:
        '#18263D',
    },

    title: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },

    provider: {
      color: '#64B5F6',
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 8,
    },

    summary: {
      marginTop: 14,
      marginBottom: 10,
    },

    label: {
      color: '#93A8C7',
      fontSize: 12,
      fontWeight: '600',
    },

    price: {
      color: '#32D74B',
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 3,
    },

    route: {
      color: '#DDDDDD',
      marginTop: 4,
    },

    input: {
      marginTop: 12,
    },

    helper: {
      color: '#93A8C7',
      fontSize: 12,
      lineHeight: 17,
      marginTop: 12,
    },

    button: {
      marginTop: 16,
      borderRadius: 14,
    },
  });