// src/screens/AEDBuddhyTrainingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, Platform, StatusBar, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

// Reusing background images from CPRHeroTrainingScreen
import YellowCircle from '../assets/cpr_man_role_training/yellow_circle.jpg';
import YellowSLineVector from '../assets/cpr_man_role_training/yellow_s_line_vector.jpg';

// Assuming you have these AED specific images in your assets
import AEDDevice from '../assets/aed_buddy_role_training/aed_buddy_aed_logo.jpg';
import AEDMapSnippet from '../assets/aed_buddy_role_training/aed_buddy_map.jpg';

const { width, height } = Dimensions.get('window');

const AEDBuddyTrainingScreen: React.FC<any> = () => { // Remove navigation prop, use hook instead
  const navigation = useNavigation<any>(); // Use 'any' to bypass type error

  const handleStartQuiz = () => {
    navigation.navigate('AedBuddyQuiz'); // Navigate to the new AED Buddy quiz screen
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
        <Text style={styles.title}>AED Buddy</Text>
        <View style={styles.descriptionList}>
          <Text style={styles.descriptionBullet}>
            • You are tasked to retrieve the AED machine.
          </Text>
          <Text style={styles.descriptionBullet}>
            • Follow the map to find the nearest AED machines.
          </Text>
          <Text style={styles.descriptionBullet}>
            • Indicate when the AED is collected by pressing the green button.
          </Text>
        </View>
        <View style={styles.imageRow}>
          <Image source={AEDDevice} style={styles.aedImage} resizeMode="contain" />
          <Image source={AEDMapSnippet} style={styles.mapImage} resizeMode="contain" />
        </View>

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
    marginBottom: 30,
  },
  descriptionBullet: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left',
    lineHeight: 28,
    marginBottom: 5,
  },
  imageRow: {
    // Adjust paddingTop for proper positioning relative to the content and button
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20, // Adjusted from paddingTop for better flow
    marginBottom: 40, // Space between images and quiz button
  },
  aedImage: {
    width: width * 0.35,
    height: width * 0.35,
    marginRight: 10,
  },
  mapImage: {
    width: width * 0.5,
    height: width * 0.5,
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

export default AEDBuddyTrainingScreen;