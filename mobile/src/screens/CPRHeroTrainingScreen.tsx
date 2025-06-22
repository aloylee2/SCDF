// src/screens/CPRHeroTrainingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, Platform, StatusBar } from 'react-native';

import YellowCircle from '../assets/cpr_man_role_training/yellow_circle.jpg';
import YellowSLineVector from '../assets/cpr_man_role_training/yellow_s_line_vector.jpg';
import CPRHeroLogo from '../assets/cpr_man_role_training/cpr_hero_logo.jpg'; // Import the CPR Hero specific logo

const { width, height } = Dimensions.get('window');

const CPRHeroTrainingScreen: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Images */}
      <View style={styles.backgroundContainer}>
        <Image source={YellowCircle} style={styles.yellowCircle} />
        <Image source={YellowSLineVector} style={styles.yellowSLineVector} />
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        <Text style={styles.title}>CPR Hero</Text>
        <View style={styles.descriptionList}>
          <Text style={styles.descriptionBullet}>
            • You are focused on attending to the casualty straight.
          </Text>
          <Text style={styles.descriptionBullet}>
            • Check for pulse and breathing.
          </Text>
          <Text style={styles.descriptionBullet}>
            • Commence CPR when necessary.
          </Text>
          <Text style={styles.descriptionBullet}>
            • You may still retrieve AEDs along the way if convenient.
          </Text>
        </View>
        <Image source={CPRHeroLogo} style={styles.cprLogo} resizeMode="contain" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
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
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) + 50) : 80,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'left',
  },
  descriptionList: {
    width: '100%', // Ensure the list takes full width for consistent alignment
    marginBottom: 60, // Space before the logo
  },
  descriptionBullet: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left',
    lineHeight: 28,
    marginBottom: 5, // Small margin between bullet points
  },
  cprLogo: {
    paddingTop: 700,
    width: 150,
    height: 150,
    alignSelf: 'center', // Center the logo horizontally
  },
});

export default CPRHeroTrainingScreen;