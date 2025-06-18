// src/screens/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import DashboardCard from '../components/DashboardCard';
import ActionCard from '../components/ActionCard';
import PostEmergencyOverlay from '../components/PostEmergencyOverlay';
import { fetchData } from '../services/api'; // Assuming you have a service to fetch data
import PostEmergencyDetailScreen from './PostEmergencyDetailScreen'; // NEW IMPORT



// Importing assets for the dashboard
import BellIcon from '../assets/logos_post_emergency/bell_icon_logo.png';
import CasesTodayLog from '../assets/logos_post_emergency/cases_today_log.png';
import ExtinguisherLog from '../assets/logos_post_emergency/extinguisher_logo.png';
import FireIcon from '../assets/logos_post_emergency/fire_logo.jpg';
import GettingStartingLogo from '../assets/logos_post_emergency/getting_starting_logo.png';
import HeartIconLogo from '../assets/logos_post_emergency/heart_icon_logo.png';
import InformationAlert0nLogo from '../assets/logos_post_emergency/information_alert_on_logo.png';
import MyResponderLogo from '../assets/logos_post_emergency/my_reSPONDER_logo.png'; // This is likely the "myRESPONDER" text logo itself
import PeopleClappingIcon from '../assets/logos_post_emergency/people_clapping_icon_logo.png';


