import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  title: string;
  value: string;
};

export default function DashboardCard({
  title,
  value,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#18263D',
    borderRadius: 16,
    padding: 18,
    margin: 5,
  },

  title: {
    color: '#A5B4C7',
    fontSize: 14,
  },

  value: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
});