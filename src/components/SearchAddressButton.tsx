import React from 'react';
import { Button } from 'react-native-paper';

type Props = {
  onPress: () => void;
};

export default function SearchAddressButton({
  onPress,
}: Props) {
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      style={{
        marginBottom: 15,
      }}
    >
      Buscar Endereço
    </Button>
  );
}