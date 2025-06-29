import React, { useEffect, useRef, useState, useMemo,  } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { AlertBanner } from './role-engine_screen/AlertBanner';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AEDLocation {
  latitude: number;
  longitude: number;
  building: string;
  description: string;
  postal_code: string;
  dist?: number;
}

const GOOGLE_MAPS_APIKEY = 'AIzaSyDk1kEjLArSQqX2mF5jT1B_1k_tX2Gu1XE'; // <-- Your key here

export default function ViewMoreScreen() {
  const [locations, setLocations] = useState<AEDLocation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [nearestToPatient, setNearestToPatient] = useState<AEDLocation | null>(null);
  const [nearestAED, setNearestAED] = useState<AEDLocation | null>(null);
  const [nearbyAEDs, setNearbyAEDs] = useState<AEDLocation[]>([]);
  const [showNearbyPatientPins, setShowNearbyPatientPins] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const nearestAEDMarkerRef = useRef<any>(null);
  const nearestNearbyAEDMarkerRef = useRef<any>(null);
  const mapRef = useRef<MapView>(null);
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [activeChip, setActiveChip] = useState<'walk' | 'bicycle' | 'car'>('walk');

  //Hardcoded patient location
  const patientLocation: LatLng = {
    latitude: 1.3513, //  patient lat
    longitude: 103.8443, // patient lng
  };

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    
    fetch('http://10.0.2.2:5000/aed-locations', {
    // POST Method
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      latitude: patientLocation.latitude,
      longitude: patientLocation.longitude,
    }),
  })
    // GET Method
      .then(res => {
        console.log('Fetch status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Fetched AED locations:', data);
        setLocations(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setFetchError('Network Error: ' + error.message);
        setLoading(false);
        Alert.alert('Network Error', error.message);
      });
  }, []);

  useEffect(() => {
    // Show callout for nearest AED if set
    if (nearestAEDMarkerRef.current) {
      setTimeout(() => {
        nearestAEDMarkerRef.current.showCallout();
      }, 500);
    }
  }, [nearestAED]);

  // Find nearest AED to patient whenever locations update
  useEffect(() => {
    if (!locations.length) {
      setNearestToPatient(null);
      return;
    }
    const nearest = locations.reduce((nearestSoFar, loc) => {
      const dist = getDistance(
        patientLocation.latitude,
        patientLocation.longitude,
        loc.latitude,
        loc.longitude
      );
      return !nearestSoFar || dist < (nearestSoFar.dist ?? Infinity)
        ? { ...loc, dist }
        : nearestSoFar;
    }, null as AEDLocation | null);
    setNearestToPatient(nearest);
  }, [locations]);

  useEffect(() => {
    // Auto-show callout for nearest AED within 400m when locations update
    if (nearestNearbyAEDMarkerRef.current && nearbyAEDs.length) {
      setTimeout(() => {
        nearestNearbyAEDMarkerRef.current.showCallout();
      }, 500);
    }
  }, [nearbyAEDs]);

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
    const R = 6371e3;1
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

  const handleFindNearest = async () => {
    setShowNearbyPatientPins(false); // <-- Reset flag when using other button
    const loc = await getCurrentLocation();
    if (!loc) {
      Alert.alert('Location Error', 'Location permission denied or unavailable.');
      return;
    }

    const nearest = findNearestAED(loc);
    setNearestAED(nearest); // Track nearest AED
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
        mapRef.current.fitToCoordinates(points, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } else {
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

  const handleRouteNearestToPatient = async () => {
    if (!nearestToPatient) {
      Alert.alert('No AED', 'No nearest AED to patient found.');
      return;
    }
    setShowNearbyPatientPins(false); // reset to force re-render if needed
    setTimeout(() => setShowNearbyPatientPins(true), 0);

    const origin = `${nearestToPatient.latitude},${nearestToPatient.longitude}`;
    const destination = `${patientLocation.latitude},${patientLocation.longitude}`;
  
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_APIKEY}&mode=walking`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.routes.length) {
        const points = decodePolyline(json.routes[0].overview_polyline.points);
        setRouteCoords(points);
        mapRef.current?.fitToCoordinates(points, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } else {
        setRouteCoords([
          { latitude: nearestToPatient.latitude, longitude: nearestToPatient.longitude },
          { latitude: patientLocation.latitude, longitude: patientLocation.longitude },
        ]);
      }
    } catch (error) {
      console.warn(error);
      Alert.alert('Network Error', 'Failed to fetch directions.');
    }
  };

  const filterNearbyAEDsToPatient = () => {
    const filtered = locations
      .map(loc => {
        const dist = getDistance(
          patientLocation.latitude,
          patientLocation.longitude,
          loc.latitude,
          loc.longitude
        );
        return { ...loc, dist };
      });
      //.filter(loc => loc.dist! <= 400);

    setNearbyAEDs(filtered);
    setShowNearbyPatientPins(false); // force reset first
    setTimeout(() => {
      setShowNearbyPatientPins(true); // then enable, to force re-render
      handleRouteNearestToPatient(); // <-- This draws the walking route
    }, 0);

    if (!filtered.length) {
      Alert.alert('No Nearby AEDs', 'No AEDs found within 400m of the patient.');
      return;
    }
    // Find nearest among filtered
    const nearest = filtered.reduce((nearestSoFar, loc) =>
      !nearestSoFar || loc.dist! < (nearestSoFar.dist ?? Infinity) ? loc : nearestSoFar,
      null as AEDLocation | null
    );
    setNearestToPatient(nearest);
    setTimeout(() => {
      if (nearestNearbyAEDMarkerRef.current) {
        nearestNearbyAEDMarkerRef.current.showCallout();
      }
    }, 500);
    setRouteCoords([]);
    mapRef.current?.fitToCoordinates(
      filtered.map(loc => ({ latitude: loc.latitude, longitude: loc.longitude })),
      {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      }
    );
  };

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

  // Initiate a emergency case start
  const startCase = async ()=>{
    try{
      await fetch('http://10.0.2.2:5000/case-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          latitude: patientLocation.latitude, 
          longitude: patientLocation.longitude 
        }),
      });
    }catch(error){
      console.error("Error starting case:", error);
  }
  };

  // Load last user location from AsyncStorage on mount
  useEffect(() => {
    const loadLastPosition = async () => {
      try {
        const saved = await AsyncStorage.getItem('lastUserLocation');
        if (saved) {
          setUserLocation(JSON.parse(saved));
        }
      } catch (e) {
        console.warn('Failed to load last user location:', e);
      }
    };
    loadLastPosition();
  }, []);

  useEffect(() => {
    if (userLocation) {
      AsyncStorage.setItem('lastUserLocation', JSON.stringify(userLocation));
    }
  }, [userLocation]);

  // Check if AlertBanner is defined and log its type
  if (typeof AlertBanner === 'undefined') {
    console.warn('❌❌❌ AlertBanner is undefined! Check your import/export.');
  } else {
    console.log('✅✅✅ AlertBanner import type:', typeof AlertBanner, AlertBanner);
  }
  
  // 0.0001 is about 11 meters at the equator
  // Simulate user movement along a path (e.g., the current routeCoords)
  const simulateUserMovementAlongPath = (path: LatLng[], intervalMs = 1000) => {
    if (!path || path.length === 0) return;
    let i = 0;
    setUserLocation(path[0]);
    const interval = setInterval(async() => {
      i++;
      if (i >= path.length) {
        clearInterval(interval);
        // NOTE: Need async to be fixed to use
        // Save last position to AsyncStorage
        try {
          await AsyncStorage.setItem('lastUserLocation', JSON.stringify(path[path.length - 1]));
        } catch (e) {
          console.warn('Failed to save last user location:', e);
        }
        return;
      }
      setUserLocation(path[i]);
    }, intervalMs);
  };

  // Helper to compare coordinates with tolerance
  const isSameLocation = (a: LatLng, b: LatLng) =>
    Math.abs(a.latitude - b.latitude) < 1e-6 && Math.abs(a.longitude - b.longitude) < 1e-6;

  return (
    <View style={styles.container}>
      {/* Top Popup */}
      <View style={styles.timerRow}>
        <Text>
          <Text style={styles.timerNumber}>0</Text>
          <Text style={styles.timerUnit}>min</Text>
          <Text style={styles.timerNumber}> 0</Text>
          <Text style={styles.timerUnit}>sec</Text>
          <Text style={styles.timerSince}>  since emergency happened</Text>
        </Text>
      </View>
      
      <View style={[styles.transportRow, {position: 'absolute', top: 60, left: 0, right: 0, zIndex: 1}]}>
      <TouchableOpacity
        style={[styles.chip, activeChip === 'walk' && styles.chipActive]}
        onPress={() => setActiveChip('walk')}
      >
        <Text style={[styles.chipIcon, activeChip === 'walk' && {color: 'white'}]}>🚶‍♂️</Text>
        <Text style={[styles.chipText, activeChip === 'walk' && {color: 'white'}]}>4 min</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.chip, activeChip === 'bicycle' && styles.chipActive]}
        onPress={() => setActiveChip('bicycle')}
      >
        <Text style={[styles.chipIcon, activeChip === 'bicycle' && {color: 'white'}]}>🚴‍♂️</Text>
        <Text style={[styles.chipText, activeChip === 'bicycle' && {color: 'white'}]}>2 min</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.chip, activeChip === 'car' && styles.chipActive]}
        onPress={() => setActiveChip('car')}
      >
        <Text style={[styles.chipIcon, activeChip === 'car' && {color: 'white'}]}>🚗</Text>
        <Text style={[styles.chipText, activeChip === 'car' && {color: 'white'}]}>2 min</Text>
      </TouchableOpacity>
    </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          // latitude: 1.3521,
          // longitude: 103.8198,
          latitude: patientLocation.latitude,
          longitude: patientLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {/* Show message if loading or error, else show pins */}
        {loading ? (
          <Marker
            coordinate={{ latitude: 1.3521, longitude: 103.8198 }}
            pinColor="gray"
          >
            <Callout>
              <Text>Loading AED locations...</Text>
            </Callout>
          </Marker>
        ) : fetchError ? (
          <Marker
            coordinate={{ latitude: 1.3521, longitude: 103.8198 }}
            pinColor="gray"
          >
            <Callout>
              <Text>{fetchError}</Text>
            </Callout>
          </Marker>
        ) : (
          locations.map((loc, idx) => {
            let pinColor = 'red';
            const isNearestNearby =
              nearestToPatient && isSameLocation(loc, nearestToPatient);
            const isNearest =
              nearestAED && isSameLocation(loc, nearestAED);

            if (showNearbyPatientPins) {
              pinColor = 'purple';
            } else if (isNearestNearby) {
              pinColor = 'red';
            } else if (isNearest) {
              pinColor = 'green';
            }

            return (
              <Marker
                key={idx}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                pinColor={pinColor}
                ref={
                  (showNearbyPatientPins && nearestToPatient && isSameLocation(loc, nearestToPatient)) ||
                  (!showNearbyPatientPins && nearestToPatient && isSameLocation(loc, nearestToPatient))
                    ? nearestNearbyAEDMarkerRef
                    : (!showNearbyPatientPins && nearestAED && isSameLocation(loc, nearestAED))
                    ? nearestAEDMarkerRef
                    : undefined
                }
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>🫀 AED at {loc.building}</Text>
                    <Text>{loc.description}</Text>
                    <Text>Postal Code: {loc.postal_code}</Text>
                    {isNearestNearby && (
                      <Text style={{ color: 'purple', fontWeight: 'bold', marginTop: 4 }}>
                        Nearest AED to Patient!
                      </Text>
                    )}
                    {isNearest && !isNearestNearby && (
                      <Text style={{ color: 'green', fontWeight: 'bold', marginTop: 4 }}>
                        Nearest AED to You!
                      </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            );
          })
        )}

        {userLocation && (
          <Marker
            coordinate={userLocation}
            pinColor="blue"
            title="Your Location"
          />
        )}

        {/* ✅ Patient Location Marker */}
        <Marker
          coordinate={patientLocation}
          pinColor="orange"
          title="Patient Location"
        />

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

      {/* ✅ New button for 400m filter */}
      <TouchableOpacity
        style={[styles.viewMoreButton, { bottom: 160, backgroundColor: 'purple' }]}
        onPress={filterNearbyAEDsToPatient}
      >
        <Text style={styles.buttonText}>AEDs Near Patient</Text>
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

      {/* ✅ New button to start case */}
      <TouchableOpacity
        style={[styles.viewMoreButton, { bottom: 220, backgroundColor: 'blue' }]}
        onPress={startCase}
      >
        <Text style={styles.buttonText}>Start Case</Text>
      </TouchableOpacity>

      {/* ✅ New button to trigger scenario */}
      <TouchableOpacity
        style={[styles.viewMoreButton, { bottom: 280, backgroundColor: 'maroon' }]}
        onPress={() => setShowAlertBanner(true)}
      >
        <Text style={styles.buttonText}>Show Alert Banner</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.viewMoreButton, { bottom: 340, backgroundColor: 'teal' }]}
        onPress={() => simulateUserMovementAlongPath(routeCoords)}
      >
        <Text style={styles.buttonText}>Simulate User Along Route</Text>
      </TouchableOpacity>
      
      {showAlertBanner && (
        <View style={styles.container}>
        <AlertBanner
          visible={showAlertBanner}
          onAccept={() => setShowAlertBanner(false)}
          onDecline={() => setShowAlertBanner(false)}
          children={"This is a test alert banner!"}
          // ...other props as needed
        />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    backgroundColor: 'red',
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

  // Top Banner 
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  timerNumber: {
    color: '#B22222',
    fontWeight: 'bold',
    fontSize: 28,
  },
  timerUnit: {
    color: '#B22222',
    fontSize: 18,
    fontWeight: '400',
    marginRight: 8,
  },
  timerSince: {
    color: '#B22222',
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 8,
  },
  transportRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  chipActive: {
    backgroundColor: '#223F87',
  },
  chipIcon: {
    fontSize: 18,
    marginRight: 6,
    color: '#223F87',
  },
  chipText: {
    fontSize: 16,
    color: '#223F87',
    fontWeight: '500',
  },
});
