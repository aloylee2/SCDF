// src/screens/SecondScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SecondScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Second Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});
