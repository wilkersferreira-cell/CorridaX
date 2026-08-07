import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Card,
  Text,
} from 'react-native-paper';

import {
  CalibrationMetrics,
} from '../../services/calibrationMetrics';

type Props = {
  providerName: string;
  metrics: CalibrationMetrics;
};

function formatCurrency(
  value: number,
): string {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    },
  );
}

function formatBias(
  value: number,
): string {
  if (value > 0) {
    return `+${formatCurrency(
      value,
    )}`;
  }

  return formatCurrency(value);
}

export default function CalibrationMetricsCard({
  providerName,
  metrics,
}: Props) {
  const hasSamples =
    metrics.sampleCount > 0;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>
          📊 Precisão CorridaX
        </Text>

        <Text style={styles.provider}>
          {providerName}
        </Text>

        {!hasSamples ? (
          <Text style={styles.empty}>
            Nenhuma observação
            registrada ainda.
          </Text>
        ) : (
          <View style={styles.metrics}>
            <View style={styles.row}>
              <Text style={styles.label}>
                Amostras
              </Text>

              <Text style={styles.value}>
                {metrics.sampleCount}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Erro médio
              </Text>

              <Text style={styles.value}>
                {formatCurrency(
                  metrics.mae,
                )}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                MAPE
              </Text>

              <Text style={styles.value}>
                {metrics.mape.toFixed(
                  2,
                )}
                %
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Viés
              </Text>

              <Text
                style={[
                  styles.value,
                  metrics.bias > 0
                    ? styles.above
                    : metrics.bias < 0
                      ? styles.below
                      : styles.exact,
                ]}
              >
                {formatBias(
                  metrics.bias,
                )}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Pior erro
              </Text>

              <Text style={styles.value}>
                {formatCurrency(
                  metrics.maxAbsoluteError,
                )}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>
                Média CorridaX
              </Text>

              <Text style={styles.value}>
                {formatCurrency(
                  metrics.averageEstimatedPrice,
                )}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Média observada
              </Text>

              <Text style={styles.value}>
                {formatCurrency(
                  metrics.averageObservedPrice,
                )}
              </Text>
            </View>
          </View>
        )}
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
      marginTop: 6,
    },

    empty: {
      color: '#93A8C7',
      marginTop: 16,
    },

    metrics: {
      marginTop: 16,
    },

    row: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },

    label: {
      color: '#B8C7DB',
      fontSize: 14,
    },

    value: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },

    above: {
      color: '#FFD54F',
    },

    below: {
      color: '#64B5F6',
    },

    exact: {
      color: '#32D74B',
    },

    divider: {
      height: 1,
      backgroundColor:
        '#30445F',
      marginVertical: 8,
    },
  });