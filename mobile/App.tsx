import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { fetchData } from './src/services/api';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SecondScreen from './src/screens/SecondScreen';

// Import DashboardScreen from its new file
import DashboardScreen from './src/screens/DashboardScreen';


const Stack = createNativeStackNavigator();
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
      <Text style={styles.title}>Hello World!</Text>
      <Text style={styles.text}>
        Backend data: {data ? JSON.stringify(data) : 'Loading...'}
      </Text>
      <Button title="Go to Second Page" onPress={() => navigation.navigate('Second')} />
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Second" component={SecondScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  text: { fontSize: 16, marginBottom: 20 },
});