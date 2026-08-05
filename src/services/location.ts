import * as Location from 'expo-location';

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Permissão de localização negada.');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const address = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    address:
      address.length > 0
        ? `${address[0].street ?? ''}, ${address[0].name ?? ''} - ${address[0].city ?? ''}`
        : 'Localização não encontrada',
  };
}