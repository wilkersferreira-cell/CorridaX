import React, {
  useEffect,
  useMemo,
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

function isValidCoordinate(
  coordinate?: Coordinate,
): coordinate is Coordinate {
  if (!coordinate) {
    return false;
  }

  const {
    latitude,
    longitude,
  } = coordinate;

  return (
    Number.isFinite(
      latitude,
    ) &&
    Number.isFinite(
      longitude,
    ) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(
      latitude === 0 &&
      longitude === 0
    )
  );
}

export default function MapViewCard({
  userLocation,
  origin,
  destination,
  route = [],
}: Props) {
  const mapRef =
    useRef<MapView>(null);

  const validOrigin =
    isValidCoordinate(
      origin,
    )
      ? origin
      : undefined;

  const validDestination =
    isValidCoordinate(
      destination,
    )
      ? destination
      : undefined;

  const validRoute =
    useMemo(
      () =>
        route.filter(
          isValidCoordinate,
        ),
      [
        route,
      ],
    );

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    /*
     * ROTA CALCULADA
     */
    if (
      validRoute.length >= 2
    ) {
      mapRef.current.fitToCoordinates(
        validRoute,
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
      validOrigin &&
      validDestination
    ) {
      mapRef.current.fitToCoordinates(
        [
          validOrigin,
          validDestination,
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
    if (validOrigin) {
      mapRef.current.animateToRegion(
        {
          latitude:
            validOrigin.latitude,

          longitude:
            validOrigin.longitude,

          latitudeDelta:
            0.025,

          longitudeDelta:
            0.025,
        },

        500,
      );
    }
  }, [
    validRoute,
    validOrigin,
    validDestination,
  ]);

  const validUserLocation =
    isValidCoordinate(
      userLocation,
    );

  const initialLatitude =
    validUserLocation
      ? userLocation.latitude
      : -3.119;

  const initialLongitude =
    validUserLocation
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
        {validOrigin && (
          <Marker
            coordinate={
              validOrigin
            }
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

        {validDestination && (
          <Marker
            coordinate={
              validDestination
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

        {validRoute.length >= 2 && (
          <>
            <Polyline
              coordinates={
                validRoute
              }
              strokeColor={
                COLORS.white
              }
              strokeWidth={4}
            />

            <Polyline
              coordinates={
                validRoute
              }
              strokeColor={
                COLORS.primaryLight
              }
              strokeWidth={2}
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
      height: 252,

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
