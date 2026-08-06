import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  appName: string;
  amount: number;
};

export default function SavingsSummaryCard({
  appName,
  amount,
}: Props) {
  if (amount <= 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Você pode economizar
      </Text>

      <Text style={styles.amount}>
        R$ {amount.toFixed(2)}
      </Text>

      <Text style={styles.description}>
        escolhendo {appName} nesta viagem
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#143521',
    borderWidth: 1,
    borderColor: '#32D74B',
    borderRadius: 18,
    padding: 18,
    marginTop: 4,
    marginBottom: 14,
  },

  label: {
    color: '#C4EBCB',
    fontSize: 15,
  },

  amount: {
    color: '#32D74B',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },

  description: {
    color: '#FFFFFF',
    fontSize: 15,
    marginTop: 5,
  },
});