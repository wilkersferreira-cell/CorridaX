import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import AddressSuggestions from '../components/inputs/AddressSuggestions';
import AIRecommendationCard from '../components/cards/AIRecommendationCard';
import CalibrationCard from '../components/cards/CalibrationCard';
import CalibrationHistoryCard from '../components/cards/CalibrationHistoryCard';
import CalibrationMetricsCard from '../components/cards/CalibrationMetricsCard';
import CompareButton from '../components/buttons/CompareButton';
import ComparisonModeSelector from '../components/inputs/ComparisonModeSelector';
import CurrentLocationCard from '../components/cards/CurrentLocationCard';
import DashboardCard from '../components/cards/DashboardCard';
import DecisionSummaryCard from '../components/cards/DecisionSummaryCard';
import Header from '../components/layout/Header';
import LocationInput from '../components/inputs/LocationInput';
import MapViewCard from '../components/map/MapViewCard';
import RideCard from '../components/cards/RideCard';
import SavingsSummaryCard from '../components/cards/SavingsSummaryCard';

import useCalibrationMetrics from '../hooks/useCalibrationMetrics';
import useLocation from '../hooks/useLocation';
import useRideComparison from '../hooks/useRideComparison';

import { chooseBestRide } from '../services/ai';

import {
  COLORS,
  SPACING,
} from '../theme';

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
    comparisonMode,
    setComparisonMode,
  } = useRideComparison();

  const {
    metrics: uberMetrics,
    records: uberRecords,
    refresh: refreshUberMetrics,
  } = useCalibrationMetrics('uber');

  const [origem, setOrigem] =
    useState('');

  const [destino, setDestino] =
    useState('');

  useEffect(() => {
    if (address && !origem) {
      setOrigem(address);
    }
  }, [address, origem]);

  const recommendation =
    useMemo(() => {
      if (rides.length === 0) {
        return null;
      }

      return chooseBestRide(rides);
    }, [rides]);

  const savingSummary =
    useMemo(() => {
      if (!recommendation) {
        return null;
      }

      return {
        appName:
          recommendation.melhor.nome,

        amount:
          recommendation.melhor
            .economia,
      };
    }, [recommendation]);

  const dashboardData =
    useMemo(() => {
      const bestRide =
        recommendation?.melhor;

      return {
        location: loading
          ? 'Obtendo...'
          : 'Ativa',

        saving: bestRide
          ? bestRide.economia.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              },
            )
          : 'R$ 0,00',

        bestApp:
          bestRide?.nome ?? '--',

        estimatedTime: bestRide
          ? `${bestRide.tempo} min`
          : '--',
      };
    }, [
      loading,
      recommendation,
    ]);

  const uberRide =
    useMemo(() => {
      return rides.find(
        (ride) =>
          ride.id === 'uber' ||
          ride.nome
            .toLowerCase()
            .includes('uber'),
      );
    }, [rides]);

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
      await compare(
        origem,
        destino,
      );

      setSuggestions([]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível comparar as corridas.';

      Alert.alert(
        'Erro',
        message,
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >
      <Header />

      <View style={styles.dashboard}>
        <View
          style={
            styles.dashboardRow
          }
        >
          <DashboardCard
            icon="📍"
            title="Localização"
            value={
              dashboardData.location
            }
            color={COLORS.success}
          />

          <DashboardCard
            icon="💰"
            title="Economia"
            value={
              dashboardData.saving
            }
            color={COLORS.success}
          />
        </View>

        <View
          style={
            styles.dashboardRow
          }
        >
          <DashboardCard
            icon="🚖"
            title="Melhor opção"
            value={
              dashboardData.bestApp
            }
            color={COLORS.info}
          />

          <DashboardCard
            icon="⏱️"
            title="Tempo"
            value={
              dashboardData
                .estimatedTime
            }
            color={COLORS.warning}
          />
        </View>
      </View>

      {!loading && (
        <MapViewCard
          userLocation={{
            latitude,
            longitude,
          }}
          origin={origin}
          destination={
            destination
          }
          route={routeCoordinates}
        />
      )}

      <CurrentLocationCard
        address={address}
        loading={loading}
      />

      <LocationInput
        label="Origem"
        value={
          origem
            ? 'Minha localização'
            : ''
        }
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
          setDestino(
            item.display_name,
          );

          setSuggestions([]);
        }}
      />

      <ComparisonModeSelector
        value={comparisonMode}
        onChange={
          setComparisonMode
        }
      />

      <CompareButton
        onPress={compararCorridas}
        loading={loadingCompare}
      />

      {recommendation && (
        <DecisionSummaryCard
          melhor={
            recommendation.melhor
          }
          maisBarata={
            recommendation.maisBarata
          }
          maisRapida={
            recommendation.maisRapida
          }
        />
      )}

      {savingSummary && (
        <SavingsSummaryCard
          appName={
            savingSummary.appName
          }
          amount={
            savingSummary.amount
          }
        />
      )}

      {recommendation && (
        <AIRecommendationCard
          recommendation={
            recommendation.motivo
          }
        />
      )}

      {rides.map((ride) => (
        <RideCard
          key={ride.id}
          nome={ride.nome}
          preco={ride.preco.toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          )}
          tempo={`${ride.tempo} min`}
          distancia={`${ride.distancia.toFixed(
            1,
          )} km`}
          economia={ride.economia.toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            },
          )}
          score={ride.score}
          destaque={ride.destaque}
          origin={
            origin
              ? {
                  latitude:
                    origin.latitude,
                  longitude:
                    origin.longitude,
                  address: origem,
                }
              : undefined
          }
          destination={
            destination
              ? {
                  latitude:
                    destination.latitude,
                  longitude:
                    destination.longitude,
                  address: destino,
                }
              : undefined
          }
        />
      ))}

      {uberRide && (
        <>
          <CalibrationCard
            provider="uber"
            providerName="Uber"
            estimatedPrice={
              uberRide.preco
            }
            distanceKm={
              uberRide.distancia
            }
            durationMinutes={
              uberRide.tempo
            }
            onSaved={
              refreshUberMetrics
            }
          />

          <CalibrationMetricsCard
            providerName="Uber"
            metrics={uberMetrics}
          />

          <CalibrationHistoryCard
            providerName="Uber"
            records={uberRecords}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    content: {
      padding: SPACING.lg,
      paddingBottom: 44,
    },

    dashboard: {
      marginBottom: SPACING.xl,
    },

    dashboardRow: {
      flexDirection: 'row',
    },
  });