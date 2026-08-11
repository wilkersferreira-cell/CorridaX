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
       androidGoogleMapsApiKey:'AIzaSyDGLw4lm4FD3E3B1bgsG09fSgQbqomuFrI',
      },
    ],
  ],
};
