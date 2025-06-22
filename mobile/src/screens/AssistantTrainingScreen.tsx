// src/screens/AssistantTrainingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, Platform, StatusBar } from 'react-native';

import YellowCircle from '../assets/cpr_man_role_training/yellow_circle.jpg';
import YellowSLineVector from '../assets/cpr_man_role_training/yellow_s_line_vector.jpg';
// Reusing CPRHeroLogo as it's a CPR related icon
import CPRHeroLogo from '../assets/cpr_man_role_training/cpr_hero_logo.jpg';
// Assuming you have this Assistant specific image in your assets
import AssistantKeyboardLogo from '../assets/assistant_role_training/assistant_keyboard_logo.jpg'; // You'll need to add this image

const { width, height } = Dimensions.get('window');

const AssistantTrainingScreen: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Images */}
      <View style={styles.backgroundContainer}>
        <Image source={YellowCircle} style={styles.yellowCircle} />
        <Image source={YellowSLineVector} style={styles.yellowSLineVector} />
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        <Text style={styles.title}>Assistant</Text>
        <View style={styles.descriptionList}>
          <Text style={styles.descriptionBullet}>
            • You are to provide assistance where required, such as taking over CPR man when they are fatigued.
          </Text>
          <Text style={styles.descriptionBullet}>
            • You may be given special tasks such as to receive paramedics at hard to reach places.
          </Text>
        </View>
        <View style={styles.imageRow}>
          <Image source={CPRHeroLogo} style={styles.iconImage} resizeMode="contain" />
          <Image source={AssistantKeyboardLogo} style={styles.iconImage} resizeMode="contain" />
        </View>
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
  header: { // This header style is present in your original code but not actively used in the current JSX for AssistantTrainingScreen.
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#0A2542',
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) + 10) : 15,
  },
  backButton: { // Not actively used in the current JSX for AssistantTrainingScreen.
    paddingRight: 10,
  },
  backButtonText: { // Not actively used in the current JSX for AssistantTrainingScreen.
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerTitle: { // Not actively used in the current JSX for AssistantTrainingScreen.
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30, // Adjusted padding to match other training screens
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) + 50) : 80, // Adjusted padding for better visual
    alignItems: 'flex-start', // Align content to the left
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 30, // Larger font size for title
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'left', // Align left
  },
  descriptionList: {
    width: '100%',
    marginBottom: 30, // Space before images
  },
  descriptionBullet: {
    fontSize: 18, // Slightly larger font size for description
    color: '#666',
    textAlign: 'left',
    lineHeight: 28, // Adjusted line height for readability
    marginBottom: 5, // Small margin between bullet points
  },
  imageRow: {
    paddingTop: 250, // Space above the image row
    flexDirection: 'row',
    justifyContent: 'center', // Centered images
    alignItems: 'center',
    width: '100%',
    marginTop: 50, // Increased margin to bring images down further
    marginBottom: 20, // Optional: Add some space below the images if more content follows
  },
  iconImage: {
    width: 120,
    height: 120,
    marginHorizontal: 20, // Use horizontal margin to space them from each other and center
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

export default AssistantTrainingScreen;