// src/screens/LearnYourRolesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, SafeAreaView, Platform, StatusBar } from 'react-native';

import YellowCircle from '../assets/cpr_man_role_training/yellow_circle.jpg'; //
import YellowSLineVector from '../assets/cpr_man_role_training/yellow_s_line_vector.jpg'; //

const { width, height } = Dimensions.get('window');

const LearnYourRolesScreen: React.FC<any> = ({ navigation }) => {
  const roles = [
    'AED Buddy',
    'CPR Hero',
    'Assistant',
    'Crowd controller',
    'Vehicle Receiver',
  ];

  const handleRoleSelection = (role: string) => {
    switch (role) {
      case 'AED Buddy':
        navigation.navigate('AEDBuddyTraining');
        break;
      case 'CPR Hero':
        navigation.navigate('CPRHeroTraining');
        break;
      case 'Assistant':
        navigation.navigate('AssistantTraining');
        break;
      case 'Crowd controller':
        navigation.navigate('CrowdControllerTraining');
        break;
      case 'Vehicle Receiver':
        navigation.navigate('VehicleReceiverTraining');
        break;
      default:
        console.log(`Selected role: ${role} (no specific training screen yet)`);
        // Fallback or a generic info screen
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={styles.backgroundContainer}>
        {/* Yellow circle background */}
        <Image source={YellowCircle} style={styles.yellowCircle} />
        {/* Yellow S-line vector background */}
        <Image source={YellowSLineVector} style={styles.yellowSLineVector} />
      </View>

      <View style={styles.contentContainer}>

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
              onPress={() => handleRoleSelection(role)}
            >
              <Text style={styles.roleButtonText}>{role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) + 20) : 50,
    alignItems: 'flex-start',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) + 15) : 45,
    right: 25,
    padding: 5,
    zIndex: 1,
  },
  closeButtonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0A2542',
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    color: '#555',
    textAlign: 'left',
    marginBottom: 30,
    width: '100%',
    lineHeight: 22,
  },
  rolesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  roleButton: {
    backgroundColor: '#3F62A4',
    borderRadius: 10,
    paddingVertical: 18,
    marginBottom: 15,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  roleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LearnYourRolesScreen;