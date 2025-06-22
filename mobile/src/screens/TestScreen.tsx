// src/screens/TestScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import your new modal components
import RoleReassignmentAlert from '../components/RoleReassignmentAlert';
import ShockCountModal from '../components/ShockCountModal'; // <--- NEW IMPORT
import WhatYouCanDoModal from '../components/WhatYouCanDoModal';
import PostEmergencyOverlay from '../components/PostEmergencyOverlay'; // Import PostEmergencyOverlay


// Data for PostEmergencyOverlay
import { aiPortraits } from '../data/aiPortraits';

// Assets for Role Reassignment Alert
import AedBuddyImage from '../assets/reassigned_aedbuddy/aed_buddy.png'; // Reassignment image


export default function TestScreen() {
  const navigation = useNavigation();

  // State for RoleReassignmentAlert
  const [isRoleAlertVisible, setRoleAlertVisible] = useState(false);
  // State for ShockCountModal
  const [isShockTaskAlertVisible, setShockTaskAlertVisible] = useState(false);

  // State for WhatYouCanDoModal
  const [isWhatYouCanDoModalVisible, setWhatYouCanDoModalVisible] = useState(false);

  // Handlers for RoleReassignmentAlert
  const handleAcceptRole = () => {
    console.log("Role Accepted!");
    setRoleAlertVisible(false);
    // Add navigation or other logic here
    // e.g., navigation.navigate('AEDBuddyTraining');
  };

  const handleDeclineRole = () => {
    console.log("Role Declined!");
    setRoleAlertVisible(false);
    // Add logic for role decline, maybe navigate back or to a different screen
  };

  // Handlers for ShockCountModal (NEW)
  const handleShockCountSubmit = (count: number) => {
    console.log(`Shocks delivered: ${count}`);
    setShockTaskAlertVisible(false);
    // Logic to record shock count
  };

  // Handlers for WhatYouCanDoModal
  const handleShowWhatYouCanDoModal = () => {
    setWhatYouCanDoModalVisible(true);
  };

  const handleCloseWhatYouCanDoModal = () => {
    setWhatYouCanDoModalVisible(false);
  };

  const handleCall995FromModal = () => {
    console.log("User wants to call 995 for instructions from modal.");
    // Actual call logic is in the modal itself
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Test Modals Here</Text>

        <View style={styles.buttonGroup}>
          <Text style={styles.buttonGroupTitle}>Role/Task Alerts:</Text>
          <Button title="Show AED Reassignment Alert" onPress={() => setRoleAlertVisible(true)} />
          <View style={{ height: 10 }} />
          <Button title="Show Shock Count Task Alert" onPress={() => setShockTaskAlertVisible(true)} /> {/* <--- Uses new modal */}
        </View>


        <View style={styles.buttonGroup}>
          <Text style={styles.buttonGroupTitle}>"What You Can Do" Info:</Text>
          <Button title="Show What You Can Do Modal" onPress={handleShowWhatYouCanDoModal} />
        </View>

        {/* Role Reassignment Alert Modal (now simplified) */}
        <RoleReassignmentAlert
          isVisible={isRoleAlertVisible}
          onClose={() => setRoleAlertVisible(false)}
          title="You are reassigned to AED Buddy!"
          message="You are closest to the AED. Grab it and proceed to casualty"
          imageSource={AedBuddyImage}
          onAccept={handleAcceptRole}
          onDecline={handleDeclineRole}
        />


        {/* Shock Count Task Alert Modal (NEW COMPONENT) */}
        <ShockCountModal
          isVisible={isShockTaskAlertVisible}
          onClose={() => setShockTaskAlertVisible(false)}
          onSubmit={handleShockCountSubmit}
        />

        {/* What You Can Do Modal */}
        <WhatYouCanDoModal
          isVisible={isWhatYouCanDoModalVisible}
          onClose={handleCloseWhatYouCanDoModal}
          onCall995ForInstructions={handleCall995FromModal}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '80%',
    marginBottom: 25,
    alignItems: 'center',
  },
  buttonGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
});