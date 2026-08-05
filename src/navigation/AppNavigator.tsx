import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarIcon: ({ color, size }) => {
            let icon = 'home';

            if (route.name === 'Histórico')
              icon = 'history';

            if (route.name === 'Favoritos')
              icon = 'favorite';

            if (route.name === 'Configurações')
              icon = 'settings';

            return (
              <MaterialIcons
                name={icon as any}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

        <Tab.Screen
          name="Histórico"
          component={HistoryScreen}
        />

        <Tab.Screen
          name="Favoritos"
          component={FavoritesScreen}
        />

        <Tab.Screen
          name="Configurações"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}