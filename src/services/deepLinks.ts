import { Alert, Linking } from 'react-native';

export async function openRideApp(
  app: 'uber' | '99' | 'indrive',
) {
  try {
    let url = '';

    switch (app) {
      case 'uber':
        url = 'uber://';
        break;

      case '99':
        url = '99://';
        break;

      case 'indrive':
        url = 'indrive://';
        break;
    }

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
      return;
    }

    switch (app) {
      case 'uber':
        await Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.ubercab',
        );
        break;

      case '99':
        await Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.taxis99',
        );
        break;

      case 'indrive':
        await Linking.openURL(
          'https://play.google.com/store/apps/details?id=sinet.startup.inDriver',
        );
        break;
    }
  } catch {
    Alert.alert(
      'Erro',
      'Não foi possível abrir o aplicativo.',
    );
  }
}