// src/screens/AssistantTrainingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

import YellowCircle from '../assets/cpr_man_role_training/yellow_circle.jpg';
import YellowSLineVector from '../assets/cpr_man_role_training/yellow_s_line_vector.jpg';
import CPRHeroLogo from '../assets/cpr_man_role_training/cpr_hero_logo.jpg';
import AssistantKeyboardLogo from '../assets/assistant_role_training/assistant_keyboard_logo.jpg';

const { width, height } = Dimensions.get('window');

const AssistantTrainingScreen: React.FC<any> = () => { // Removed 'navigation' prop as useNavigation hook is used
  const navigation = useNavigation<any>();

  const handleStartQuiz = () => {
    navigation.navigate('AssistantQuiz'); // Navigate to Assistant Quiz screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Images */}
      <View style={styles.backgroundContainer}>
        <Image source={YellowCircle} style={styles.yellowCircle} />
        <Image source={YellowSLineVector} style={styles.yellowSLineVector} />
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        <Text style={styles.title}>Assistant</Text>
        <View style={styles.descriptionList}>
          <Text style={styles.descriptionBullet}>
            • You are to provide assistance where required, such as taking over CPR man when they are fatigued.
          </Text>
          <Text style={styles.descriptionBullet}>
            • You may be given special tasks such as to receive paramedics at hard to reach places.
          </Text>
        </View>
        <View style={styles.imageRow}>
          <Image source={CPRHeroLogo} style={styles.iconImage} resizeMode="contain" />
          <Image source={AssistantKeyboardLogo} style={styles.iconImage} resizeMode="contain" />
        </View>
        {/* Quiz Button */}
        <TouchableOpacity style={styles.quizButton} onPress={handleStartQuiz}>
          <Text style={styles.quizButtonText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
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
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) + 50) : 80,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'left',
  },
  descriptionList: {
    width: '100%',
    marginBottom: 30,
  },
  descriptionBullet: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left',
    lineHeight: 28,
    marginBottom: 5,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 50,
    marginBottom: 40, // Increased margin for spacing to quiz button
  },
  iconImage: {
    width: 120,
    height: 120,
    marginHorizontal: 20,
  },
  quizButton: { // Added quiz button styles
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AssistantTrainingScreen;