import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

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
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const payload = {
      userLocation,
      origin,
      destination,
      route,
    };

    webViewRef.current?.postMessage(
      JSON.stringify(payload),
    );
  }, [
    userLocation,
    origin,
    destination,
    route,
  ]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={require('../../../assets/map/map.html')}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },

  map: {
    flex: 1,
  },
});