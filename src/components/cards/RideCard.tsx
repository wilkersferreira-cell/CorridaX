import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Button,
  Card,
  Text,
} from 'react-native-paper';

import {
  openRideApp,
  RideLocation,
} from '../../services/deepLinks';

type Props = {
  nome: string;
  preco: string;
  tempo?: string;
  distancia?: string;
  economia?: string;
  score?: number;
  destaque?: boolean;

  origin?: RideLocation;
  destination?: RideLocation;
};

export default function RideCard({
  nome,
  preco,
  tempo,
  distancia,
  economia,
  score,
  destaque = false,
  origin,
  destination,
}: Props) {
  const normalizedName =
    nome.toLowerCase();

  function getAppData() {
    if (
      normalizedName.includes(
        'uber',
      )
    ) {
      return {
        id: 'uber' as const,
        buttonLabel: 'Abrir Uber',
        type: 'uber',
      };
    }

    if (
      normalizedName.includes('99')
    ) {
      return {
        id: '99' as const,
        buttonLabel: 'Abrir 99',
        type: '99',
      };
    }

    return {
      id: 'indrive' as const,
      buttonLabel: 'Abrir inDrive',
      type: 'indrive',
    };
  }

  const app = getAppData();

  async function handleOpenApp() {
    await openRideApp(
      app.id,
      {
        origin,
        destination,
      },
    );
  }

  function Logo() {
    switch (app.type) {
      case '99':
        return (
          <View style={styles.logo99}>
            <Text
              style={
                styles.logo99Text
              }
            >
              99
            </Text>
          </View>
        );

      case 'uber':
        return (
          <View
            style={styles.logoUber}
          >
            <Text
              style={
                styles.logoUberText
              }
            >
              Uber
            </Text>
          </View>
        );

      default:
        return (
          <View
            style={
              styles.logoIndrive
            }
          >
            <Text
              style={
                styles.logoIndriveText
              }
            >
              iD
            </Text>
          </View>
        );
    }
  }

  return (
    <Card
      style={[
        styles.card,
        destaque &&
          styles.bestCard,
      ]}
    >
      <Card.Content>
        <View style={styles.header}>
          <Logo />

          <View style={styles.details}>
            <Text style={styles.name}>
              {nome}
            </Text>

            <Text style={styles.price}>
              {preco}
            </Text>
          </View>
        </View>

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

        {!!economia &&
          economia !== 'R$ 0.00' &&
          economia !== 'R$ 0,00' && (
            <Text
              style={styles.saving}
            >
              💸 Economize{' '}
              {economia}
            </Text>
          )}

        {score !== undefined && (
          <Text style={styles.score}>
            ⭐ Score CorridaX:{' '}
            {score}
          </Text>
        )}

        {destaque && (
          <Text style={styles.badge}>
            🏆 Melhor
            custo-benefício
          </Text>
        )}

        <Button
          mode="contained"
          style={styles.button}
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
    borderRadius: 22,
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

  details: {
    flex: 1,
  },

  logo99: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  logo99Text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },

  logoUber: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  logoUberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },

  logoIndrive: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#B8FF1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  logoIndriveText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 24,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  price: {
    color: '#32D74B',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 4,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginTop: 16,
  },

  info: {
    color: '#DDDDDD',
    fontSize: 15,
  },

  saving: {
    marginTop: 10,
    color: '#FFD54F',
    fontWeight: 'bold',
  },

  score: {
    marginTop: 6,
    color: '#64B5F6',
    fontWeight: 'bold',
  },

  badge: {
    marginTop: 8,
    color: '#32D74B',
    fontWeight: 'bold',
  },

  button: {
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: '#1565C0',
  },
});