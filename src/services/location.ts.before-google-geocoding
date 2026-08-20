import * as Location from 'expo-location';

export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export async function getCurrentLocation(): Promise<LocationData> {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Permissão negada.');
  }

  const currentLocation =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

  const reverse =
    await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

  const first = reverse[0];

  const address = [
    first.street,
    first.district,
    first.city,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    address:
      address || 'Localização encontrada',
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
  };
}