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
  PriceCalibrationResult,
} from '../../services/priceCalibration';

type Props = {
  providerName: string;

  records: PriceCalibrationResult[];
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

function formatDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '--';
  }

  return date.toLocaleString(
    'pt-BR',
  );
}

export default function CalibrationHistoryCard({
  providerName,
  records,
}: Props) {
  const orderedRecords = [
    ...records,
  ].sort(
    (a, b) =>
      new Date(
        b.recordedAt,
      ).getTime() -
      new Date(
        a.recordedAt,
      ).getTime(),
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>
          📋 Histórico de calibração
        </Text>

        <Text style={styles.provider}>
          {providerName}
        </Text>

        {orderedRecords.length ===
        0 ? (
          <Text style={styles.empty}>
            Nenhuma observação
            registrada.
          </Text>
        ) : (
          orderedRecords.map(
            (record, index) => {
              const sampleNumber =
                orderedRecords.length -
                index;

              return (
                <View
                  key={`${record.recordedAt}-${index}`}
                  style={
                    styles.record
                  }
                >
                  <Text
                    style={
                      styles.sampleTitle
                    }
                  >
                    Amostra #
                    {sampleNumber}
                  </Text>

                  <Text
                    style={
                      styles.date
                    }
                  >
                    {formatDate(
                      record.recordedAt,
                    )}
                  </Text>

                  <View
                    style={styles.row}
                  >
                    <Text
                      style={
                        styles.label
                      }
                    >
                      CorridaX
                    </Text>

                    <Text
                      style={
                        styles.value
                      }
                    >
                      {formatCurrency(
                        record.estimatedPrice,
                      )}
                    </Text>
                  </View>

                  <View
                    style={styles.row}
                  >
                    <Text
                      style={
                        styles.label
                      }
                    >
                      Observado
                    </Text>

                    <Text
                      style={
                        styles.value
                      }
                    >
                      {formatCurrency(
                        record.observedPrice,
                      )}
                    </Text>
                  </View>

                  {record.promotionalPrice !==
                    undefined && (
                    <View
                      style={
                        styles.row
                      }
                    >
                      <Text
                        style={
                          styles.label
                        }
                      >
                        Promoção
                      </Text>

                      <Text
                        style={
                          styles.promotion
                        }
                      >
                        {formatCurrency(
                          record.promotionalPrice,
                        )}
                      </Text>
                    </View>
                  )}

                  <View
                    style={styles.row}
                  >
                    <Text
                      style={
                        styles.label
                      }
                    >
                      Erro absoluto
                    </Text>

                    <Text
                      style={
                        styles.value
                      }
                    >
                      {formatCurrency(
                        record.absoluteError,
                      )}
                    </Text>
                  </View>

                  <View
                    style={styles.row}
                  >
                    <Text
                      style={
                        styles.label
                      }
                    >
                      Erro %
                    </Text>

                    <Text
                      style={
                        styles.value
                      }
                    >
                      {record.percentageError.toFixed(
                        2,
                      )}
                      %
                    </Text>
                  </View>

                  <View
                    style={styles.row}
                  >
                    <Text
                      style={
                        styles.label
                      }
                    >
                      Direção
                    </Text>

                    <Text
                      style={[
                        styles.value,

                        record.direction ===
                        'above'
                          ? styles.above
                          : record.direction ===
                              'below'
                            ? styles.below
                            : styles.exact,
                      ]}
                    >
                      {record.direction ===
                      'above'
                        ? 'Acima'
                        : record.direction ===
                            'below'
                          ? 'Abaixo'
                          : 'Exato'}
                    </Text>
                  </View>

                  <View
                    style={styles.row}
                  >
                    <Text
                      style={
                        styles.label
                      }
                    >
                      Distância
                    </Text>

                    <Text
                      style={
                        styles.value
                      }
                    >
                      {record.distanceKm.toFixed(
                        1,
                      )}{' '}
                      km
                    </Text>
                  </View>

                  <View
                    style={styles.row}
                  >
                    <Text
                      style={
                        styles.label
                      }
                    >
                      Tempo
                    </Text>

                    <Text
                      style={
                        styles.value
                      }
                    >
                      {
                        record.durationMinutes
                      }{' '}
                      min
                    </Text>
                  </View>
                </View>
              );
            },
          )
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

    record: {
      marginTop: 18,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor:
        '#30445F',
    },

    sampleTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },

    date: {
      color: '#93A8C7',
      fontSize: 12,
      marginTop: 3,
      marginBottom: 12,
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
      fontSize: 14,
      fontWeight: 'bold',
    },

    promotion: {
      color: '#32D74B',
      fontSize: 14,
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
  });