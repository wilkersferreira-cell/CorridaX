import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

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

import {
  getAuth,
  onAuthStateChanged,
  type User,
} from '@react-native-firebase/auth';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';

import {
  signInWithGoogle,
} from '../services/authService';

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
  | 'signin';

export default function AppNavigator() {
  const [
    authScreen,
    setAuthScreen,
  ] =
    useState<AuthScreen>(
      'welcome',
    );

  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null,
    );

  const [
    initializing,
    setInitializing,
  ] = useState(true);

  useEffect(() => {
    const auth =
      getAuth();

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (
          firebaseUser,
        ) => {
          setUser(
            firebaseUser,
          );

          setInitializing(
            false,
          );
        },
      );

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={
            COLORS.primaryLight
          }
        />
      </View>
    );
  }

  if (user) {
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

  if (
    authScreen ===
    'signup'
  ) {
    return (
      <SignUpScreen
        onBack={() =>
          setAuthScreen(
            'welcome',
          )
        }
        onLogin={() =>
          setAuthScreen(
            'signin',
          )
        }
      />
    );
  }

  if (
    authScreen ===
    'signin'
  ) {
    return (
      <SignInScreen
        onBack={() =>
          setAuthScreen(
            'welcome',
          )
        }
        onCreateAccount={() =>
          setAuthScreen(
            'signup',
          )
        }
      />
    );
  }

  return (
    <LoginScreen
      onContinue={async () => {
        const result =
          await signInWithGoogle();

        if (
          !result.success &&
          !result.cancelled
        ) {
          console.warn(
            result.message,
          );
        }
      }}
      onCreateAccount={() =>
        setAuthScreen(
          'signup',
        )
      }
      onLogin={() =>
        setAuthScreen(
          'signin',
        )
      }
    />
  );
}

const styles =
  StyleSheet.create({
    loadingContainer: {
      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        COLORS.background,
    },
  });