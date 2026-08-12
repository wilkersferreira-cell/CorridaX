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
import LearningProgressCard from '../components/cards/LearningProgressCard';
import MapViewCard from '../components/map/MapViewCard';
import RideCard from '../components/cards/RideCard';
import RouteComparisonCard from '../components/cards/RouteComparisonCard';
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
    selectDestination,
    clearSelectedDestination,
    setGpsOrigin,
    origin,
    destination,
    routeCoordinates,
    comparisonMode,
    setComparisonMode,
    routeComparison,
  } = useRideComparison();

  const {
    metrics: uberMetrics,
    records: uberRecords,
    refresh: refreshUberMetrics,
  } = useCalibrationMetrics('uber');

  const {
    metrics: app99Metrics,
    records: app99Records,
    refresh: refreshApp99Metrics,
  } = useCalibrationMetrics('99');

  const {
    metrics: inDriveMetrics,
    records: inDriveRecords,
    refresh: refreshInDriveMetrics,
  } = useCalibrationMetrics('indrive');

  const [origem, setOrigem] =
    useState('');

  const [destino, setDestino] =
    useState('');

  /*
   * Preenche o campo de origem
   * quando o endereço do GPS
   * estiver disponível.
   */
  useEffect(() => {
    if (address && !origem) {
      setOrigem(address);
    }
  }, [address, origem]);

  /*
   * Sincroniza as coordenadas
   * reais do GPS com o mapa.
   *
   * IMPORTANTE:
   * setGpsOrigin não entra nas
   * dependências para evitar
   * loop de renderização.
   */
  useEffect(() => {
    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      !(
        latitude === 0 &&
        longitude === 0
      )
    ) {
      setGpsOrigin(
        latitude,
        longitude,
      );
    }
  }, [
    latitude,
    longitude,
  ]);

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

  const app99Ride =
    useMemo(() => {
      return rides.find(
        (ride) =>
          ride.id === '99' ||
          ride.nome
            .toLowerCase()
            .includes('99'),
      );
    }, [rides]);

  const inDriveRide =
    useMemo(() => {
      return rides.find(
        (ride) =>
          ride.id === 'indrive' ||
          ride.nome
            .toLowerCase()
            .includes('indrive'),
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
        latitude,
        longitude,
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

          clearSelectedDestination();

          search(
            text,
            latitude,
            longitude,
          );
        }}
        icon="flag-checkered"
      />

      <AddressSuggestions
        data={suggestions}
        onSelect={async (item) => {
          try {
            const selected =
              await selectDestination(
                item,
              );

            setDestino(
              selected.displayName,
            );

            setSuggestions([]);
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : 'Não foi possível selecionar o destino.';

            Alert.alert(
              'Destino',
              message,
            );
          }
        }}
      />

      <ComparisonModeSelector
        value={comparisonMode}
        onChange={setComparisonMode}
      />

      <CompareButton
        onPress={compararCorridas}
        loading={loadingCompare}
      />

      {routeComparison && (
        <RouteComparisonCard
          result={routeComparison}
        />
      )}

      <LearningProgressCard
        providers={[
          {
            name: 'Uber',
            samples:
              uberMetrics.sampleCount,
          },
          {
            name: '99',
            samples:
              app99Metrics.sampleCount,
          },
          {
            name: 'inDrive',
            samples:
              inDriveMetrics.sampleCount,
          },
        ]}
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

                  address:
                    origem,
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

                  address:
                    destino,
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

      {app99Ride && (
        <>
          <CalibrationCard
            provider="99"
            providerName="99"
            estimatedPrice={
              app99Ride.preco
            }
            distanceKm={
              app99Ride.distancia
            }
            durationMinutes={
              app99Ride.tempo
            }
            onSaved={
              refreshApp99Metrics
            }
          />

          <CalibrationMetricsCard
            providerName="99"
            metrics={app99Metrics}
          />

          <CalibrationHistoryCard
            providerName="99"
            records={app99Records}
          />
        </>
      )}

      {inDriveRide && (
        <>
          <CalibrationCard
            provider="indrive"
            providerName="inDrive"
            estimatedPrice={
              inDriveRide.preco
            }
            distanceKm={
              inDriveRide.distancia
            }
            durationMinutes={
              inDriveRide.tempo
            }
            onSaved={
              refreshInDriveMetrics
            }
          />

          <CalibrationMetricsCard
            providerName="inDrive"
            metrics={inDriveMetrics}
          />

          <CalibrationHistoryCard
            providerName="inDrive"
            records={inDriveRecords}
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
      padding:
        SPACING.lg,

      paddingBottom:
        44,
    },

    dashboard: {
      marginBottom:
        SPACING.xl,
    },

    dashboardRow: {
      flexDirection:
        'row',
    },
  });