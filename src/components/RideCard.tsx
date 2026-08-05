import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

type Props = {
  nome: string;
  preco: string;
  tempo?: string;
  destaque?: boolean;
};

export default function RideCard({
  nome,
  preco,
  tempo,
  destaque = false,
}: Props) {
  return (
    <Card
      style={[
        styles.card,
        destaque && styles.bestCard,
      ]}
    >
      <Card.Content>

        <Text style={styles.name}>
          {nome}
        </Text>

        <Text style={styles.price}>
          {preco}
        </Text>

        {tempo && (
          <Text style={styles.time}>
            ⏱️ {tempo}
          </Text>
        )}

        {destaque && (
          <Text style={styles.badge}>
            🏆 Recomendado pelo CorridaX
          </Text>
        )}

      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: '#18263D',
  },

  bestCard: {
    borderWidth: 2,
    borderColor: '#32D74B',
  },

  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  price: {
    color: '#32D74B',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },

  time: {
    color: '#CCCCCC',
    marginTop: 6,
    fontSize: 15,
  },

  badge: {
    marginTop: 12,
    color: '#32D74B',
    fontWeight: 'bold',
  },
});