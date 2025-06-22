// src/components/PostEmergencyOverlay.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { aiPortraits } from '../data/aiPortraits'; // Import your data

interface PostEmergencyOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  onExpand: (details: { image: any; date: string; responders: string; description: string }) => void;
}

const { width } = Dimensions.get('window');

const PostEmergencyOverlay: React.FC<PostEmergencyOverlayProps> = ({ isVisible, onClose, onExpand }) => {
  const [currentPortrait, setCurrentPortrait] = useState<typeof aiPortraits[0] | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Randomly select a portrait when the modal becomes visible
      const randomIndex = Math.floor(Math.random() * aiPortraits.length);
      setCurrentPortrait(aiPortraits[randomIndex]);
    } else {
      setCurrentPortrait(null); // Clear the portrait when hidden
    }
  }, [isVisible]);

  if (!currentPortrait) {
    return null; // Don't render if no portrait is selected yet (or modal is not visible)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlayBackground}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.centeredView}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.modalView}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>WE APPRECIATE YOUR</Text>
              <Text style={styles.headerSubtitle}>HEROIC EFFORTS</Text>
              <Text style={styles.headerDescription}>
                Do save this uniquely generated group portrait of you and your fellow CFRs
              </Text>
            </View>

            <Image
              source={currentPortrait.image} // Use the randomly selected image
              style={styles.heroImage}
              resizeMode="cover"
            />

            <TouchableOpacity style={styles.expandButton} onPress={() => onExpand(currentPortrait)}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    width: width * 0.9,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 28,
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
    height: width * 0.5,
    borderRadius: 10,
    marginBottom: 15,
  },
  expandButton: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: '90%',
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