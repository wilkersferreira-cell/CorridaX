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
  RouteComparisonResult,
} from '../../services/routeComparison';

type Props = {
  result: RouteComparisonResult;
};

function formatSigned(
  value: number,
  suffix: string,
): string {
  const sign =
    value > 0 ? '+' : '';

  return `${sign}${value.toFixed(2)}${suffix}`;
}

export default function RouteComparisonCard({
  result,
}: Props) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>
          🗺️ Teste de Rotas
        </Text>

        <Text style={styles.subtitle}>
          Google Routes × OSRM
        </Text>

        <View style={styles.engine}>
          <Text style={styles.engineName}>
            OSRM
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Distância
            </Text>

            <Text style={styles.value}>
              {result.osrm.distance.toFixed(2)} km
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Tempo
            </Text>

            <Text style={styles.value}>
              {result.osrm.duration.toFixed(1)} min
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.engine}>
          <Text style={styles.googleName}>
            Google Routes
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Distância
            </Text>

            <Text style={styles.value}>
              {result.google.distance.toFixed(2)} km
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Tempo
            </Text>

            <Text style={styles.value}>
              {result.google.duration.toFixed(1)} min
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          Diferença Google − OSRM
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            Distância
          </Text>

          <Text style={styles.difference}>
            {formatSigned(
              result.distanceDifferenceKm,
              ' km',
            )}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Distância %
          </Text>

          <Text style={styles.difference}>
            {formatSigned(
              result.distanceDifferencePercent,
              '%',
            )}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Tempo
          </Text>

          <Text style={styles.difference}>
            {formatSigned(
              result.durationDifferenceMinutes,
              ' min',
            )}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Tempo %
          </Text>

          <Text style={styles.difference}>
            {formatSigned(
              result.durationDifferencePercent,
              '%',
            )}
          </Text>
        </View>

        <Text style={styles.helper}>
          Este painel é apenas diagnóstico.
          Ele ainda não altera os preços ou
          a recomendação do CorridaX.
        </Text>
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
      fontSize: 19,
      fontWeight: 'bold',
    },

    subtitle: {
      color: '#93A8C7',
      marginTop: 4,
      marginBottom: 18,
    },

    engine: {
      marginVertical: 4,
    },

    engineName: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },

    googleName: {
      color: '#64B5F6',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },

    sectionTitle: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginBottom: 10,
    },

    row: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 8,
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

    difference: {
      color: '#FFD54F',
      fontSize: 15,
      fontWeight: 'bold',
    },

    divider: {
      height: 1,
      backgroundColor:
        '#30445F',
      marginVertical: 14,
    },

    helper: {
      color: '#93A8C7',
      fontSize: 12,
      lineHeight: 17,
      marginTop: 12,
    },
  });