import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  size?: number;
};

export default function LogoCX({
  size = 60,
}: Props) {

  const radius = size * 0.28;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
      ]}
    >

      <Text
        style={[
          styles.c,
          {
            fontSize: size * 0.62,
          },
        ]}
      >
        C
      </Text>

      <Text
        style={[
          styles.x,
          {
            fontSize: size * 0.56,
          },
        ]}
      >
        X
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#1565FF',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#1565FF',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
  },

  c: {
    color: '#FFFFFF',
    fontWeight: '900',

    position: 'absolute',

    left: '18%',
  },

  x: {
    color: '#57D2FF',
    fontWeight: '900',

    position: 'absolute',

    right: '15%',
  },

});