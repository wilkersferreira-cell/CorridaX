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
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
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
  onLogin?: () => void;
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
    case 'auth/email-already-in-use':
      return 'Já existe uma conta cadastrada com este e-mail.';

    case 'auth/invalid-email':
      return 'O endereço de e-mail informado não é válido.';

    case 'auth/weak-password':
      return 'Escolha uma senha mais forte.';

    case 'auth/network-request-failed':
      return 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.';

    case 'auth/too-many-requests':
      return 'Muitas tentativas foram realizadas. Aguarde um pouco e tente novamente.';

    case 'auth/operation-not-allowed':
      return 'O cadastro por e-mail ainda não está disponível.';

    default:
      return 'Não foi possível criar sua conta agora. Tente novamente.';
  }
}

export default function SignUpScreen({
  onBack,
  onLogin,
  onCreateAccount,
}: Props) {
  const [
    name,
    setName,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    touchedName,
    setTouchedName,
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
    touchedConfirmPassword,
    setTouchedConfirmPassword,
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

  const emailRef =
    useRef<RNTextInput>(null);

  const passwordRef =
    useRef<RNTextInput>(null);

  const confirmPasswordRef =
    useRef<RNTextInput>(null);

  const nameValid =
    name.trim().length >= 2;

  const emailValid =
    isValidEmail(
      email,
    );

  const passwordValid =
    password.length >= 6;

  const confirmPasswordValid =
    confirmPassword.length >= 6 &&
    confirmPassword ===
      password;

  const canCreateAccount =
    nameValid &&
    emailValid &&
    passwordValid &&
    confirmPasswordValid &&
    !loading;

  const nameError =
    touchedName &&
    !nameValid
      ? 'Informe seu nome.'
      : '';

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

  const confirmPasswordError =
    touchedConfirmPassword &&
    !confirmPasswordValid
      ? confirmPassword.length < 6
        ? 'Confirme sua senha.'
        : 'As senhas não coincidem.'
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

  function revealLowerFields() {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: 250,
        animated: true,
      });
    }, 180);
  }

  function revealConfirmPassword() {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: 340,
        animated: true,
      });
    }, 180);
  }

  async function handleCreateAccount() {
    setTouchedName(true);
    setTouchedEmail(true);
    setTouchedPassword(true);
    setTouchedConfirmPassword(true);
    setFirebaseError('');

    if (
      !nameValid ||
      !emailValid ||
      !passwordValid ||
      !confirmPasswordValid ||
      loading
    ) {
      return;
    }

    try {
      setLoading(true);

      const auth =
        getAuth();

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password,
        );

      await updateProfile(
        credential.user,
        {
          displayName:
            name.trim(),
        },
      );

      /*
       * O Firebase já deixa o usuário
       * autenticado após criar a conta.
       *
       * O AppNavigator ouvirá essa mudança
       * e abrirá automaticamente a Home.
       */
      onCreateAccount?.();
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
              Crie sua conta
            </Text>

            <Text
              style={
                styles.description
              }
            >
              Salve suas preferências e tenha uma
              experiência personalizada no CorridaX.
            </Text>
          </View>

          <View
            style={
              styles.form
            }
          >
            <TextInput
              mode="outlined"
              label="Nome"
              value={name}
              editable={!loading}
              onChangeText={(
                value,
              ) => {
                setName(
                  value,
                );

                setFirebaseError('');
              }}
              onBlur={() =>
                setTouchedName(
                  true,
                )
              }
              error={
                !!nameError
              }
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() =>
                emailRef.current?.focus()
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
                  icon="account-outline"
                  size={21}
                  color={
                    nameError
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

            {!!nameError && (
              <Text
                style={
                  styles.errorText
                }
              >
                {nameError}
              </Text>
            )}

            <TextInput
              ref={emailRef}
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
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={
                revealLowerFields
              }
              onSubmitEditing={() =>
                confirmPasswordRef.current?.focus()
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

            {!!passwordError && (
              <Text
                style={
                  styles.errorText
                }
              >
                {passwordError}
              </Text>
            )}

            <TextInput
              ref={
                confirmPasswordRef
              }
              mode="outlined"
              label="Confirmar senha"
              value={
                confirmPassword
              }
              editable={!loading}
              onChangeText={(
                value,
              ) => {
                setConfirmPassword(
                  value,
                );

                setFirebaseError('');
              }}
              onBlur={() =>
                setTouchedConfirmPassword(
                  true,
                )
              }
              error={
                !!confirmPasswordError
              }
              secureTextEntry={
                !showConfirmPassword
              }
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onFocus={
                revealConfirmPassword
              }
              onSubmitEditing={
                handleCreateAccount
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
                  icon="lock-check-outline"
                  size={21}
                  color={
                    confirmPasswordError
                      ? COLORS.error
                      : COLORS.textSecondary
                  }
                />
              }
              right={
                <TextInput.Icon
                  icon={
                    showConfirmPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={21}
                  color={
                    COLORS.textSecondary
                  }
                  onPress={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword,
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

            {!!confirmPasswordError && (
              <Text
                style={
                  styles.errorText
                }
              >
                {confirmPasswordError}
              </Text>
            )}

            {!passwordError &&
              !confirmPasswordError && (
                <View
                  style={
                    styles.passwordHint
                  }
                >
                  <MaterialCommunityIcons
                    name="information-outline"
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
                    Mínimo de 6 caracteres
                  </Text>
                </View>
              )}

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
                !canCreateAccount
              }
              onPress={
                handleCreateAccount
              }
              style={({ pressed }) => [
                styles.createButton,

                !canCreateAccount &&
                  styles.createButtonDisabled,

                pressed &&
                  canCreateAccount &&
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
                      styles.createButtonText
                    }
                  >
                    Criando conta...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.createButtonText
                    }
                  >
                    Criar minha conta
                  </Text>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={19}
                    color={
                      canCreateAccount
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
              styles.loginRow
            }
          >
            <Text
              style={
                styles.accountText
              }
            >
              Já tem uma conta?
            </Text>

            <Pressable
              onPress={onLogin}
              disabled={loading}
              hitSlop={10}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.loginText,

                    pressed &&
                      styles.loginPressed,
                  ]}
                >
                  Entrar
                </Text>
              )}
            </Pressable>
          </View>

          <Text
            style={
              styles.legalText
            }
          >
            Ao criar sua conta, você concorda com os{' '}
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

  createButton: {
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

  createButtonDisabled: {
    backgroundColor:
      COLORS.surfaceLight,

    borderWidth: 1,

    borderColor:
      COLORS.borderSoft,
  },

  createButtonText: {
    color:
      COLORS.white,

    fontSize: 15,

    fontWeight:
      TYPOGRAPHY.weight.bold,
  },

  pressed: {
    opacity: 0.78,
  },

  loginRow: {
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

  loginText: {
    marginLeft: 6,

    color:
      COLORS.primaryLight,

    fontSize: 13,

    fontWeight:
      TYPOGRAPHY.weight.bold,
  },

  loginPressed: {
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