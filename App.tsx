import { PaperProvider } from 'react-native-paper';

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

import { theme } from './src/theme/theme';
import AppNavigator from './src/navigation/AppNavigator';

GoogleSignin.configure({
  webClientId:
    '619339635549-op01am9emrpaah61so7lrlaac6bbsr7d.apps.googleusercontent.com',

  offlineAccess: false,
});

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}