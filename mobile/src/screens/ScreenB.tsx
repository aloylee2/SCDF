import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PopupOverlay from './role-engine_screen/PopupOverlay';

export default function ScreenB() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Role B</Text>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>Show Overlay</Text>
      </TouchableOpacity>
      <PopupOverlay
        visible={visible}
        onClose={() => setVisible(false)}
        bannerText="You are assigned to AED Buddy!"
        imageSource={require('../assets/role_engine/aed_buddy.png')}
        description="You are closest to the AED. Grab it and head to casualty"
      />
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, color: 'green', marginBottom: 20 },
  button: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
