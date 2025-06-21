// src/screens/CrowdControllerTrainingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const CrowdControllerTrainingScreen: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crowd Controller</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, Crowd Controller!</Text>
        <Text style={styles.description}>
          This section covers techniques for managing crowds during an emergency,
          ensuring safety for both responders and bystanders.
        </Text>
        <Text style={styles.comingSoon}>More content coming soon!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#0A2542',
  },
  backButton: {
    paddingRight: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerTitle: {
    paddingTop: 20,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  comingSoon: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#999',
    marginTop: 30,
  },
});

export default CrowdControllerTrainingScreen;