// src/screens/VehicleReceiverTrainingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, Platform, StatusBar } from 'react-native';

import YellowCircle from '../assets/cpr_man_role_training/yellow_circle.jpg';
import YellowSLineVector from '../assets/cpr_man_role_training/yellow_s_line_vector.jpg';

const { width, height } = Dimensions.get('window');

const VehicleReceiverTrainingScreen: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Images */}
      <View style={styles.backgroundContainer}>
        <Image source={YellowCircle} style={styles.yellowCircle} />
        <Image source={YellowSLineVector} style={styles.yellowSLineVector} />
      </View>


      {/* Main Content */}
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, Vehicle Receiver!</Text>
        <Text style={styles.description}>
          This section provides essential information for guiding emergency vehicles to the scene
          and ensuring clear access for emergency personnel.
        </Text>
        <Text style={styles.comingSoon}>More content coming soon!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', // Changed to transparent
  },
  // New Background Styles
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  yellowCircle: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    bottom: -height * 0.3,
    right: -width * 0.4,
    resizeMode: 'contain',
    opacity: 0.3,
    transform: [{ rotate: '15deg' }],
  },
  yellowSLineVector: {
    position: 'absolute',
    width: width * 1.0,
    height: height * 0.6,
    top: height * 0.1,
    left: -width * 0.1,
    resizeMode: 'contain',
    opacity: 0.3,
    transform: [{ rotate: '-10deg' }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#0A2542', // Dark blue header background (kept opaque)
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) + 10) : 15, // Adjusted for status bar
  },
  backButton: {
    paddingRight: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Changed to transparent
    paddingTop: 0, // Reset padding top as header handles it
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

export default VehicleReceiverTrainingScreen;