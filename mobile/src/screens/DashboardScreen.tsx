// src/screens/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import DashboardCard from '../components/DashboardCard';
import ActionCard from '../components/ActionCard';

// Import all necessary icons from the correct path.
// ***********************************************************************************
// ***** AS PER YOUR INSTRUCTION, THESE IMPORTS ARE NOT MODIFIED IN THIS RESPONSE ****
// ***********************************************************************************
import BellIcon from '../assets/logos_post_emergency/bell_icon_logo.png';
import CasesTodayLog from '../assets/logos_post_emergency/cases_today_log.png';
import ExtinguisherLog from '../assets/logos_post_emergency/extinguishier_logo.png';
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

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F265F', // Ensures the background color of the safe area is dark blue
  },
  scrollViewContent: {
    paddingBottom: 20,
    backgroundColor: '#F5F5F5', // Light grey background for the scrollable content
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // The marginTop creates the space for the absolute header and greeting.
    // It should start where the blue background's rounded corners begin in the prototype.
    marginTop: 180, // This value determines where the white scrollable content starts
  },
  topBackgroundFiller: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // Height to cover the full blue background section, including the status bar area on Android.
    height: 190 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0), // Adjust height to cover header and greeting
    backgroundColor: '#0F265F', // Dark blue background
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 0, // This should be behind the header and greeting text
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    // Dynamically adjust paddingTop to push header content below the status bar.
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
    // Header should be absolute or fixed to stay on top, or within the ScrollView but positioned.
    // For this layout, let's keep it relative to the SafeAreaView.
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2, // Ensure header is on top of everything else in its area
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
    color: '#FFFFFF', // Text color should be white for contrast on dark blue background
  },
  heartIconText: {
    color: '#E57373',
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
    tintColor: '#28A745',
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
    color: '#FFFFFF', // Ensure this text is white to be visible on the blue background
    position: 'absolute', // Kept absolute to overlay the blue filler
    // Position the greeting below the header.
    // Calculate based on header's paddingTop + header's intrinsic height.
    top: (Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10) + 30 + 20, // Approx header content top + logo/text height + spacing
    left: 15,
    right: 15,
    zIndex: 2, // Ensure greeting text is above the filler
  },
  dashboardCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    // This marginTop will now be relative to the scrollViewContent's top.
    // It needs to be adjusted based on the design, perhaps removing it if scrollViewContent's marginTop handles it.
    marginTop: 20, // Adjust this to control spacing from the top of the grey area
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
    paddingBottom: 10,
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
  }
});