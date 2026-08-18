const appJson = require('./app.json');

module.exports = {
  ...appJson.expo,

  android: {
    ...appJson.expo.android,

    package: 'com.corridax.app',

    googleServicesFile:
      './google-services.json',
  },

  plugins: [
    ...(appJson.expo.plugins ?? []),

    'expo-dev-client',

    'expo-font',

    '@react-native-firebase/app',

    '@react-native-firebase/auth',

    [
      'react-native-maps',
      {
        androidGoogleMapsApiKey:
          process.env
            .EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
};