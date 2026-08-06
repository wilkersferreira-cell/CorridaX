import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { openRideApp } from '../services/deepLinks';

type Props = {
  nome: string;
  preco: string;
  tempo?: string;
  distancia?: string;
  economia?: string;
  score?: number;
  destaque?: boolean;
};

export default function RideCard({
  nome,
  preco,
  tempo,
  distancia,
  economia,
  score,
  destaque = false,
}: Props) {
  const normalizedName = nome.toLowerCase();

  function getAppData() {
    if (normalizedName.includes('uber')) {
      return {
        id: 'uber' as const,
        buttonLabel: 'Abrir Uber',
        symbol: 'U',
      };
    }

    if (normalizedName.includes('99')) {
      return {
        id: '99' as const,
        buttonLabel: 'Abrir 99',
        symbol: '99',
      };
    }

    return {
      id: 'indrive' as const,
      buttonLabel: 'Abrir inDrive',
      symbol: 'iD',
    };
  }

  const app = getAppData();

  async function handleOpenApp() {
    await openRideApp(app.id);
  }

  const hasSaving =
    economia !== undefined &&
    economia !== 'R$ 0.00' &&
    economia !== 'R$ 0,00';

  return (
    <Card
      style={[
        styles.card,
        destaque && styles.bestCard,
      ]}
    >
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.appSymbol}>
            <Text style={styles.appSymbolText}>
              {app.symbol}
            </Text>
          </View>

          <Text style={styles.name}>
            {nome}
          </Text>
        </View>

        <Text style={styles.price}>
          {preco}
        </Text>

        <View style={styles.infoRow}>
          {tempo && (
            <Text style={styles.info}>
              ⏱️ {tempo}
            </Text>
          )}

          {distancia && (
            <Text style={styles.info}>
              📏 {distancia}
            </Text>
          )}
        </View>

        {hasSaving && (
          <Text style={styles.saving}>
            💸 Economize {economia}
          </Text>
        )}

        {score !== undefined && (
          <Text style={styles.score}>
            ⭐ Score CorridaX: {score}
          </Text>
        )}

        {destaque && (
          <Text style={styles.badge}>
            🏆 Melhor custo-benefício
          </Text>
        )}

        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={handleOpenApp}
        >
          {app.buttonLabel}
        </Button>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  appSymbol: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#263B59',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  appSymbolText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  price: {
    color: '#32D74B',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 12,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  info: {
    color: '#DDDDDD',
    fontSize: 15,
  },

  saving: {
    marginTop: 10,
    color: '#FFD54F',
    fontWeight: 'bold',
    fontSize: 15,
  },

  score: {
    marginTop: 7,
    color: '#64B5F6',
    fontWeight: 'bold',
    fontSize: 15,
  },

  badge: {
    marginTop: 10,
    color: '#32D74B',
    fontWeight: 'bold',
    fontSize: 16,
  },

  button: {
    marginTop: 16,
    borderRadius: 12,
  },

  buttonContent: {
    height: 48,
  },
});