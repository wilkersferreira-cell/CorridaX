import React from 'react';

import {
  Image,
  StyleSheet,
} from 'react-native';

type Props = {
  size?: number;
};

export default function LogoCX({
  size = 60,
}: Props) {
  return (
    <Image
      source={require('../../../assets/corridax-logo.png')}
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
        },
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    overflow: 'hidden',
  },
});