// src/screens/CPRHeroTrainingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, Platform, StatusBar, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

import YellowCircle from '../assets/cpr_man_role_training/yellow_circle.jpg';
import YellowSLineVector from '../assets/cpr_man_role_training/yellow_s_line_vector.jpg';
import CPRHeroLogo from '../assets/cpr_man_role_training/cpr_hero_logo.jpg';

const { width, height } = Dimensions.get('window');

const CPRHeroTrainingScreen: React.FC<any> = () => { // Remove navigation prop, use hook instead
  const navigation = useNavigation() as any; // Type assertion to bypass TS error

  const handleStartQuiz = () => {
    navigation.navigate('CPRHeroQuiz'); // Navigate to the new quiz screen
  };

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

        {/* Quiz Button */}
        <TouchableOpacity style={styles.quizButton} onPress={handleStartQuiz}>
          <Text style={styles.quizButtonText}>Start Quiz</Text>
        </TouchableOpacity>
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
    width: '100%',
    marginBottom: 60,
  },
  descriptionBullet: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left',
    lineHeight: 28,
    marginBottom: 5,
  },
  cprLogo: {
    // Adjust paddingTop for proper positioning relative to the content and button
    // It's currently very high, let's place it more logically
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20, // Add some margin from the description list
    marginBottom: 40, // Space between logo and quiz button
  },
  quizButton: {
    backgroundColor: '#007AFF', // A distinct color for the quiz button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center', // Center the button
    marginTop: 'auto', // Push to the bottom of the content area
    marginBottom: 20, // Margin from the bottom of the screen
  },
  quizButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CPRHeroTrainingScreen;