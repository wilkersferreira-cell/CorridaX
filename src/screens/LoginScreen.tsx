import React from 'react';

import {
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  Text,
} from 'react-native-paper';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import LogoCX from '../components/layout/LogoCX';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../theme';

type Props = {
  onContinue?: () => void;
  onLogin?: () => void;
  onCreateAccount?: () => void;
};

export default function LoginScreen({
  onContinue,
  onLogin,
  onCreateAccount,
}: Props) {
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

      <View style={styles.container}>
        {/* MARCA */}
        <View style={styles.brandArea}>
          <LogoCX size={86} />

          <Text style={styles.brandName}>
            Corrida
            <Text style={styles.brandX}>
              X
            </Text>
          </Text>

          <Text style={styles.slogan}>
            Compare. Escolha. Economize.
          </Text>
        </View>

        {/* PROPOSTA DE VALOR */}
        <View style={styles.presentation}>
          <Text style={styles.title}>
            A melhor corrida
            {'\n'}
            para você.
          </Text>

          <Text style={styles.description}>
            Compare preço e tempo entre suas opções
            e escolha como quer ir.
          </Text>
        </View>

        {/* ACESSO */}
        <View style={styles.actions}>
          <Pressable
            onPress={onContinue}
            style={({ pressed }) => [
              styles.googleButton,

              pressed &&
                styles.buttonPressed,
            ]}
          >
            <View style={styles.googleIconArea}>
              <MaterialCommunityIcons
                name="google"
                size={21}
                color="#4285F4"
              />
            </View>

            <Text style={styles.googleText}>
              Continuar com Google
            </Text>

            <View style={styles.buttonBalance} />
          </Pressable>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />

            <Text style={styles.separatorText}>
              ou
            </Text>

            <View style={styles.separatorLine} />
          </View>

          <Pressable
            onPress={onCreateAccount}
            style={({ pressed }) => [
              styles.createButton,

              pressed &&
                styles.buttonPressed,
            ]}
          >
            <Text style={styles.createButtonText}>
              Criar conta
            </Text>
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.accountText}>
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
                      styles.loginTextPressed,
                  ]}
                >
                  Entrar
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* TERMOS */}
        <View style={styles.footer}>
          <Text style={styles.legalText}>
            Ao continuar, você concorda com os{' '}
            <Text style={styles.legalLink}>
              Termos de Uso
            </Text>
            {' '}e a{' '}
            <Text style={styles.legalLink}>
              Política de Privacidade
            </Text>
            .
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

    backgroundColor:
      COLORS.background,
  },

  container: {
    flex: 1,

    paddingHorizontal:
      SPACING.xl,

    paddingTop: 24,

    paddingBottom: 12,
  },

  /*
   * MARCA
   */
  brandArea: {
    alignItems: 'center',
  },

  brandName: {
    marginTop: 10,

    color:
      COLORS.white,

    fontSize: 30,

    lineHeight: 35,

    fontWeight:
      TYPOGRAPHY.weight.bold,

    letterSpacing: -0.9,
  },

  brandX: {
    color:
      COLORS.primaryLight,

    fontSize: 30,

    fontWeight:
      TYPOGRAPHY.weight.extraBold,

    letterSpacing: -0.9,
  },

  slogan: {
    marginTop: 0,

    color:
      COLORS.textSecondary,

    fontSize: 12,

    lineHeight: 17,

    fontWeight:
      TYPOGRAPHY.weight.medium,

    letterSpacing: 0.15,
  },

  /*
   * PROPOSTA
   *
   * Aproximada da marca.
   */
  presentation: {
    marginTop: 40,

    marginBottom: 38,
  },

  title: {
    color:
      COLORS.white,

    fontSize: 29,

    lineHeight: 34,

    fontWeight:
      TYPOGRAPHY.weight.extraBold,

    letterSpacing: -0.8,
  },

  description: {
    maxWidth: 350,

    marginTop: 11,

    color:
      COLORS.textSecondary,

    fontSize: 15,

    lineHeight: 21,

    fontWeight:
      TYPOGRAPHY.weight.medium,
  },

  /*
   * ACESSO
   */
  actions: {
    width: '100%',
  },

  googleButton: {
    minHeight: 54,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 17,

    borderRadius:
      RADIUS.lg,

    backgroundColor:
      COLORS.white,

    ...SHADOWS.sm,
  },

  googleIconArea: {
    width: 28,

    alignItems: 'flex-start',

    justifyContent: 'center',
  },

  googleText: {
    flex: 1,

    color: '#151515',

    fontSize: 16,

    fontWeight:
      TYPOGRAPHY.weight.bold,

    textAlign: 'center',
  },

  buttonBalance: {
    width: 28,
  },

  buttonPressed: {
    opacity: 0.82,
  },

  separator: {
    flexDirection: 'row',

    alignItems: 'center',

    marginVertical: 12,
  },

  separatorLine: {
    flex: 1,

    height:
      StyleSheet.hairlineWidth,

    backgroundColor:
      COLORS.borderSoft,
  },

  separatorText: {
    marginHorizontal: 12,

    color:
      COLORS.textMuted,

    fontSize: 11,

    fontWeight:
      TYPOGRAPHY.weight.medium,
  },

  createButton: {
    minHeight: 50,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor:
      COLORS.border,

    borderRadius:
      RADIUS.lg,

    backgroundColor:
      COLORS.surface,
  },

  createButtonText: {
    color:
      COLORS.text,

    fontSize: 15,

    fontWeight:
      TYPOGRAPHY.weight.bold,
  },

  loginRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 18,
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

  loginTextPressed: {
    opacity: 0.65,
  },

  /*
   * RODAPÉ
   *
   * Um pouco mais afastado do login,
   * aproveitando melhor a vertical.
   */
  footer: {
    marginTop: 26,

    paddingBottom: 2,
  },

  legalText: {
    paddingHorizontal: 10,

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