const appJson = require('./app.json');

module.exports = {
  ...appJson.expo,

  android: {
    ...appJson.expo.android,
    package: 'com.corridax.app',
  },

  plugins: [
    ...(appJson.expo.plugins ?? []),

    'expo-dev-client',

    [
      'react-native-maps',
      {
       androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
};
