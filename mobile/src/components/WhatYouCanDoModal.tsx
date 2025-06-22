// src/components/WhatYouCanDoModal.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, Linking, Alert } from 'react-native';

const { width } = Dimensions.get('window');

// Import your actual image assets for the "What you can do" modal
import CprAedIcon from '../assets/whatyoucan_do/cpr_aed_icon.png'; // Top icon [cite: image_6e61fa.jpg]
import Call995Icon from '../assets/whatyoucan_do/call_995_icon.png'; // Middle icon [cite: image_6e61fa.jpg]
import AssistParamedicsIcon from '../assets/whatyoucan_do/assist_paramedics_icon.png'; // Bottom icon [cite: image_6e61fa.jpg]

interface WhatYouCanDoModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCall995ForInstructions?: () => void; // Callback for the "Call 995" button
}

const WhatYouCanDoModal: React.FC<WhatYouCanDoModalProps> = ({ isVisible, onClose, onCall995ForInstructions }) => {

  const handleCall995 = () => {
    // You can replace this with actual call logic (e.g., Linking.openURL('tel:995'))
    Alert.alert("Calling 995", "Initiating call to 995 for instructions.");
    Linking.openURL('tel:995'); // Actual call intent
    onCall995ForInstructions?.(); // Trigger any additional logic
    onClose(); // Close modal after action
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
          <Text style={styles.title}>Here's what you can do:</Text>

          <View style={styles.actionItem}>
            <Image source={CprAedIcon} style={styles.actionIcon} resizeMode="contain" /> [cite: image_6e61fa.jpg]
            <Text style={styles.actionText}>Perform CPR and use AED</Text> [cite: image_6e61fa.jpg]
          </View>

          <View style={styles.actionItem}>
            <Image source={Call995Icon} style={styles.actionIcon} resizeMode="contain" /> [cite: image_6e61fa.jpg]
            <Text style={styles.actionText}>Call 995 when in doubt</Text> [cite: image_6e61fa.jpg]
          </View>

          <View style={styles.actionItem}>
            <Image source={AssistParamedicsIcon} style={styles.actionIcon} resizeMode="contain" /> [cite: image_6e61fa.jpg]
            <Text style={styles.actionText}>Assist paramedics</Text> [cite: image_6e61fa.jpg]
          </View>

          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>Ok, got it!</Text> [cite: image_6e61fa.jpg]
          </TouchableOpacity>

          <TouchableOpacity style={styles.call995Button} onPress={handleCall995}>
            <Text style={styles.call995ButtonText}>📞 Call 995 for instructions</Text> [cite: image_6e61fa.jpg]
          </TouchableOpacity>

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
    padding: 30,
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  actionIcon: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  actionText: {
    flex: 1, // Allows text to take remaining space
    fontSize: 16,
    color: '#333',
  },
  okButton: {
    backgroundColor: '#1E88E5', 
    borderRadius: 15,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10, // Space from call button
  },
  okButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  call995Button: {
    backgroundColor: 'transparent', // Red border [cite: image_6e61fa.jpg]
    borderWidth: 2,
    borderColor: '#FF0000',
    borderRadius: 15,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  call995ButtonText: {
    color: '#FF0000', // Red text [cite: image_6e61fa.jpg]
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WhatYouCanDoModal;