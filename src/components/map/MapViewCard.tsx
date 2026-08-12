import React, {
  useEffect,
  useRef,
} from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import MapView, {
  Marker,
  Polyline,
} from 'react-native-maps';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
} from '../../theme';

export type Coordinate = {
  latitude: number;
  longitude: number;
};

type Props = {
  userLocation: Coordinate;
  origin?: Coordinate;
  destination?: Coordinate;
  route?: Coordinate[];
};

export default function MapViewCard({
  userLocation,
  origin,
  destination,
  route = [],
}: Props) {
  const mapRef =
    useRef<MapView>(null);

  /*
   * Controle inteligente da câmera.
   *
   * 1. Se existir rota:
   *    mostra o trajeto completo.
   *
   * 2. Se ainda não existir rota:
   *    mostra origem + destino.
   */
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    /*
     * ROTA CALCULADA
     */
    if (route.length >= 2) {
      mapRef.current.fitToCoordinates(
        route,
        {
          edgePadding: {
            top: 60,
            right: 50,
            bottom: 60,
            left: 50,
          },

          animated: true,
        },
      );

      return;
    }

    /*
     * PRÉ-VISUALIZAÇÃO
     *
     * Assim que o destino é
     * selecionado, mostramos
     * origem + destino.
     */
    if (
      origin &&
      destination
    ) {
      mapRef.current.fitToCoordinates(
        [
          origin,
          destination,
        ],
        {
          edgePadding: {
            top: 70,
            right: 55,
            bottom: 70,
            left: 55,
          },

          animated: true,
        },
      );

      return;
    }

    /*
     * SOMENTE ORIGEM
     */
    if (origin) {
      mapRef.current.animateToRegion(
        {
          latitude:
            origin.latitude,

          longitude:
            origin.longitude,

          latitudeDelta:
            0.025,

          longitudeDelta:
            0.025,
        },

        500,
      );
    }
  }, [
    route,
    origin,
    destination,
  ]);

  const initialLatitude =
    Number.isFinite(
      userLocation.latitude,
    )
      ? userLocation.latitude
      : -3.119;

  const initialLongitude =
    Number.isFinite(
      userLocation.longitude,
    )
      ? userLocation.longitude
      : -60.0217;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude:
            initialLatitude,

          longitude:
            initialLongitude,

          latitudeDelta:
            0.05,

          longitudeDelta:
            0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {origin && (
          <Marker
            coordinate={origin}
            title="Origem"
            description="Sua localização"
            anchor={{
              x: 0.5,
              y: 0.5,
            }}
          >
            <View
              style={
                styles.originMarkerOuter
              }
            >
              <View
                style={
                  styles.originMarkerInner
                }
              />
            </View>
          </Marker>
        )}

        {destination && (
          <Marker
            coordinate={
              destination
            }
            title="Destino"
            anchor={{
              x: 0.5,
              y: 0.5,
            }}
          >
            <View
              style={
                styles.destinationMarker
              }
            >
              <View
                style={
                  styles.destinationMarkerInner
                }
              />
            </View>
          </Marker>
        )}

        {route.length >= 2 && (
          <>
            {/*
             * CONTORNO
             */}
            <Polyline
              coordinates={route}
              strokeColor={
                COLORS.white
              }
              strokeWidth={8}
            />

            {/*
             * ROTA CORRIDAX
             */}
            <Polyline
              coordinates={route}
              strokeColor={
                COLORS.primaryLight
              }
              strokeWidth={5}
            />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      height: 320,

      marginBottom:
        SPACING.xl,

      borderRadius:
        RADIUS.xxl,

      overflow: 'hidden',

      borderWidth: 1,

      borderColor:
        COLORS.borderSoft,

      backgroundColor:
        COLORS.surfaceLight,

      ...SHADOWS.md,
    },

    map: {
      flex: 1,
    },

    /*
     * ORIGEM
     */
    originMarkerOuter: {
      width: 24,
      height: 24,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.white,

      ...SHADOWS.sm,
    },

    originMarkerInner: {
      width: 14,
      height: 14,

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.primary,
    },

    /*
     * DESTINO
     */
    destinationMarker: {
      width: 28,
      height: 28,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius:
        RADIUS.round,

      borderWidth: 3,

      borderColor:
        COLORS.white,

      backgroundColor:
        COLORS.success,

      ...SHADOWS.sm,
    },

    destinationMarkerInner: {
      width: 8,
      height: 8,

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.white,
    },
  });