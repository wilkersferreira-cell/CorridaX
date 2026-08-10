import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Card,
  ProgressBar,
  Text,
} from 'react-native-paper';

type ProviderProgress = {
  name: string;
  samples: number;
};

type Props = {
  providers: ProviderProgress[];
  target?: number;
};

export default function LearningProgressCard({
  providers,
  target = 10,
}: Props) {
  const totalSamples =
    providers.reduce(
      (total, provider) =>
        total + provider.samples,
      0,
    );

  const totalTarget =
    target * providers.length;

  const overallProgress =
    Math.min(
      totalSamples / totalTarget,
      1,
    );

  function getStatus(
    samples: number,
  ) {
    if (samples >= target) {
      return 'Base inicial concluída';
    }

    if (samples >= 5) {
      return 'Aprendendo';
    }

    return 'Coletando dados';
  }

  const readyToCalibrate =
    providers.every(
      (provider) =>
        provider.samples >= target,
    );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>
          🧠 Aprendizado CorridaX
        </Text>

        <Text style={styles.subtitle}>
          Progresso da base de calibração
        </Text>

        {providers.map(
          (provider) => {
            const progress =
              Math.min(
                provider.samples /
                  target,
                1,
              );

            return (
              <View
                key={provider.name}
                style={
                  styles.provider
                }
              >
                <View
                  style={
                    styles.row
                  }
                >
                  <Text
                    style={
                      styles.name
                    }
                  >
                    {provider.name}
                  </Text>

                  <Text
                    style={
                      styles.samples
                    }
                  >
                    {provider.samples}/
                    {target} amostras
                  </Text>
                </View>

                <ProgressBar
                  progress={progress}
                  style={
                    styles.progress
                  }
                />

                <Text
                  style={
                    styles.status
                  }
                >
                  {getStatus(
                    provider.samples,
                  )}
                </Text>
              </View>
            );
          },
        )}

        <View style={styles.divider} />

        <Text style={styles.label}>
          Progresso geral
        </Text>

        <ProgressBar
          progress={overallProgress}
          style={
            styles.progress
          }
        />

        <Text
          style={[
            styles.decision,
            readyToCalibrate
              ? styles.ready
              : styles.wait,
          ]}
        >
          {readyToCalibrate
            ? '✅ Base pronta para testar recalibração'
            : '⏳ Ainda não recalibrar o modelo'}
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

    provider: {
      marginBottom: 18,
    },

    row: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    name: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 15,
    },

    samples: {
      color: '#B8C7DB',
      fontSize: 13,
    },

    progress: {
      height: 8,
      borderRadius: 8,
      marginTop: 8,
    },

    status: {
      color: '#93A8C7',
      fontSize: 12,
      marginTop: 6,
    },

    divider: {
      height: 1,
      backgroundColor:
        '#30445F',
      marginBottom: 16,
    },

    label: {
      color: '#B8C7DB',
      fontSize: 13,
    },

    decision: {
      marginTop: 16,
      fontWeight: 'bold',
    },

    ready: {
      color: '#32D74B',
    },

    wait: {
      color: '#FFD54F',
    },
  });