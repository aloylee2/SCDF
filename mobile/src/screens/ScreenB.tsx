import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ScreenB() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Role B</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, color: 'green' },
});
