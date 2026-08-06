import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import AddressSuggestions from '../components/AddressSuggestions';
import AIRecommendationCard from '../components/AIRecommendationCard';
import CompareButton from '../components/CompareButton';
import CurrentLocationCard from '../components/CurrentLocationCard';
import DashboardCard from '../components/DashboardCard';
import Header from '../components/Header';
import LocationInput from '../components/LocationInput';
import MapViewCard from '../components/MapViewCard';
import RideCard from '../components/RideCard';
import SavingsSummaryCard from '../components/SavingsSummaryCard';

import useLocation from '../hooks/useLocation';
import useRideComparison from '../hooks/useRideComparison';

import { chooseBestRide } from '../services/ai';

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
    origin,
    destination,
    routeCoordinates,
  } = useRideComparison();

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');

  useEffect(() => {
    if (address && !origem) {
      setOrigem(address);
    }
  }, [address, origem]);

  const recommendation = useMemo(() => {
    if (rides.length === 0) {
      return null;
    }

    return chooseBestRide(rides);
  }, [rides]);

  const savingSummary = useMemo(() => {
    if (!recommendation) {
      return null;
    }

    return {
      appName: recommendation.melhor.nome,
      amount: recommendation.melhor.economia,
    };
  }, [recommendation]);

  async function compararCorridas() {
    if (!origem.trim()) {
      Alert.alert(
        'Origem',
        'Não foi possível identificar sua localização.',
      );
      return;
    }

    if (!destino.trim()) {
      Alert.alert(
        'Destino',
        'Informe o destino da corrida.',
      );
      return;
    }

    try {
      await compare(origem, destino);
      setSuggestions([]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível comparar as corridas.';

      Alert.alert('Erro', message);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
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
          userLocation={{
            latitude,
            longitude,
          }}
          origin={origin}
          destination={destination}
          route={routeCoordinates}
        />
      )}

      <CurrentLocationCard
        address={address}
        loading={loading}
      />

      <LocationInput
        label="Origem"
        value={origem ? 'Minha localização' : ''}
        onChangeText={() => {}}
        icon="crosshairs-gps"
        editable={false}
      />

      <LocationInput
        label="Destino"
        value={destino}
        onChangeText={(text) => {
          setDestino(text);
          search(text);
        }}
        icon="flag-checkered"
      />

      <AddressSuggestions
        data={suggestions}
        onSelect={(item) => {
          setDestino(item.display_name);
          setSuggestions([]);
        }}
      />

      <CompareButton
        onPress={compararCorridas}
        loading={loadingCompare}
      />

      {savingSummary && (
        <SavingsSummaryCard
          appName={savingSummary.appName}
          amount={savingSummary.amount}
        />
      )}

      {recommendation && (
        <AIRecommendationCard
          recommendation={recommendation.motivo}
        />
      )}

      {rides.map((ride) => (
        <RideCard
          key={ride.id}
          nome={ride.nome}
          preco={`R$ ${ride.preco.toFixed(2)}`}
          tempo={`${ride.tempo} min`}
          distancia={`${ride.distancia.toFixed(1)} km`}
          economia={`R$ ${ride.economia.toFixed(2)}`}
          score={ride.score}
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
    paddingBottom: 44,
  },

  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});