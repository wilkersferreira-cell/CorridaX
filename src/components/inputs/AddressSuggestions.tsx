import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { Card, Text } from 'react-native-paper';

export interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
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
    <View style={styles.container}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={`${item.lat}-${item.lon}-${index}`}
          activeOpacity={0.8}
          onPress={() => onSelect(item)}
        >
          <Card style={styles.card}>
            <Card.Content>
              <Text numberOfLines={2}>
                📍 {item.display_name}
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  card: {
    marginBottom: 8,
    borderRadius: 12,
  },
});