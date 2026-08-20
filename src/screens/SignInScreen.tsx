import React, {
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  ActivityIndicator,
  Text,
  TextInput,
} from 'react-native-paper';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

import LogoCX from '../components/layout/LogoCX';

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../theme';

type Props = {
  onBack?: () => void;
  onCreateAccount?: () => void;
};

function isValidEmail(
  value: string,
): boolean {
  const email =
    value.trim();

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}

function getFirebaseErrorMessage(
  error: unknown,
): string {
  const code =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
      ? error.code
      : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'O endereço de e-mail informado não é válido.';

    case 'auth/user-disabled':
      return 'Esta conta foi desativada.';

    case 'auth/user-not-found':
      return 'Não encontramos uma conta com este e-mail.';

    case 'auth/wrong-password':
      return 'E-mail ou senha incorretos.';

    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';

    case 'auth/network-request-failed':
      return 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.';

    case 'auth/too-many-requests':
      return 'Muitas tentativas foram realizadas. Aguarde um pouco e tente novamente.';

    case 'auth/operation-not-allowed':
      return 'O login por e-mail ainda não está disponível.';

    default:
      return 'Não foi possível entrar agora. Verifique seus dados e tente novamente.';
  }
}

export default function SignInScreen({
  onBack,
  onCreateAccount,
}: Props) {
  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    touchedEmail,
    setTouchedEmail,
  ] = useState(false);

  const [
    touchedPassword,
    setTouchedPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    firebaseError,
    setFirebaseError,
  ] = useState('');

  const scrollRef =
    useRef<ScrollView>(null);

  const passwordRef =
    useRef<RNTextInput>(null);

  const emailValid =
    isValidEmail(
      email,
    );

  const passwordValid =
    password.length >= 6;

  const canLogin =
    emailValid &&
    passwordValid &&
    !loading;

  const emailError =
    touchedEmail &&
    !emailValid
      ? 'Informe um e-mail válido.'
      : '';

  const passwordError =
    touchedPassword &&
    !passwordValid
      ? 'A senha deve ter pelo menos 6 caracteres.'
      : '';

  const inputTheme =
    useMemo(
      () => ({
        colors: {
          background:
            COLORS.surface,

          onSurfaceVariant:
            COLORS.textSecondary,
        },
      }),
      [],
    );

  function revealPassword() {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: 180,
        animated: true,
      });
    }, 180);
  }

  async function handleLogin() {
    setTouchedEmail(true);
    setTouchedPassword(true);
    setFirebaseError('');

    if (
      !emailValid ||
      !passwordValid ||
      loading
    ) {
      return;
    }

    try {
      setLoading(true);

      const auth =
        getAuth();

      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );

      /*
       * Não precisamos navegar manualmente.
       *
       * O AppNavigator está ouvindo o Firebase
       * através do onAuthStateChanged.
       *
       * Assim que o login for concluído,
       * o usuário autenticado será detectado
       * e a Home será aberta automaticamente.
       */
    } catch (error) {
      setFirebaseError(
        getFirebaseErrorMessage(
          error,
        ),
      );

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({
          animated: true,
        });
      }, 150);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={[
        'top',
        'bottom',
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.background
        }
      />

      <KeyboardAvoidingView
        style={
          styles.keyboardView
        }
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={
            false
          }
          automaticallyAdjustKeyboardInsets={
            Platform.OS === 'ios'
          }
        >
          <View
            style={
              styles.header
            }
          >
            <Pressable
              onPress={onBack}
              disabled={loading}
              hitSlop={12}
              style={({ pressed }) => [
                styles.backButton,

                pressed &&
                  styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={25}
                color={
                  COLORS.white
                }
              />
            </Pressable>

            <View
              style={
                styles.miniBrand
              }
            >
              <LogoCX size={48} />

              <Text
                style={
                  styles.miniBrandName
                }
              >
                Corrida
                <Text
                  style={
                    styles.miniBrandX
                  }
                >
                  X
                </Text>
              </Text>
            </View>

            <View
              style={
                styles.headerBalance
              }
            />
          </View>

          <View
            style={
              styles.intro
            }
          >
            <Text
              style={
                styles.title
              }
            >
              Bem-vindo de volta
            </Text>

            <Text
              style={
                styles.description
              }
            >
              Entre na sua conta para continuar
              usando o CorridaX.
            </Text>
          </View>

          <View
            style={
              styles.form
            }
          >
            <TextInput
              mode="outlined"
              label="E-mail"
              value={email}
              editable={!loading}
              onChangeText={(
                value,
              ) => {
                setEmail(
                  value,
                );

                setFirebaseError('');
              }}
              onBlur={() =>
                setTouchedEmail(
                  true,
                )
              }
              error={
                !!emailError
              }
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() =>
                passwordRef.current?.focus()
              }
              textColor={
                COLORS.white
              }
              outlineColor={
                COLORS.border
              }
              activeOutlineColor={
                COLORS.primary
              }
              cursorColor={
                COLORS.primaryLight
              }
              left={
                <TextInput.Icon
                  icon="email-outline"
                  size={21}
                  color={
                    emailError
                      ? COLORS.error
                      : COLORS.textSecondary
                  }
                />
              }
              style={
                styles.input
              }
              contentStyle={
                styles.inputContent
              }
              outlineStyle={
                styles.inputOutline
              }
              theme={
                inputTheme
              }
            />

            {!!emailError && (
              <Text
                style={
                  styles.errorText
                }
              >
                {emailError}
              </Text>
            )}

            <TextInput
              ref={passwordRef}
              mode="outlined"
              label="Senha"
              value={password}
              editable={!loading}
              onChangeText={(
                value,
              ) => {
                setPassword(
                  value,
                );

                setFirebaseError('');
              }}
              onBlur={() =>
                setTouchedPassword(
                  true,
                )
              }
              error={
                !!passwordError
              }
              secureTextEntry={
                !showPassword
              }
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onFocus={
                revealPassword
              }
              onSubmitEditing={
                handleLogin
              }
              textColor={
                COLORS.white
              }
              outlineColor={
                COLORS.border
              }
              activeOutlineColor={
                COLORS.primary
              }
              cursorColor={
                COLORS.primaryLight
              }
              left={
                <TextInput.Icon
                  icon="lock-outline"
                  size={21}
                  color={
                    passwordError
                      ? COLORS.error
                      : COLORS.textSecondary
                  }
                />
              }
              right={
                <TextInput.Icon
                  icon={
                    showPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={21}
                  color={
                    COLORS.textSecondary
                  }
                  onPress={() =>
                    setShowPassword(
                      !showPassword,
                    )
                  }
                />
              }
              style={[
                styles.input,
                styles.lastInput,
              ]}
              contentStyle={
                styles.inputContent
              }
              outlineStyle={
                styles.inputOutline
              }
              theme={
                inputTheme
              }
            />

            {!!passwordError && (
              <Text
                style={
                  styles.errorText
                }
              >
                {passwordError}
              </Text>
            )}

            <View
              style={
                styles.passwordHint
              }
            >
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={14}
                color={
                  COLORS.textMuted
                }
              />

              <Text
                style={
                  styles.passwordHintText
                }
              >
                Seus dados são protegidos pelo Firebase
              </Text>
            </View>

            {!!firebaseError && (
              <View
                style={
                  styles.firebaseErrorBox
                }
              >
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={17}
                  color={
                    COLORS.error
                  }
                />

                <Text
                  style={
                    styles.firebaseErrorText
                  }
                >
                  {firebaseError}
                </Text>
              </View>
            )}

            <Pressable
              disabled={
                !canLogin
              }
              onPress={
                handleLogin
              }
              style={({ pressed }) => [
                styles.loginButton,

                !canLogin &&
                  styles.loginButtonDisabled,

                pressed &&
                  canLogin &&
                  styles.pressed,
              ]}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    size={18}
                    color={
                      COLORS.white
                    }
                  />

                  <Text
                    style={
                      styles.loginButtonText
                    }
                  >
                    Entrando...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.loginButtonText
                    }
                  >
                    Entrar
                  </Text>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={19}
                    color={
                      canLogin
                        ? COLORS.white
                        : COLORS.textMuted
                    }
                  />
                </>
              )}
            </Pressable>
          </View>

          <View
            style={
              styles.createAccountRow
            }
          >
            <Text
              style={
                styles.accountText
              }
            >
              Ainda não tem uma conta?
            </Text>

            <Pressable
              onPress={
                onCreateAccount
              }
              disabled={loading}
              hitSlop={10}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.createAccountText,

                    pressed &&
                      styles.createAccountPressed,
                  ]}
                >
                  Criar conta
                </Text>
              )}
            </Pressable>
          </View>

          <Text
            style={
              styles.legalText
            }
          >
            Ao entrar, você concorda com os{' '}
            <Text
              style={
                styles.legalLink
              }
            >
              Termos de Uso
            </Text>
            {' '}e a{' '}
            <Text
              style={
                styles.legalLink
              }
            >
              Política de Privacidade
            </Text>
            .
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

    backgroundColor:
      COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,

    paddingHorizontal:
      SPACING.xl,

    paddingTop: 8,

    paddingBottom: 90,
  },

  header: {
    minHeight: 58,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',
  },

  backButton: {
    width: 42,
    height: 42,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: -7,

    borderRadius:
      RADIUS.round,
  },

  miniBrand: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  miniBrandName: {
    marginLeft: 9,

    color:
      COLORS.white,

    fontSize: 22,

    lineHeight: 27,

    fontWeight:
      TYPOGRAPHY.weight.bold,

    letterSpacing: -0.65,
  },

  miniBrandX: {
    color:
      COLORS.primaryLight,

    fontSize: 22,

    lineHeight: 27,

    fontWeight:
      TYPOGRAPHY.weight.extraBold,
  },

  headerBalance: {
    width: 35,
  },

  intro: {
    marginTop: 27,

    marginBottom: 22,
  },

  title: {
    color:
      COLORS.white,

    fontSize: 28,

    lineHeight: 34,

    fontWeight:
      TYPOGRAPHY.weight.extraBold,

    letterSpacing: -0.75,
  },

  description: {
    maxWidth: 350,

    marginTop: 8,

    color:
      COLORS.textSecondary,

    fontSize: 14,

    lineHeight: 19,

    fontWeight:
      TYPOGRAPHY.weight.medium,
  },

  form: {
    width: '100%',
  },

  input: {
    marginBottom: 10,

    backgroundColor:
      COLORS.surface,
  },

  lastInput: {
    marginBottom: 0,
  },

  inputContent: {
    minHeight: 48,

    fontSize: 15,
  },

  inputOutline: {
    borderRadius:
      RADIUS.lg,

    borderWidth: 1,
  },

  errorText: {
    marginTop: -4,

    marginBottom: 8,

    marginLeft: 4,

    color:
      COLORS.error,

    fontSize: 10.5,

    lineHeight: 14,

    fontWeight:
      TYPOGRAPHY.weight.medium,
  },

  passwordHint: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 9,

    marginBottom: 16,

    paddingHorizontal: 3,
  },

  passwordHintText: {
    marginLeft: 5,

    color:
      COLORS.textMuted,

    fontSize: 10.5,

    lineHeight: 14,
  },

  firebaseErrorBox: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    marginBottom: 14,

    paddingHorizontal: 11,

    paddingVertical: 10,

    borderWidth: 1,

    borderColor:
      COLORS.error,

    borderRadius:
      RADIUS.lg,

    backgroundColor:
      COLORS.surface,
  },

  firebaseErrorText: {
    flex: 1,

    marginLeft: 7,

    color:
      COLORS.error,

    fontSize: 11,

    lineHeight: 16,

    fontWeight:
      TYPOGRAPHY.weight.medium,
  },

  loginButton: {
    minHeight: 52,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 8,

    borderRadius:
      RADIUS.lg,

    backgroundColor:
      COLORS.primary,
  },

  loginButtonDisabled: {
    backgroundColor:
      COLORS.surfaceLight,

    borderWidth: 1,

    borderColor:
      COLORS.borderSoft,
  },

  loginButtonText: {
    color:
      COLORS.white,

    fontSize: 15,

    fontWeight:
      TYPOGRAPHY.weight.bold,
  },

  pressed: {
    opacity: 0.78,
  },

  createAccountRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 21,
  },

  accountText: {
    color:
      COLORS.textSecondary,

    fontSize: 13,
  },

  createAccountText: {
    marginLeft: 6,

    color:
      COLORS.primaryLight,

    fontSize: 13,

    fontWeight:
      TYPOGRAPHY.weight.bold,
  },

  createAccountPressed: {
    opacity: 0.65,
  },

  legalText: {
    marginTop: 18,

    paddingHorizontal: 12,

    color:
      COLORS.textMuted,

    fontSize: 9.5,

    lineHeight: 14,

    textAlign: 'center',
  },

  legalLink: {
    color:
      COLORS.textSecondary,

    fontWeight:
      TYPOGRAPHY.weight.semiBold,
  },
});