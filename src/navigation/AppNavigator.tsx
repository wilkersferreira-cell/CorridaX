import React, {
  useState,
} from 'react';

import {
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  MaterialIcons,
} from '@expo/vector-icons';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

import {
  COLORS,
} from '../theme';

const Tab =
  createBottomTabNavigator();

const navigationTheme = {
  ...DarkTheme,

  colors: {
    ...DarkTheme.colors,

    primary:
      COLORS.primary,

    background:
      COLORS.background,

    card:
      COLORS.surface,

    text:
      COLORS.text,

    border:
      COLORS.borderSoft,

    notification:
      COLORS.primary,
  },
};

function MainTabs() {
  const insets =
    useSafeAreaInsets();

  const bottomInset =
    Math.max(
      insets.bottom,
      12,
    );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({
        route,
      }) => ({
        headerShown: false,

        tabBarActiveTintColor:
          COLORS.primaryLight,

        tabBarInactiveTintColor:
          COLORS.textMuted,

        tabBarHideOnKeyboard:
          true,

        tabBarLabelStyle: {
          fontSize: 11,

          fontWeight:
            '600',

          marginTop: 1,
        },

        tabBarItemStyle: {
          paddingTop: 3,

          paddingBottom: 4,
        },

        tabBarStyle: {
          height:
            64 +
            bottomInset,

          paddingTop: 7,

          paddingBottom:
            bottomInset + 4,

          backgroundColor:
            COLORS.surface,

          borderTopWidth: 1,

          borderTopColor:
            COLORS.borderSoft,

          elevation: 0,

          shadowOpacity: 0,
        },

        sceneStyle: {
          backgroundColor:
            COLORS.background,
        },

        tabBarIcon: ({
          color,
          size,
          focused,
        }) => {
          let icon:
            | 'home'
            | 'home-filled'
            | 'history'
            | 'favorite'
            | 'favorite-border'
            | 'settings' =
            'home';

          if (
            route.name ===
            'Home'
          ) {
            icon = focused
              ? 'home-filled'
              : 'home';
          }

          if (
            route.name ===
            'Histórico'
          ) {
            icon =
              'history';
          }

          if (
            route.name ===
            'Favoritos'
          ) {
            icon = focused
              ? 'favorite'
              : 'favorite-border';
          }

          if (
            route.name ===
            'Configurações'
          ) {
            icon =
              'settings';
          }

          return (
            <MaterialIcons
              name={icon}
              size={
                focused
                  ? size + 2
                  : size
              }
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={
          HomeScreen
        }
        options={{
          tabBarLabel:
            'Início',
        }}
      />

      <Tab.Screen
        name="Histórico"
        component={
          HistoryScreen
        }
      />

      <Tab.Screen
        name="Favoritos"
        component={
          FavoritesScreen
        }
      />

      <Tab.Screen
        name="Configurações"
        component={
          SettingsScreen
        }
        options={{
          tabBarLabel:
            'Ajustes',
        }}
      />
    </Tab.Navigator>
  );
}

type AuthScreen =
  | 'welcome'
  | 'signup'
  | 'app';

export default function AppNavigator() {
  const [
    screen,
    setScreen,
  ] =
    useState<AuthScreen>(
      'welcome',
    );

  /*
   * TEMPORÁRIO:
   *
   * enquanto a autenticação real
   * ainda não foi conectada,
   * controlamos as telas localmente.
   *
   * Depois este estado será
   * substituído pela sessão real
   * do usuário.
   */

  if (screen === 'welcome') {
    return (
      <LoginScreen
        onContinue={() => {
          /*
           * Google será conectado
           * posteriormente.
           */
        }}
        onCreateAccount={() =>
          setScreen(
            'signup',
          )
        }
        onLogin={() => {
          /*
           * Próximo passo:
           * tela Entrar.
           */
        }}
      />
    );
  }

  if (screen === 'signup') {
    return (
      <SignUpScreen
        onBack={() =>
          setScreen(
            'welcome',
          )
        }
        onLogin={() => {
          /*
           * Próximo passo:
           * tela Entrar.
           */
        }}
        onCreateAccount={() => {
          /*
           * Cadastro real será
           * conectado posteriormente.
           */
        }}
      />
    );
  }

  return (
    <NavigationContainer
      theme={
        navigationTheme
      }
    >
      <MainTabs />
    </NavigationContainer>
  );
}