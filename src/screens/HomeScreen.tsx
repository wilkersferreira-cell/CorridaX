import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import MapViewCard from '../components/MapViewCard';
import LocationInput from '../components/LocationInput';
import CompareButton from '../components/CompareButton';
import RideCard from '../components/RideCard';
import AddressSuggestions from '../components/AddressSuggestions';

import useLocation from '../hooks/useLocation';
import useRideComparison from '../hooks/useRideComparison';

import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';

export default function HomeScreen() {
  const {
    loading,
    address,
    latitude,
    longitude,
  } = useLocation();

  const {
    rides,
    loading: loadingCompare,
    compare,
    suggestions,
    search,
    setSuggestions,
  } = useRideComparison();

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');

  useEffect(() => {
    if (address && origem === '') {
      setOrigem(address);
    }
  }, [address]);

  async function compararCorridas() {
    if (!origem.trim()) {
      Alert.alert(
        'Origem',
        'Informe a origem.',
      );
      return;
    }

    if (!destino.trim()) {
      Alert.alert(
        'Destino',
        'Informe o destino.',
      );
      return;
    }

    try {
      await compare(origem, destino);
    } catch (e: any) {
      Alert.alert(
        'Erro',
        e.message ?? 'Erro ao comparar.',
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Header />

      <View style={styles.dashboard}>
        <DashboardCard
          title="Local"
          value={loading ? 'Obtendo...' : 'Online'}
        />

        <DashboardCard
          title="GPS"
          value={loading ? '--' : 'OK'}
        />
      </View>

      {!loading && (
        <MapViewCard
          latitude={latitude}
          longitude={longitude}
        />
      )}

      <LocationInput
        label="Origem"
        value={origem}
        onChangeText={(text) => {
          setOrigem(text);
          search(text);
        }}
        icon="map-marker"
      />

      <AddressSuggestions
        data={suggestions}
        onSelect={(item) => {
          setOrigem(item.display_name);
          setSuggestions([]);
        }}
      />

      <LocationInput
        label="Destino"
        value={destino}
        onChangeText={setDestino}
        icon="flag-checkered"
      />

      <CompareButton
        onPress={compararCorridas}
        loading={loadingCompare}
      />

      {rides.map((ride) => (
        <RideCard
          key={ride.id}
          nome={
            ride.destaque
              ? `🏆 ${ride.nome}`
              : ride.nome
          }
          preco={`R$ ${ride.preco.toFixed(2)}`}
          tempo={`${ride.tempo} min`}
          destaque={ride.destaque}
        />
      ))}
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});