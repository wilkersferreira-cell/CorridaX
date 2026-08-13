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
            top: 35,
            right: 35,
            bottom: 35,
            left: 35,
          },

          animated: true,
        },
      );

      return;
    }

    /*
     * ORIGEM + DESTINO
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
            top: 40,
            right: 40,
            bottom: 40,
            left: 40,
          },

          animated: true,
        },
      );

      return;
    }

    /*
     * SOMENTE LOCALIZAÇÃO
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
            0.04,

          longitudeDelta:
            0.04,
        }}
        showsUserLocation
        showsMyLocationButton
        toolbarEnabled={false}
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
            <Polyline
              coordinates={route}
              strokeColor={
                COLORS.white
              }
              strokeWidth={7}
            />

            <Polyline
              coordinates={route}
              strokeColor={
                COLORS.primaryLight
              }
              strokeWidth={4}
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
      height: 240,

      borderRadius:
        RADIUS.xxl,

      overflow: 'hidden',

      borderWidth: 1,

      borderColor:
        COLORS.borderSoft,

      backgroundColor:
        COLORS.surfaceLight,

      ...SHADOWS.sm,
    },

    map: {
      flex: 1,
    },

    originMarkerOuter: {
      width: 22,
      height: 22,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.white,

      ...SHADOWS.sm,
    },

    originMarkerInner: {
      width: 13,
      height: 13,

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.primary,
    },

    destinationMarker: {
      width: 26,
      height: 26,

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
      width: 7,
      height: 7,

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.white,
    },
  });