import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import MapView, {
  Marker,
  Callout,
  LatLng,
  Polyline,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

interface AEDLocation {
  latitude: number;
  longitude: number;
  building: string;
  description: string;
  postal_code: string;
  dist?: number;
}

const GOOGLE_MAPS_APIKEY = 'AIzaSyDk1kEjLArSQqX2mF5jT1B_1k_tX2Gu1XE'; // <-- Put your Google API key here

export default function ViewMoreScreen() {
  const [locations, setLocations] = useState<AEDLocation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetch('http://10.0.2.2:5000/aed_locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(console.error);
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async (): Promise<LatLng | null> => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          const loc = { latitude, longitude };
          setUserLocation(loc);
          resolve(loc);
        },
        err => {
          console.warn(err);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
      );
    });
  };

  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestAED = (userLoc: LatLng): AEDLocation | null => {
    if (!locations.length) return null;
    return locations.reduce((nearest, loc) => {
      const dist = getDistance(
        userLoc.latitude,
        userLoc.longitude,
        loc.latitude,
        loc.longitude
      );
      return !nearest || dist < (nearest.dist ?? Infinity) ? { ...loc, dist } : nearest;
    }, null as AEDLocation | null);
  };

  // Decode Google encoded polyline string to LatLng[]
  const decodePolyline = (encoded: string): LatLng[] => {
    let points: LatLng[] = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  const handleFindNearest = async () => {
    const loc = await getCurrentLocation();
    if (!loc) {
      Alert.alert('Location Error', 'Location permission denied or unavailable.');
      return;
    }

    const nearest = findNearestAED(loc);
    if (!nearest) {
      Alert.alert('AED Not Found', 'No AED found.');
      return;
    }

    if (!mapRef.current) return;

    const origin = `${loc.latitude},${loc.longitude}`;
    const destination = `${nearest.latitude},${nearest.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_APIKEY}&mode=walking`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.routes.length) {
        const points = decodePolyline(json.routes[0].overview_polyline.points);
        setRouteCoords(points);

        // Animate map to show entire route with padding
        mapRef.current.fitToCoordinates(points, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } else {
        Alert.alert('Route Error', 'Could not find route.');
        // Fallback: show simple line
        setRouteCoords([
          { latitude: loc.latitude, longitude: loc.longitude },
          { latitude: nearest.latitude, longitude: nearest.longitude },
        ]);
      }
    } catch (error) {
      console.warn(error);
      Alert.alert('Network Error', 'Failed to fetch directions.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
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

        {userLocation && (
          <Marker
            coordinate={userLocation}
            pinColor="blue"
            title="Your Location"
          />
        )}

        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}
      </MapView>

      <TouchableOpacity style={styles.viewMoreButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>View More</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.viewMoreButton, styles.findButton]}
        onPress={handleFindNearest}
      >
        <Text style={styles.buttonText}>Find Nearest AED</Text>
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
  findButton: {
    backgroundColor: 'green',
    bottom: 100,
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
