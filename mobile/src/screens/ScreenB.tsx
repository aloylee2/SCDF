import PopupOverlay from './role-engine_screen/PopupOverlay';
// Get Emulator ID
import axios from 'axios';
import { getPersistentDeviceId } from '../utils/getDeviceId';
//google map & aed-location
import React, { useEffect, useRef, useState } from 'react';
import { 
  Alert, 
  Platform, 
  PermissionsAndroid, 
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

//google map & aed-location
interface AEDLocation {
  latitude: number;
  longitude: number;
  building: string;
  description: string;
  postal_code: string;
  dist?: number;
}

const GOOGLE_MAPS_APIKEY = 'AIzaSyDk1kEjLArSQqX2mF5jT1B_1k_tX2Gu1XE'; // <-- Your key here


export default function ScreenB() {
  const [popupOverlay, setPopupOverlayVisible] = useState(false);
  const [flow, setFlow] = useState<string | null>(null);
  // for google map & aed-location
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

  const acceptCase = async () => {
    console.log("acceptCase triggered");

    const deviceId = await getPersistentDeviceId();
    console.log('📱 Device ID:', deviceId);

    try {
      const response = await axios.post('http://10.0.2.2:5000/accept-case', {
        device_id: deviceId, 
      });

      const flowFromRoleEngine = response.data.role_engine_status;
      console.log('🎯 Flow given:', flowFromRoleEngine);
      setFlow(flowFromRoleEngine);

    if (flowFromRoleEngine != null) {
        console.log("🔁 something is coming out");
      } else {
        Alert.alert('Info', 'Nothing coming through from backend.');
      }
    } catch (error) {
      console.error('🔥 Error!!!:', error);
      Alert.alert('Error', 'Something Failed. Please try again.');
    }
  };

  const nextStepCase = async () => {
    console.log("nextStepCase triggered");

    const deviceId = await getPersistentDeviceId();
    console.log('📱 Device ID:', deviceId);

    try {
      const response = await axios.post('http://10.0.2.2:5000/next-step', {
        device_id: deviceId, 
      });

      const flowFromRoleEngine = response.data.role_engine_status;
      console.log('🎯 Flow given:', flowFromRoleEngine);
      setFlow(flowFromRoleEngine);

    if (flowFromRoleEngine != null) {
        console.log("🔁 something is coming out");
      } else {
        Alert.alert('Info', 'Nothing coming through from backend.');
      }
    } catch (error) {
      console.error('🔥 Error!!!:', error);
      Alert.alert('Error', 'Something Failed. Please try again.');
    }
  };

  const patientLocation: LatLng = {
    latitude: 1.3513, //  patient lat
    longitude: 103.8443, // patient lng
  };

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    fetch('http://10.0.2.2:5000/aed-locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: patientLocation.latitude,
        longitude: patientLocation.longitude,
        max_results: 50,
      }),
    })
      .then(res => {
        console.log('Fetch status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Fetched AED locations:', data);
        const first50 = data.slice(0, 10);
        setLocations(first50);
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
        {/* Show message if loading or error, else show pins */}
        {loading ? (
          <Marker coordinate={{ latitude: 1.3521, longitude: 103.8198 }} pinColor="gray">
            <Callout>
              <Text>Loading AED locations...</Text>
            </Callout>
          </Marker>
        ) : fetchError ? (
          <Marker coordinate={{ latitude: 1.3521, longitude: 103.8198 }} pinColor="gray">
            <Callout>
              <Text>{fetchError}</Text>
            </Callout>
          </Marker>
        ) : (
          // Map markers for AED locations would go here
          locations.map((loc, idx) => (
            <Marker
              key={idx}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              pinColor="red"
            >
              <Callout>
                <Text>{loc.building}</Text>
              </Callout>
            </Marker>
          ))
        )}
      </MapView>

      <Text style={styles.text}>Welcome to Role B</Text>
      <TouchableOpacity style={styles.button} onPress={() => setPopupOverlayVisible(true)}>
        <Text style={styles.buttonText}>Show Overlay</Text>
      </TouchableOpacity>
      {flow && <Text style={styles.flowtText}>💻 Role Engine: {flow}</Text>}
      <TouchableOpacity style={[styles.button, {backgroundColor:"red"}]} onPress={() => acceptCase()}>
        <Text style={styles.buttonText}>Accept Case</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {backgroundColor:"maroon"}]} onPress={() => nextStepCase()}>
        <Text style={styles.buttonText}>Next Step</Text>
      </TouchableOpacity>
      <PopupOverlay
        visible={popupOverlay}
        onClose={() => setPopupOverlayVisible(false)}
        bannerText="You are assigned to AED Buddy!"
        imageSource={require('../assets/role_engine/aed_buddy.png')}
        description="You are closest to the AED. Grab it and head to casualty"
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, color: 'blue' },
  button: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
   map: {
    width: '100%',
    height: '100%',
  },
  flowtText: { marginTop: 10, fontSize: 18 },
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
