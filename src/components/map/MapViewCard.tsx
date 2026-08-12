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
   * Quando a rota chegar,
   * enquadra todo o percurso
   * automaticamente no mapa.
   */
  useEffect(() => {
    if (
      route.length >= 2 &&
      mapRef.current
    ) {
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
    }
  }, [route]);

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

          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {origin && (
          <Marker
            coordinate={origin}
            title="Origem"
            description="Sua localização"
          />
        )}

        {destination && (
          <Marker
            coordinate={destination}
            title="Destino"
          />
        )}

        {route.length >= 2 && (
  <Polyline
    coordinates={route}
    strokeColor="#42A5F5"
    strokeWidth={6}
  />
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
  });