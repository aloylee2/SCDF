// src/components/PostEmergencyOverlay.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

// Import only assets relevant for this initial overlay
import AiPortrait from '../assets/logos_post_emergency/ai_portrait.jpeg'; // This should be the generated image

interface PostEmergencyOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  // onExpand now takes caseDetails to pass to the next screen
  onExpand: (details: { date: string; responders: string; description: string }) => void;
  caseDetails: { // Keep caseDetails here to pass them to the next screen
    date: string;
    responders: string;
    description: string;
  };
}

const { width } = Dimensions.get('window');

const PostEmergencyOverlay: React.FC<PostEmergencyOverlayProps> = ({ isVisible, onClose, onExpand, caseDetails }) => {
  return (
    <Modal
      animationType="fade" // Or "slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // Handles Android back button
    >
      <TouchableOpacity
        style={styles.overlayBackground}
        activeOpacity={1} // Keep this at 1 so tapping it doesn't trigger anything other than the onPress
        onPress={onClose} // Close when tapping outside the central card
      >
        <View style={styles.centeredView}>
          <TouchableOpacity
            activeOpacity={1} // Prevent closing when tapping inside the card
            onPress={() => {}} // Empty function to consume the touch event
            style={styles.modalView}
          >
            {/* Header section with text */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>WE APPRECIATE YOUR</Text>
              <Text style={styles.headerSubtitle}>HEROIC EFFORTS</Text>
              <Text style={styles.headerDescription}>
                Do save this uniquely generated group portrait of you and your fellow CFRs
              </Text>
            </View>

            {/* AI Generated Image */}
            <Image
              source={AiPortrait} // Ensure this path is correct and the image exists
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Expand Button */}
            {/* Call onExpand and pass caseDetails */}
            <TouchableOpacity style={styles.expandButton} onPress={() => onExpand(caseDetails)}>
              <Text style={styles.expandButtonText}>CLICK TO EXPAND</Text>
            </TouchableOpacity>

            <Text style={styles.tapToExit}>Tap anywhere to exit</Text>

          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Take full width
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9, // Adjust width to be 90% of screen width
    // Removed explicit height to allow content to dictate height, but if it looks too tall,
    // you might need a maxHeight and make sections scrollable.
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000', // Red color for "WE APPRECIATE YOUR"
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 28, // Larger for "HEROIC EFFORTS"
    fontWeight: 'bold',
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  heroImage: {
    width: '100%',
    height: width * 0.5, // Make image height proportional to width
    borderRadius: 10,
    marginBottom: 15,
  },
  expandButton: {
    backgroundColor: '#FF0000', // Red button
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: '90%', // Make button slightly narrower than full width
    alignItems: 'center',
  },
  expandButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tapToExit: {
    marginTop: 10,
    fontSize: 12,
    color: '#999',
  },
});

export default PostEmergencyOverlay;