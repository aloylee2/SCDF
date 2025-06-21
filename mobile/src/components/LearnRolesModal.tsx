// src/components/LearnRolesModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

interface LearnRolesModalProps {
  isVisible: boolean;
  onClose: () => void;
  // onSelectRole: (role: string) => void; // This prop needs to be updated or passed from parent
  navigation: any; // Add navigation prop to allow navigating from here
}

const LearnRolesModal: React.FC<LearnRolesModalProps> = ({
  isVisible,
  onClose,
  navigation, // Destructure navigation
}) => {
  const roles = [
    'AED Buddy',
    'CPR Hero',
    'Assistant',
    'Crowd controller',
    'Vehicle Receiver',
  ];

  const handleRoleSelection = (role: string) => {
    onClose(); // Always close the modal first
    if (role === 'CPR Hero') {
      navigation.navigate('CPRManTraining'); // Navigate to the new screen
    } else {
      console.log(`Selected role: ${role}`);
      // Handle other roles or show a generic message
      // Example: navigation.navigate('RoleDetailScreen', { roleName: role });
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <Text style={styles.title}>LEARN YOUR ROLES</Text>
          <Text style={styles.description}>
            These are roles you will be assigned in order of priority level. Click to find out more
          </Text>

          {/* Role Buttons */}
          <View style={styles.rolesContainer}>
            {roles.map((role, index) => (
              <TouchableOpacity
                key={index}
                style={styles.roleButton}
                onPress={() => handleRoleSelection(role)} // Use the new handler
              >
                <Text style={styles.roleButtonText}>{role}</Text>
              </TouchableOpacity>
            ))}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
    zIndex: 1,
  },
  closeButtonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A2542',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  rolesContainer: {
    width: '100%',
  },
  roleButton: {
    backgroundColor: '#3F62A4',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  roleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LearnRolesModal;