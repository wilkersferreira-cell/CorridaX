import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import MapView from 'react-native-maps';

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
  userLocation: _userLocation,
  origin: _origin,
  destination: _destination,
  route: _route = [],
}: Props) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -3.119,
          longitude: -60.0217,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
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