// src/components/ShockCountModal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, Alert, ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');

// Import assets specifically for this modal
import RedRectangleIcon from '../assets/howmanyshock_delivered/rectangle_icon.png'; // For the modal title bar
import SelectedCircle from '../assets/howmanyshock_delivered/selected_circle.jpg'; // For selected number circle
import UnselectedCircle from '../assets/howmanyshock_delivered/unselected_circle.png'; // For unselected number circle
import TickLogo from '../assets/reassigned_aedbuddy/tick_logo.jpg'; // For the submit tick icon


interface ShockCountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (count: number) => void;
}

const ShockCountModal: React.FC<ShockCountModalProps> = ({ isVisible, onClose, onSubmit }) => {
  const [selectedShockCount, setSelectedShockCount] = useState<number | null>(null);

  const handleShockSubmit = () => {
    if (selectedShockCount === null) {
      Alert.alert("Please select a number", "You must choose how many shocks were delivered.");
      return;
    }
    onSubmit(selectedShockCount);
    onClose(); // Close the modal after submission
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Red Rectangle Title Bar */}
          <ImageBackground source={RedRectangleIcon} style={styles.titleBackground} resizeMode="stretch">
            <Text style={styles.modalTitle}>Task Alert</Text>
          </ImageBackground>

          <View style={styles.shockCounterContainer}>
            <Text style={styles.shockCounterQuestion}>How many shocks have been delivered?</Text>
            <View style={styles.shockButtonsRow}>
              {[0, 1, 2, 3, 4, '>5'].map((num, index) => {
                // Determine the value to compare against selectedShockCount
                const displayValue = num === '>5' ? 999 : num as number;

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.shockButtonWrapper}
                    onPress={() => setSelectedShockCount(displayValue)} // Use displayValue for setting state
                  >
                    <Image
                      source={selectedShockCount === displayValue ? SelectedCircle : UnselectedCircle} // Compare with displayValue
                      style={styles.shockButtonBackground}
                    />
                    <Text style={[
                      styles.shockButtonText,
                      selectedShockCount === displayValue && styles.selectedShockButtonText // Compare with displayValue
                    ]}>{num}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {/* Submit Shock Button - Positioned at bottom right */}
            <TouchableOpacity style={styles.submitShockButton} onPress={handleShockSubmit}>
              <Image source={TickLogo} style={styles.submitShockButtonImage} />
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
    paddingBottom: 20,
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
    overflow: 'hidden',
  },
  titleBackground: {
    width: '100%',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  shockCounterContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    position: 'relative',
  },
  shockCounterQuestion: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  shockButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shockButtonWrapper: {
    width: width / 5 - 20,
    height: width / 5 - 20,
    borderRadius: (width / 5 - 20) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    overflow: 'hidden',
  },
  shockButtonBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  shockButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    zIndex: 1,
  },
  selectedShockButtonText: {
    color: 'white',
  },
  submitShockButton: {
    backgroundColor: 'transparent',
    borderRadius: 40,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -10,
    right: 10,
  },
  submitShockButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});

export default ShockCountModal;