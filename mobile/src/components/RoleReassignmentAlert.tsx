// src/components/RoleReassignmentAlert.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');

// Import assets for role reassignment
import CrossLogo from '../assets/reassigned_aedbuddy/cross_logo.jpg';     // Your cross icon for decline
import TickLogo from '../assets/reassigned_aedbuddy/tick_logo.jpg';       // Your tick icon for accept

// New asset for the red title background
import RedRectangleIcon from '../assets/howmanyshock_delivered/rectangle_icon.png'; // This asset will be used for the red rectangle title background

interface RoleReassignmentAlertProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string; // Message is required for reassignment
  imageSource: any; // Image is required for reassignment
  onAccept: () => void;
  onDecline: () => void;
}

const RoleReassignmentAlert: React.FC<RoleReassignmentAlertProps> = ({
  isVisible,
  onClose,
  title,
  message,
  imageSource,
  onAccept,
  onDecline,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Red Rectangle with Title */}
          <ImageBackground source={RedRectangleIcon} style={styles.titleBackground} resizeMode="stretch">
            <Text style={styles.modalTitle}>{title}</Text>
          </ImageBackground>

          {/* Image and Description side-by-side */}
          <View style={styles.contentRow}>
            <Image source={imageSource} style={styles.modalImage} resizeMode="contain" />
            <Text style={styles.modalMessage}>{message}</Text>
          </View>

          {/* Accept Role Question */}
          <Text style={styles.acceptRoleQuestion}>Accept role?</Text>

          {/* Confirmation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
              <Image source={CrossLogo} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Image source={TickLogo} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingBottom: 20, // Reduced top padding, increased bottom for buttons
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    overflow: 'hidden', // Ensures content stays within rounded borders
  },
  titleBackground: {
    width: '100%',
    paddingVertical: 15, // Adjust padding to make the red bar taller/shorter
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Space below the red bar
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white', // Text color for title is white on red background
  },
  contentRow: {
    flexDirection: 'row', // Image and message side-by-side
    alignItems: 'center', // Vertically align items in the center
    paddingHorizontal: 20, // Add some padding from the sides of the modal
    marginBottom: 20,
  },
  modalMessage: {
    flex: 1, // Allows message to take remaining space
    fontSize: 16,
    textAlign: 'left', // Align text to the left within its flexible container
    marginLeft: 15, // Space between image and text
    color: '#333',
  },
  modalImage: {
    width: 80, // Smaller image for side-by-side layout
    height: 80,
    resizeMode: 'contain',
  },
  acceptRoleQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20, // Space between question and buttons
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 0, // Adjusted as question provides margin
  },
  acceptButton: {
    backgroundColor: 'transparent', // Images provide the look
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default RoleReassignmentAlert;