import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { fetchData } from './src/services/api';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SecondScreen from './src/screens/SecondScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  const [data, setData] = useState(null);
  
useEffect(() => {
    fetch('http://10.0.2.2:5000/api')
      .then(async response => {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return JSON.parse(text);
      })
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World!</Text>
      <Text style={styles.text}>
        Backend data: {data ? JSON.stringify(data) : 'Loading...'}
      </Text>
      <Button title="Go to Second Page" onPress={() => navigation.navigate('Second')} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Second" component={SecondScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  text: { fontSize: 16, marginBottom: 20 },
});
