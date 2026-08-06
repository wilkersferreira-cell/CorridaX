import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

type Props = {
  onPress: () => void;
};

export default function SwapLocationsButton({
  onPress,
}: Props) {
  return (
    <IconButton
      icon="swap-vertical"
      mode="contained"
      size={24}
      onPress={onPress}
      style={styles.button}
      containerColor="#1D4ED8"
      iconColor="#FFFFFF"
    />
  );
}

const styles = StyleSheet.create({

  button: {
    alignSelf: 'center',
    marginVertical: 4,
  },

});