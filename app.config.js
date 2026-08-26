module.exports = ({ config }) => ({
  ...config,

  android: {
    ...config.android,

    package: 'com.corridax.app',

    googleServicesFile:
      './google-services.json',

    blockedPermissions: [
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ],
  },

  plugins: [
    ...(config.plugins ?? []),

    'expo-dev-client',

    'expo-font',

    '@react-native-firebase/app',

    '@react-native-firebase/auth',

    '@react-native-google-signin/google-signin',

    [
      'react-native-maps',
      {
        androidGoogleMapsApiKey:
          process.env
            .EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
});