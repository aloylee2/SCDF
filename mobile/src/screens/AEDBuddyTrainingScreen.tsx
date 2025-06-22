// src/screens/AEDBuddhyTrainingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, Platform, StatusBar } from 'react-native';

// Reusing background images from CPRHeroTrainingScreen
import YellowCircle from '../assets/cpr_man_role_training/yellow_circle.jpg';
import YellowSLineVector from '../assets/cpr_man_role_training/yellow_s_line_vector.jpg';

// Assuming you have these AED specific images in your assets
import AEDDevice from '../assets/aed_buddy_role_training/aed_buddy_aed_logo.jpg';
import AEDMapSnippet from '../assets/aed_buddy_role_training/aed_buddy_map.jpg';

const { width, height } = Dimensions.get('window');

const AEDBuddyTrainingScreen: React.FC<any> = ({ navigation }) => {
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
    alignItems: 'flex-start', // Align content to the left
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
    marginBottom: 30, // Space before images
  },
  descriptionBullet: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left',
    lineHeight: 28,
    marginBottom: 5, // Small margin between bullet points
  },
  imageRow: {
    paddingTop: 250, // Space above the image row
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute images evenly
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10, // Add some padding within the row
  },
  aedImage: {
    width: width * 0.35, // Adjust size as needed
    height: width * 0.35, // Adjust size as needed
    marginRight: 10, // Space between images
  },
  mapImage: {
    width: width * 0.5, // Adjust size as needed
    height: width * 0.5, // Adjust size as needed
  },
});

export default AEDBuddyTrainingScreen;