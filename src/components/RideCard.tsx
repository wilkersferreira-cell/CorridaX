import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

type Props = {
  nome: string;
  preco: string;
  destaque?: boolean;
};

export default function RideCard({
  nome,
  preco,
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

        <Text
          variant="titleMedium"
          style={styles.name}
        >
          {nome}
        </Text>

        <Text
          variant="headlineSmall"
          style={styles.price}
        >
          {preco}
        </Text>

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
    borderRadius: 16,
  },

  bestCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },

  name: {
    fontWeight: 'bold',
  },

  price: {
    marginTop: 6,
  },

  badge: {
    marginTop: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },

});