export default function DashboardScreen({ navigation }: any) {
  const [dashboardData, setDashboardData] = useState<any>({
    cardiacArrest: 3,
    fire: 4,
    registeredCFRs: '220,179',
    casesToday: 14,
    casesResponded: 7,
  });

  // State to manage the visibility of the post-emergency overlay
  const [showPostEmergencyOverlay, setShowPostEmergencyOverlay] = useState(false);

  // Function to simulate showing the overlay (e.g., after an emergency response)
  const triggerPostEmergencyOverlay = () => {
    setShowPostEmergencyOverlay(true);
  };

  // Function to close the overlay
  const closePostEmergencyOverlay = () => {
    setShowPostEmergencyOverlay(false);
  };

  // Modified to receive caseDetails and navigate
  const handleExpandOverlayContent = (details: { date: string; responders: string; description: string }) => {
    setShowPostEmergencyOverlay(false); // Close the current overlay
    navigation.navigate('PostEmergencyDetail', { caseDetails: details }); // Navigate to the new detail screen
    console.log('Expand button clicked! Navigating to PostEmergencyDetailScreen with details:', details);
  };

  useEffect(() => {
    console.log('showPostEmergencyOverlay state changed to:', showPostEmergencyOverlay);
  }, [showPostEmergencyOverlay]);

  // Define the caseDetails object here to pass to the overlay and detail screen
  const currentCaseDetails = {
    date: 'On 16/06/2025',
    responders: 'Rohit | Alphys | Kaiao | Sean',
    description: 'Responded to a case of cardiac arrest at Block 227 Jurong East Street 32, successfully reviving the patient.',
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* StatusBar configuration for Android to make status bar background match header color */}
      <StatusBar barStyle="light-content" backgroundColor="#0F265F" />

      {/* Header and greeting text are rendered first so they are "behind" the ScrollView's content
          but "on top" of the topBackgroundFiller when zIndex is properly managed. */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* As discussed, if MyResponderLogo is the text logo, you might see duplication.
              If it's the square SCDF logo, this is correct for the prototype. */}
          <Image source={MyResponderLogo} style={styles.logo} />
          <Text style={styles.appName}>myRESP<Text style={styles.heartIconText}>♡</Text>NDER</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.alertButton}>
            <Text style={styles.alertText}>Alert on</Text>
            <Image source={InformationAlert0nLogo} style={styles.alertIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bellButton}>
            <Image source={BellIcon} style={styles.bellIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting text positioned over the blue background */}
      <Text style={styles.greeting}>Good job, you've responded to {dashboardData.casesResponded} cases!</Text>

      {/* This filler view creates the blue background for the header and greeting */}
      <View style={styles.topBackgroundFiller} />

      {/* Main ScrollView for the dashboard content, allowing content to scroll */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {/* Dashboard cards container - these appear within the scrollable content */}
        <View style={styles.dashboardCardsContainer}>
          <DashboardCard
            title="Cardiac arrest"
            value={dashboardData.cardiacArrest}
            iconSource={HeartIconLogo}
            color="#E57373"
          />
          <DashboardCard
            title="Fire"
            value={dashboardData.fire}
            iconSource={FireIcon}
            color="#FFB300"
          />
          <DashboardCard
            title="Registered CFRs"
            value={dashboardData.registeredCFRs}
            iconSource={PeopleClappingIcon}
            color="#64B5F6"
          />
          <DashboardCard
            title="Cases today"
            value={dashboardData.casesToday}
            iconSource={CasesTodayLog}
            color="#81C784"
          />
        </View>

        {/* "Start your CFR journey here" section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Start your CFR journey here</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Second', { from: 'CFRJourney' })}>
            <Text style={styles.viewMoreText}>View more</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <ActionCard
            title="Getting started as a CFR"
            description="Learn more about the role of a Community First Responder."
            iconSource={GettingStartingLogo}
            onPress={() => navigation.navigate('Second', { module: 'GettingStarted' })}
          />
          <ActionCard
            title="Extinguishing a fire"
            description="Learn how you can assist in extinguishing a fire."
            iconSource={ExtinguisherLog}
            onPress={() => navigation.navigate('Second', { module: 'FireExtinguishing' })}
          />
        </ScrollView>

        {/* "Latest community news" section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest community news</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Second', { from: 'News' })}>
            <Text style={styles.viewMoreText}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.newsPlaceholder}>
          <Text style={styles.newsPlaceholderText}>News items will appear here...</Text>
        </View>


        {/* TEMPORARY BUTTON TO TRIGGER OVERLAY */}
        <TouchableOpacity style={styles.tempOverlayButton} onPress={triggerPostEmergencyOverlay}>
            <Text style={styles.tempOverlayButtonText}>Show Post-Emergency Overlay</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* PostEmergencyOverlay (Frame 7) */}
      <PostEmergencyOverlay
        isVisible={showPostEmergencyOverlay}
        onClose={closePostEmergencyOverlay}
        onExpand={handleExpandOverlayContent} // Pass the modified handler
        caseDetails={currentCaseDetails} // Pass the actual case details
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A2542', // Primary dark blue background for consistency with header
  },
  topBackgroundFiller: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 190 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0), // Adjust height to cover header and greeting
    backgroundColor: '#0A2542', // Dark blue background
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 0, // This should be behind the header and greeting text
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    // Adjust paddingTop for more space from the top
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 30 : 40,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2, // Ensure header is on top
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heartIconText: {
    color: '#FF6B6B', // Red heart
    fontSize: 22,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  alertText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  alertIcon: {
    width: 18,
    height: 18,
    tintColor: '#28A745', // Green tint for the alert icon
    resizeMode: 'contain',
  },
  bellButton: {
    padding: 5,
  },
  bellIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    position: 'absolute',
    // Adjust top based on header's height and padding
    top: (Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 20) + 30 + 15, // Adjusted based on new header padding
    left: 15,
    right: 15,
    zIndex: 2, // Ensure greeting text is above the filler
  },
  scrollViewContent: {
    paddingBottom: 150, // Increased to make the test button visible
    backgroundColor: '#F5F5F5', // Light grey background for the scrollable content
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 180, // This value aligns with the topBackgroundFiller height
    paddingTop: 20, // Padding inside the scroll view after the curve
  },
  dashboardCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewMoreText: {
    color: '#007AFF',
    fontSize: 16,
  },
  horizontalScroll: {
    paddingLeft: 15,
    marginBottom: 20,
    paddingBottom: 10, // Add padding at bottom to prevent clipping on some action cards
  },
  newsPlaceholder: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  newsPlaceholderText: {
    color: '#666',
  },
  tempOverlayButton: {
    backgroundColor: '#FF6B6B', // A prominent color for the test button
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 40, // Space it out from bottom nav or end of content
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempOverlayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});