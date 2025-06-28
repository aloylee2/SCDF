import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';

export default function ScreenB() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Role B</Text>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>Show Overlay</Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlayBackground}>
          <View style={styles.topOverlayBanner}>
            <Text style={styles.topBannerText}>
              You are assigned to AED Buddy! 
            </Text>
          </View>
          <View style={styles.overlayBox}>
            <View style={styles.overlayContentBox}>
              <Image
                source={require('../assets/role_engine/aed_buddy.png')}
                style={styles.bannerImage}
                resizeMode="contain"
              /> 
              <Text style={styles.bannerText}>You are closest to the AED. Grab it and head to casualty</Text>
            </View>
            <View style={styles.buttonRow}>
              <View></View>
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={[styles.button, styles.accept]} onPress={() => setVisible(false)}>
                  <Text style={styles.iconText}>&#10003;</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBox: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    width: '80%',
    height: '35%',
    maxHeight: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topOverlayBanner: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: '80%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B90B0B',
  },
  topBannerText: {
    marginLeft: 10,
    marginRight: 10,
    color: 'white', 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'green',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  // Overlay Content Box
  overlayContentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 3,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  bannerText: {
    padding: 10,
    color: 'black', 
    fontSize: 20, 
    flex: 2,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  
  // Button Styles
  buttonRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    flex: 1,
  },
  iconText: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
  },
  buttonLabel: {
    marginTop: 8,
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  decline: {
    backgroundColor: '#B90B0B',
    width: 72,
    height: 72,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accept: {
    backgroundColor: '#223F87',
    width: 72,
    height: 72,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
