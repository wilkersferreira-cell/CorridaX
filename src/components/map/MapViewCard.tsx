import React, {
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
  compact?: boolean;
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
  compact = false,
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

  const validUserLocation =
    isValidCoordinate(
      userLocation,
    );

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (
      validRoute.length >= 2
    ) {
      mapRef.current.fitToCoordinates(
        validRoute,
        {
          edgePadding: {
            top: 32,
            right: 32,
            bottom: 32,
            left: 32,
          },

          animated: true,
        },
      );

      return;
    }

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
            top: 36,
            right: 36,
            bottom: 36,
            left: 36,
          },

          animated: true,
        },
      );

      return;
    }

    if (validOrigin) {
      mapRef.current.animateToRegion(
        {
          latitude:
            validOrigin.latitude,

          longitude:
            validOrigin.longitude,

          latitudeDelta:
            compact
              ? 0.032
              : 0.025,

          longitudeDelta:
            compact
              ? 0.032
              : 0.025,
        },

        450,
      );
    }
  }, [
    validRoute,
    validOrigin,
    validDestination,
    compact,
  ]);

  function centerOnUser() {
    if (
      !mapRef.current ||
      !validUserLocation
    ) {
      return;
    }

    mapRef.current.animateToRegion(
      {
        latitude:
          userLocation.latitude,

        longitude:
          userLocation.longitude,

        latitudeDelta:
          0.025,

        longitudeDelta:
          0.025,
      },

      400,
    );
  }

  const initialLatitude =
    validUserLocation
      ? userLocation.latitude
      : -3.119;

  const initialLongitude =
    validUserLocation
      ? userLocation.longitude
      : -60.0217;

  return (
    <View
      style={[
        styles.container,

        compact &&
          styles.containerCompact,
      ]}
    >
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
        showsMyLocationButton={
          false
        }
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
              strokeWidth={5}
            />

            <Polyline
              coordinates={
                validRoute
              }
              strokeColor={
                COLORS.primaryLight
              }
              strokeWidth={3}
            />
          </>
        )}
      </MapView>

      <Pressable
        onPress={
          centerOnUser
        }
        disabled={
          !validUserLocation
        }
        style={({
          pressed,
        }) => [
          styles.locationButton,

          pressed &&
            styles.locationButtonPressed,

          !validUserLocation &&
            styles.locationButtonDisabled,
        ]}
      >
        <MaterialIcons
          name="my-location"
          size={22}
          color={
            COLORS.text
          }
        />
      </Pressable>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      height: 218,
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

    containerCompact: {
      height: 172,
    },

    map: {
      flex: 1,
    },

    locationButton: {
      position: 'absolute',
      top: 12,
      right: 12,

      width: 42,
      height: 42,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 14,

      borderWidth: 1,
      borderColor:
        COLORS.borderSoft,

      backgroundColor:
        'rgba(11, 24, 43, 0.92)',

      ...SHADOWS.sm,
    },

    locationButtonPressed: {
      opacity: 0.76,
    },

    locationButtonDisabled: {
      opacity: 0.45,
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
      width: 7,
      height: 7,

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.white,
    },
  });
