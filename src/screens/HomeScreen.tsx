import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import RideCard from '../components/RideCard';
import LocationCard from '../components/LocationCard';
import LocationInput from '../components/LocationInput';

import { getCurrentLocation } from '../services/location';

import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';

export default function HomeScreen() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');

  const [address, setAddress] = useState('Obtendo localização...');
  const [loading, setLoading] = useState(true);

  const [economia] = useState('R$ 0,00');
  const [corridas] = useState('0');

  useEffect(() => {
    async function carregarLocalizacao() {
      try {
        const dados = await getCurrentLocation();

        setAddress(dados.address);
        setOrigem(dados.address);
      } catch {
        setAddress('Não foi possível obter sua localização.');
      } finally {
        setLoading(false);
      }
    }

    carregarLocalizacao();
  }, []);

  function compararCorridas() {
    console.log('Comparar Corridas');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      <View style={styles.dashboard}>

        <DashboardCard
          title="Economia"
          value={economia}
        />

        <DashboardCard
          title="Corridas"
          value={corridas}
        />

      </View>

      <LocationCard
        loading={loading}
        address={address}
      />

      <LocationInput
        label="Origem"
        value={origem}
        onChangeText={setOrigem}
        icon="map-marker"
      />

      <LocationInput
        label="Destino"
        value={destino}
        onChangeText={setDestino}
        icon="flag-checkered"
      />

      <Button
        mode="contained"
        style={styles.button}
        contentStyle={styles.buttonContent}
        onPress={compararCorridas}
      >
        Comparar Corridas
      </Button>

      <RideCard
        nome="🏆 99 (Melhor opção)"
        preco="R$ 18,40"
        destaque
      />

      <RideCard
        nome="🚗 Uber"
        preco="R$ 20,80"
      />

      <RideCard
        nome="🟢 inDrive"
        preco="Negociar"
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },

  dashboard: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  button: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 14,
  },

  buttonContent: {
    height: 56,
  },
});