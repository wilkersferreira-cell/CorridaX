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

type UnknownError = {
  code?: unknown;
  message?: unknown;
  name?: unknown;
};

function getDiagnosticMessage(
  error: unknown,
): string {
  if (
    typeof error === 'object' &&
    error !== null
  ) {
    const typedError =
      error as UnknownError;

    const code =
      typeof typedError.code ===
      'string'
        ? typedError.code
        : 'sem código';

    const message =
      typeof typedError.message ===
      'string'
        ? typedError.message
        : 'sem mensagem';

    return `${code} - ${message}`;
  }

  return String(error);
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  try {
    console.log(
      '[GoogleSignIn] Iniciando login...',
    );

    /*
     * Confirma que o Google Play Services
     * está disponível e atualizado.
     */
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    console.log(
      '[GoogleSignIn] Google Play Services OK.',
    );

    /*
     * Abre o seletor de contas Google.
     */
    const response =
      await GoogleSignin.signIn();

    console.log(
      '[GoogleSignIn] Conta selecionada.',
      response,
    );

    /*
     * Recupera os tokens da conta selecionada.
     */
    const tokens =
      await GoogleSignin.getTokens();

    console.log(
      '[GoogleSignIn] Tokens recebidos.',
      {
        hasIdToken:
          Boolean(
            tokens.idToken,
          ),
        hasAccessToken:
          Boolean(
            tokens.accessToken,
          ),
      },
    );

    if (!tokens.idToken) {
      console.error(
        '[GoogleSignIn] ID Token não recebido.',
      );

      return {
        success: false,
        cancelled: false,
        message:
          'Google Sign-In: ID Token não recebido.',
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

    console.log(
      '[GoogleSignIn] Credencial Firebase criada.',
    );

    /*
     * Autentica efetivamente no Firebase.
     */
    await signInWithCredential(
      getAuth(),
      googleCredential,
    );

    console.log(
      '[GoogleSignIn] Login Firebase concluído.',
    );

    return {
      success: true,
    };
  } catch (error) {
    const diagnostic =
      getDiagnosticMessage(
        error,
      );

    console.error(
      '[GoogleSignIn] ERRO:',
      diagnostic,
      error,
    );

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
        `Erro Google Sign-In: ${diagnostic}`,
    };
  }
}