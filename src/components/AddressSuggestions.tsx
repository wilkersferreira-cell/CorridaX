import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

export interface Suggestion {
  display_name: string;
}

type Props = {
  data: Suggestion[];
  onSelect: (item: Suggestion) => void;
};

export default function AddressSuggestions({
  data,
  onSelect,
}: Props) {
  if (data.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.display_name}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)}>
          <Card style={styles.card}>
            <Card.Content>
              <Text numberOfLines={2}>
                📍 {item.display_name}
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
});