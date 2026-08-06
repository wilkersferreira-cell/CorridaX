import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { Text } from 'react-native-paper';

type Props = {
  icon: string;
  title: string;
  value: string;
  color?: string;
};

export default function DashboardCard({
  icon,
  title,
  value,
  color = '#FFFFFF',
}: Props) {
  return (
    <View style={styles.card}>

      <View style={styles.header}>

        <Text style={styles.icon}>
          {icon}
        </Text>

        <Text style={styles.title}>
          {title}
        </Text>

      </View>

      <Text
        style={[
          styles.value,
          {
            color,
          },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    flex: 1,

    backgroundColor: '#18263D',

    borderRadius: 18,

    padding: 16,

    margin: 6,

    borderWidth: 1,
    borderColor: '#233754',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 6,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 18,
    marginRight: 8,
  },

  title: {
    color: '#93A8C7',
    fontSize: 13,
    fontWeight: '600',
  },

  value: {
    marginTop: 14,

    fontSize: 24,

    fontWeight: 'bold',
  },

});