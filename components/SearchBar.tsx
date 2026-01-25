import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="#ADB5BD"
        value={value}
        onChangeText={onChange}
        autoCorrect={false}
        autoCapitalize="words"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
});
