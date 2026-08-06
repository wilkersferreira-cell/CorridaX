import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

type Props = {
  recommendation: string;
};

export default function AIRecommendationCard({
  recommendation,
}: Props) {
  if (!recommendation) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>
          🤖 IA CorridaX
        </Text>

        <Text style={styles.text}>
          {recommendation}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 18,
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: '#102840',
  },

  title: {
    color: '#32D74B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
  },
});