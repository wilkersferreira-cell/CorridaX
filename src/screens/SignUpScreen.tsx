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
  Text,
  TextInput,
} from 'react-native-paper';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

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
    confirmPasswordValid;

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

  function handleCreateAccount() {
    setTouchedName(true);
    setTouchedEmail(true);
    setTouchedPassword(true);
    setTouchedConfirmPassword(true);

    if (
      !canCreateAccount
    ) {
      return;
    }

    onCreateAccount?.();
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
              onChangeText={(
                value,
              ) => {
                setName(
                  value,
                );

                if (
                  touchedName
                ) {
                  setTouchedName(
                    true,
                  );
                }
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
              onChangeText={(
                value,
              ) => {
                setEmail(
                  value,
                );
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
              onChangeText={(
                value,
              ) => {
                setPassword(
                  value,
                );
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
              onChangeText={(
                value,
              ) => {
                setConfirmPassword(
                  value,
                );
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
              <Text
                style={[
                  styles.createButtonText,

                  !canCreateAccount &&
                    styles.createButtonTextDisabled,
                ]}
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

  createButtonTextDisabled: {
    color:
      COLORS.textMuted,
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