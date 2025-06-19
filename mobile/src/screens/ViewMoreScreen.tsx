import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

interface AEDLocation {
  latitude: number;
  longitude: number;
  building: string;
  description: string;
  postal_code: string;
}

export default function ViewMoreScreen() {
  const [locations, setLocations] = useState<AEDLocation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch('http://10.0.2.2:5000/aed_locations') // Replace with actual IP or localhost
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {locations.map((loc, idx) => (
          <Marker
            key={idx}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            pinColor="red"
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>🫀 AED at {loc.building}</Text>
                <Text>{loc.description}</Text>
                <Text>Postal Code: {loc.postal_code}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.viewMoreButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>View More</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>All AED Locations</Text>
          <ScrollView>
            {locations.map((loc, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{loc.building}</Text>
                <Text>{loc.description}</Text>
                <Text>Postal Code: {loc.postal_code}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.viewMoreButton, styles.closeButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  viewMoreButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  callout: {
    maxWidth: 200,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  closeButton: {
    backgroundColor: '#999',
    marginTop: 20,
  },
});