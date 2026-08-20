import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';

export type GoogleSignInResult =
  | {
      success: true;
    }
  | {
      success: false;
      cancelled: boolean;
      message: string;
    };

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  try {
    /*
     * Confirma que o Google Play Services
     * está disponível e atualizado.
     */
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    /*
     * Abre o seletor de contas Google.
     */
    const response =
      await GoogleSignin.signIn();

    /*
     * Recupera os tokens da conta selecionada.
     */
    const tokens =
      await GoogleSignin.getTokens();

    if (!tokens.idToken) {
      return {
        success: false,
        cancelled: false,
        message:
          'Não foi possível obter a credencial da sua conta Google.',
      };
    }

    /*
     * Converte o ID Token do Google
     * em uma credencial aceita pelo Firebase.
     */
    const googleCredential =
      GoogleAuthProvider.credential(
        tokens.idToken,
      );

    /*
     * Autentica efetivamente no Firebase.
     *
     * O AppNavigator já está ouvindo
     * onAuthStateChanged. Portanto, quando
     * essa operação terminar, a Home será
     * aberta automaticamente.
     */
    await signInWithCredential(
      getAuth(),
      googleCredential,
    );

    return {
      success: true,
    };
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (
        error.code ===
        statusCodes.SIGN_IN_CANCELLED
      ) {
        return {
          success: false,
          cancelled: true,
          message: '',
        };
      }

      if (
        error.code ===
        statusCodes.IN_PROGRESS
      ) {
        return {
          success: false,
          cancelled: false,
          message:
            'O login com Google já está em andamento.',
        };
      }

      if (
        error.code ===
        statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        return {
          success: false,
          cancelled: false,
          message:
            'O Google Play Services não está disponível ou precisa ser atualizado.',
        };
      }
    }

    return {
      success: false,
      cancelled: false,
      message:
        'Não foi possível entrar com o Google. Tente novamente.',
    };
  }
}