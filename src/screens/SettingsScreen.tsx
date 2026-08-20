import React, {
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  ActivityIndicator,
  Text,
} from 'react-native-paper';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  getAuth,
  signOut,
} from '@react-native-firebase/auth';

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../theme';

export default function SettingsScreen() {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const auth =
    getAuth();

  const user =
    auth.currentUser;

  const displayName =
    user?.displayName?.trim() ||
    'Usuário CorridaX';

  const email =
    user?.email ||
    'E-mail não informado';

  async function handleSignOut() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await signOut(
        auth,
      );

      /*
       * Não precisamos navegar manualmente.
       *
       * O AppNavigator está ouvindo
       * onAuthStateChanged.
       *
       * Ao sair da conta, user ficará null
       * e a tela inicial de autenticação
       * será exibida automaticamente.
       */
    } catch {
      Alert.alert(
        'Não foi possível sair',
        'Ocorreu um erro ao encerrar sua sessão. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  function confirmSignOut() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair da sua conta do CorridaX?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: handleSignOut,
        },
      ],
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={[
        'top',
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.background
        }
      />

      <View
        style={
          styles.container
        }
      >
        <View
          style={
            styles.header
          }
        >
          <Text
            style={
              styles.title
            }
          >
            Ajustes
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Gerencie sua conta e suas preferências.
          </Text>
        </View>

        <Text
          style={
            styles.sectionLabel
          }
        >
          CONTA
        </Text>

        <View
          style={
            styles.accountCard
          }
        >
          <View
            style={
              styles.avatar
            }
          >
            <MaterialCommunityIcons
              name="account"
              size={29}
              color={
                COLORS.primaryLight
              }
            />
          </View>

          <View
            style={
              styles.accountInfo
            }
          >
            <Text
              style={
                styles.accountName
              }
              numberOfLines={1}
            >
              {displayName}
            </Text>

            <Text
              style={
                styles.accountEmail
              }
              numberOfLines={1}
            >
              {email}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.sectionLabel,
            styles.preferencesLabel,
          ]}
        >
          PREFERÊNCIAS
        </Text>

        <View
          style={
            styles.preferencesCard
          }
        >
          <View
            style={
              styles.preferenceRow
            }
          >
            <View
              style={
                styles.preferenceIcon
              }
            >
              <MaterialCommunityIcons
                name="tune-variant"
                size={21}
                color={
                  COLORS.textSecondary
                }
              />
            </View>

            <View
              style={
                styles.preferenceContent
              }
            >
              <Text
                style={
                  styles.preferenceTitle
                }
              >
                Preferências de viagem
              </Text>

              <Text
                style={
                  styles.preferenceDescription
                }
              >
                Em breve
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={
                COLORS.textMuted
              }
            />
          </View>
        </View>

        <View
          style={
            styles.spacer
          }
        />

        <Pressable
          onPress={
            confirmSignOut
          }
          disabled={loading}
          style={({ pressed }) => [
            styles.signOutButton,

            pressed &&
              !loading &&
              styles.pressed,

            loading &&
              styles.signOutButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator
              size={19}
              color={
                COLORS.error
              }
            />
          ) : (
            <MaterialCommunityIcons
              name="logout"
              size={21}
              color={
                COLORS.error
              }
            />
          )}

          <Text
            style={
              styles.signOutText
            }
          >
            {loading
              ? 'Saindo...'
              : 'Sair da conta'}
          </Text>
        </Pressable>

        <Text
          style={
            styles.versionText
          }
        >
          CorridaX
        </Text>
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

    paddingTop: 20,

    paddingBottom: 16,
  },

  header: {
    marginBottom: 30,
  },

  title: {
    color:
      COLORS.white,

    fontSize: 29,

    lineHeight: 35,

    fontWeight:
      TYPOGRAPHY.weight.extraBold,

    letterSpacing: -0.8,
  },

  subtitle: {
    marginTop: 6,

    color:
      COLORS.textSecondary,

    fontSize: 14,

    lineHeight: 20,

    fontWeight:
      TYPOGRAPHY.weight.medium,
  },

  sectionLabel: {
    marginBottom: 9,

    color:
      COLORS.textMuted,

    fontSize: 10.5,

    lineHeight: 14,

    fontWeight:
      TYPOGRAPHY.weight.bold,

    letterSpacing: 0.9,
  },

  accountCard: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 16,

    paddingVertical: 16,

    borderWidth: 1,

    borderColor:
      COLORS.borderSoft,

    borderRadius:
      RADIUS.lg,

    backgroundColor:
      COLORS.surface,
  },

  avatar: {
    width: 52,
    height: 52,

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius:
      RADIUS.round,

    backgroundColor:
      COLORS.primarySoft,
  },

  accountInfo: {
    flex: 1,

    marginLeft: 14,
  },

  accountName: {
    color:
      COLORS.text,

    fontSize: 16,

    lineHeight: 21,

    fontWeight:
      TYPOGRAPHY.weight.bold,
  },

  accountEmail: {
    marginTop: 3,

    color:
      COLORS.textSecondary,

    fontSize: 12.5,

    lineHeight: 17,
  },

  preferencesLabel: {
    marginTop: 28,
  },

  preferencesCard: {
    borderWidth: 1,

    borderColor:
      COLORS.borderSoft,

    borderRadius:
      RADIUS.lg,

    backgroundColor:
      COLORS.surface,

    overflow: 'hidden',
  },

  preferenceRow: {
    minHeight: 66,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 15,
  },

  preferenceIcon: {
    width: 38,
    height: 38,

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius:
      RADIUS.round,

    backgroundColor:
      COLORS.surfaceLight,
  },

  preferenceContent: {
    flex: 1,

    marginLeft: 12,
  },

  preferenceTitle: {
    color:
      COLORS.text,

    fontSize: 14,

    lineHeight: 19,

    fontWeight:
      TYPOGRAPHY.weight.semiBold,
  },

  preferenceDescription: {
    marginTop: 2,

    color:
      COLORS.textMuted,

    fontSize: 11,

    lineHeight: 15,
  },

  spacer: {
    flex: 1,
  },

  signOutButton: {
    minHeight: 52,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 8,

    borderWidth: 1,

    borderColor:
      COLORS.error,

    borderRadius:
      RADIUS.lg,

    backgroundColor:
      COLORS.surface,
  },

  signOutButtonDisabled: {
    opacity: 0.6,
  },

  signOutText: {
    color:
      COLORS.error,

    fontSize: 14,

    fontWeight:
      TYPOGRAPHY.weight.bold,
  },

  pressed: {
    opacity: 0.72,
  },

  versionText: {
    marginTop: 13,

    color:
      COLORS.textMuted,

    fontSize: 9.5,

    textAlign: 'center',
  },
});