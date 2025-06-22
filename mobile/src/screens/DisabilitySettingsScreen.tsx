// src/screens/ProfileScreen.tsx
import React, { useState } from 'react'; // Import useState
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, ScrollView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Recommended: install and import from here

// If you don't want to install @react-native-picker/picker, you can use:
// import { Picker } from 'react-native'; // This is deprecated but might still work


// Reusing background images from cpr_man_role_training
import YellowCircle from '../assets/cpr_man_role_training/yellow_circle.jpg';
import YellowSLineVector from '../assets/cpr_man_role_training/yellow_s_line_vector.jpg';

// Importing icons from logos_post_emergency as per image_47eda9.jpg
import EditIcon from '../assets/disability_page/edit_icon_logo.png'; // Assuming this is the correct path for the edit icon
import CardiacArrestIcon from '../assets/logos_post_emergency/heart_icon_logo.png';
import FireIcon from '../assets/logos_post_emergency/fire_logo.jpg';
import ProfilePlaceholder from '../assets/disability_page/profile_page.png'; // Placeholder profile image

const { width, height } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  // State for Disabilities section
  const [showDisabilitiesDropdown, setShowDisabilitiesDropdown] = useState(false);
  const [selectedDisability, setSelectedDisability] = useState('Hearing Impairment'); // Default from image

  const disabilitiesOptions = [
    'None',
    'Hearing Impairment',
    'Vision Impairment',
    'Mobility Impairment',
    'Speech Impairment',
    'Cognitive or Learning Impairment',
    'Limb Differences'
    // Add more disabilities from your Miro board here
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Images */}
      <View style={styles.backgroundContainer}>
        <Image source={YellowCircle} style={styles.yellowCircle} />
        <Image source={YellowSLineVector} style={styles.yellowSLineVector} />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={ProfilePlaceholder} style={styles.profileImage} resizeMode="cover" />
          <Text style={styles.userName}>Kaibao</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileButtonText}>My CFR ID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.profileButton, styles.profileButtonSecondary]}>
              <Text style={styles.profileButtonTextSecondary}>My Account</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Image source={CardiacArrestIcon} style={styles.statIcon} resizeMode="contain" />
              <Text style={styles.statText}>Cardiac arrest</Text>
              <Text style={styles.statNumber}>0</Text>
            </View>
            <View style={styles.statItem}>
              <Image source={FireIcon} style={styles.statIcon} resizeMode="contain" />
              <Text style={styles.statText}>Fire</Text>
              <Text style={styles.statNumber}>0</Text>
            </View>
          </View>
        </View>

        {/* My occupation Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoSectionHeader}>
            <Text style={styles.infoSectionTitle}>My occupation</Text>
            <TouchableOpacity>
              <Image source={EditIcon} style={styles.editIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Employment status</Text>
            <Text style={styles.infoValue}>Student</Text>
          </View>
        </View>

        {/* Disabilities Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoSectionHeader}>
            <Text style={styles.infoSectionTitle}>Disabilities</Text>
            <TouchableOpacity onPress={() => setShowDisabilitiesDropdown(!showDisabilitiesDropdown)}>
              <Image source={EditIcon} style={styles.editIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{selectedDisability}</Text>
          </View>

          {showDisabilitiesDropdown && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDisability}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedDisability(itemValue)
                }
                style={styles.picker}
              >
                {disabilitiesOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          )}
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 50 : 90,
    backgroundColor: '#0A2542',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollViewContent: {
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 20,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: -40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#CCC',
    borderWidth: 2,
    borderColor: '#0A2542',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileButton: {
    backgroundColor: '#0A2542',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginHorizontal: 5,
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0A2542',
  },
  profileButtonTextSecondary: {
    color: '#0A2542',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statIcon: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '90%',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  infoSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 10,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 150,
  },
});

export default ProfileScreen;