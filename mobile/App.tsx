import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Button } from 'react-native';
import { fetchData } from './src/services/api';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SecondScreen from './src/screens/SecondScreen';

// Import DashboardScreen from its new file
import DashboardScreen from './src/screens/DashboardScreen';
import PostEmergencyDetailScreen from './src/screens/PostEmergencyDetailScreen';
// import ViewMoreScreen from './src/screens/ViewMoreScreen';
import LearnYourRolesScreen from './src/screens/LearnYourRolesScreen'
import CPRHeroTrainingScreen from './src/screens/CPRHeroTrainingScreen'; // Your CPR Hero training screen
import AEDBuddyTrainingScreen from './src/screens/AEDBuddyTrainingScreen'; // New training screen
import AssistantTrainingScreen from './src/screens/AssistantTrainingScreen'; // New training screen
import CrowdControllerTrainingScreen from './src/screens/CrowdControllerTrainingScreen'; // New training screen
import VehicleReceiverTrainingScreen from './src/screens/VehicleReceiverTrainingScreen'; // New training screen
import PostEmergencyOverlay from './src/components/PostEmergencyOverlay';
import DisabilityScreen from './src/screens/DisabilitySettingsScreen';
import CPRHeroQuizScreen from './src/screens/CPRHeroQuizScreen';
import AedBuddyQuizScreen from './src/screens/AedBuddyQuizScreen'; 
import AssistantQuizScreen from './src/screens/AssistantQuizScreen';
import CrowdControllerQuizScreen from './src/screens/CrowdControllerQuizScreen';
import VehicleReceiverQuizScreen  from './src/screens/VehicleReceiverQuizScreen';
import TestScreen from './src/screens/TestScreen'; // Import your TestScreen
import ScenarioScreen from './src/screens/ScenarioScreen';
import { AlertBanner } from './src/screens/role-engine_screen/AlertBanner';


import RoleScreen from './src/screens/RoleScreen';
import ScreenA from './src/screens/ScreenA';
import ScreenB from './src/screens/ScreenB';

export type RootStackParamList = {
  RoleScreen: undefined;
  ScreenA: undefined;
  ScreenB: undefined;
  Home: undefined;
  Second: undefined;
  Dashboard: undefined;
  PostEmergencyDetail: undefined;
  ViewMore: undefined;
  LearnYourRoles: undefined;
  CPRHeroTraining: undefined;
  AEDBuddyTraining: undefined;
  AssistantTraining: undefined;
  CrowdControllerTraining: undefined;
  VehicleReceiverTraining: undefined;
  DisabilitySettings: undefined;
  CPRHeroQuiz: undefined;
  AedBuddyQuiz: undefined;
  AssistantQuiz: undefined;
  CrowdControllerQuiz: undefined;
  VehicleReceiverQuiz: undefined;
  TestScreen: undefined;
  ScenarioScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
function HomeScreen({ navigation }: any) {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.0.2.2:5000/api')
      .then(async response => {
        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Response body:', text);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setData(text);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setData('Error fetching backend');
      });
  }, []);
  
  return (
    <View style={styles.container}>
      {/* <AlertBanner visible={false} onAccept={function (): void {
        throw new Error('Function not implemented.');
      } } onDecline={function (): void {
        throw new Error('Function not implemented.');
      } } /> */}
      <Text style={styles.title}>Hello World!</Text>
      <Text style={styles.text}>
        Backend data: {data ? JSON.stringify(data) : 'Loading...'}
      </Text>
      <Button title="Go to Second Page" onPress={() => navigation.navigate('Second')} />
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Go to View More" onPress={() => navigation.navigate('ViewMore')} />
      <Button title="Go to Disability Settings" onPress={() => navigation.navigate('DisabilitySettings')} />
      <Button title="ModalTestScreen" onPress={() => navigation.navigate('TestScreen')} />
      <Button title="Scenario Screen" onPress={() => navigation.navigate('ScenarioScreen')} />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="RoleScreen">

        <Stack.Screen name="RoleScreen" component={RoleScreen} />
        <Stack.Screen name="ScreenA" component={ScreenA} />
        <Stack.Screen name="ScreenB" component={ScreenB} />


          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Second" component={SecondScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PostEmergencyDetail" component={PostEmergencyDetailScreen} />
          {/* <Stack.Screen name="ViewMore" component={ViewMoreScreen} /> */}
          <Stack.Screen name="LearnYourRoles" component={LearnYourRolesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CPRHeroTraining" component={CPRHeroTrainingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AEDBuddyTraining" component={AEDBuddyTrainingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AssistantTraining" component={AssistantTrainingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CrowdControllerTraining" component={CrowdControllerTrainingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VehicleReceiverTraining" component={VehicleReceiverTrainingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DisabilitySettings" component={DisabilityScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CPRHeroQuiz" component={CPRHeroQuizScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AedBuddyQuiz" component={AedBuddyQuizScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AssistantQuiz" component={AssistantQuizScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CrowdControllerQuiz" component={CrowdControllerQuizScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VehicleReceiverQuiz" component={VehicleReceiverQuizScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TestScreen" component={TestScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ScenarioScreen" component={ScenarioScreen} options={{ headerShown: false }} />
          {/* Add more screens as needed */}
        </Stack.Navigator>
      </NavigationContainer>
       </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  text: { fontSize: 16, marginBottom: 20 },
});