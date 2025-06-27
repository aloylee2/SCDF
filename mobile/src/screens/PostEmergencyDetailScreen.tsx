// src/screens/PostEmergencyDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { aiPortraits } from '../data/aiPortraits'; // Import aiPortraits to type correctly

// Import assets needed for this detailed screen
import SCDFLogo from '../assets/logos_post_emergency/scdf_logo.png';
import InstagramLogo from '../assets/logos_post_emergency/instagram_logo.png';
import FacebookLogo from '../assets/logos_post_emergency/facebook_logo.png';
import TikTokLogo from '../assets/logos_post_emergency/tiktok_logo.png';
// You no longer import AiPortrait directly here as it comes from params
import SaveIcon from '../assets/logos_post_emergency/save_icon_logo.png'; 

const { width } = Dimensions.get('window');

export default function PostEmergencyDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Define the type for the route parameters, matching the structure of an aiPortrait entry
  type PostEmergencyDetailScreenRouteParams = {
    caseDetails: typeof aiPortraits[0]; // Now directly type it as one of your portrait objects
  };

  const { caseDetails } = route.params as PostEmergencyDetailScreenRouteParams;

  const handleSaveImage = () => {
    console.log('Saving photo to device from detail screen...');
    // Implement actual save logic here (e.g., using expo-media-library or similar)
    // You would use caseDetails.image here to get the specific image to save.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>WE APPRECIATE YOUR</Text>
          <Text style={styles.headerSubtitle}>HEROIC EFFORTS</Text>
          <Text style={styles.headerDescription}>
            Do save this uniquely generated group portrait of you and your fellow CFRs
          </Text>
        </View>

        <Image
          source={caseDetails.image} // Use the image from caseDetails
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.caseDetailsContainer}>
            <Text style={styles.caseDetailsDate}>{caseDetails.date}</Text>
            <Text style={styles.caseDetailsResponders}>{caseDetails.responders}</Text>
            <Text style={styles.caseDetailsDescription}>{caseDetails.description}</Text>
            <Image source={SCDFLogo} style={styles.scdfLogo} />
        </View>

        <View style={styles.socialShareContainer}>
          <Text style={styles.shareText}>Click to share</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity><Image source={InstagramLogo} style={styles.socialIcon} /></TouchableOpacity>
            <TouchableOpacity><Image source={FacebookLogo} style={styles.socialIcon} /></TouchableOpacity>
            <TouchableOpacity><Image source={TikTokLogo} style={styles.socialIcon} /></TouchableOpacity>
            <TouchableOpacity onPress={handleSaveImage}>
                <Image source={SaveIcon} style={styles.saveIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollViewContent: {
    paddingBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 15,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    marginBottom: 15,
  },
  heroImage: {
    width: width * 0.9,
    height: width * 0.5,
    borderRadius: 10,
    marginBottom: 15,
  },
  caseDetailsContainer: {
    width: width * 0.9,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 15,
  },
  caseDetailsDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  caseDetailsResponders: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  caseDetailsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  scdfLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
  },
  socialShareContainer: {
    width: width * 0.9,
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  shareText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  saveIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: '#007AFF',
  },
});