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
  Image,
} from 'react-native';
import MapView, {
  Marker,
  Callout,
  LatLng,
  Polyline,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { AlertBanner } from './role-engine_screen/AlertBanner';
import { RedBanner } from './role-engine_screen/RedBanner';

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


export default function ScreenA() {
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
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const [showNextButtons, setShowNextButtons] = useState(false);
  const [activeChip, setActiveChip] = useState<'walk' | 'bicycle' | 'car'>('walk');
  const [bannerText, setBannerText] = useState('We need CFRs!');

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
  
  // Get AED Locations
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

  // Show callout for nearest AED if set
  useEffect(() => {
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

  // Auto-show callout for nearest AED within 400m when locations update
  useEffect(() => {
    if (nearestNearbyAEDMarkerRef.current && nearbyAEDs.length) {
      setTimeout(() => {
        nearestNearbyAEDMarkerRef.current.showCallout();
      }, 500);
    }
  }, [nearbyAEDs]);

  // Always show latest flow on Task Banner
  useEffect(() => {
    if (flow) setBannerText(flow);
  }, [flow]);

  // Auto-fetch user location
  useEffect(() => {
  getCurrentLocation();
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
  
  // Helper to move user 10m toward patient location
  const moveUserTowardPatientBy10m = () => {
    if (!userLocation) return;

    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const toDegrees = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRadians(userLocation.latitude);
    const lon1 = toRadians(userLocation.longitude);
    const lat2 = toRadians(patientLocation.latitude);
    const lon2 = toRadians(patientLocation.longitude);

    // Calculate bearing from user to patient
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = Math.atan2(y, x);

    // Move 10 meters along this bearing
    const distance = 10; // meters
    const R = 6371000; // Earth radius in meters

    const newLat = Math.asin(
      Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing)
    );
    const newLon = lon1 + Math.atan2(
      Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1),
      Math.cos(distance / R) - Math.sin(lat1) * Math.sin(newLat)
    );

    setUserLocation({
      latitude: toDegrees(newLat),
      longitude: toDegrees(newLon),
    });
  };

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
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
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
              image={require('../assets/role_engine/aed_pin_resized.png')} 
            >
              <Callout>
                <Text>{loc.building}</Text>
              </Callout>
            </Marker>
          ))
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
          pinColor="red"
          title="Case Location"
          image={require('../assets/role_engine/case_location_resized.png')} 
        />

        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}
      </MapView>

      <RedBanner text={bannerText} visible={!!bannerText} />

      {/* Accept case menu */}
      {showAlertBanner && (
        <View style={styles.container}>
        <AlertBanner
          visible={showAlertBanner}
          onAccept={async () => {
            await acceptCase();
            setShowAlertBanner(false);
            setShowNextButtons(true);
          }}
          onDecline={() => setShowAlertBanner(false)}
          children={"This is an Alert banner!"}
          // ...other props as needed
        />
        </View>
      )}

      {/* On case menu */}
      {showNextButtons && (
        <View style={{ paddingTop: 4, padding: 16 }}>
          {/* Top Info */}
          <View style={{ marginBottom: 16, flexDirection:'row' }}>
            <View style={{flexDirection:'column'}}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#223F87' }}>💙</Text>
              <Text style={{ color: '#223F87', fontSize: 16 , marginTop: 2 }}>🚶‍♂️</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 4 }}>📍</Text>
            </View>
            <View style={{flexDirection:'column', marginLeft: 7}}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#223F87' }}>Cardiac arrest</Text>
              <Text style={{ color: '#223F87', fontSize: 13, marginTop: 2 }}>4 min • 250m</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 13, marginTop: 4 }}>Bus stop: Aft Ang Mo Kio Fire Stn (55211)</Text>
              <Text style={{ color: '#444', fontSize: 13 }}>Ang Mo Kio Street 62</Text>
            </View>
          </View>

          {/* Row of 3 buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <TouchableOpacity style={styles.showidBtn}>
              <View style={styles.btnContainer}>
                <Text style={styles.btnIcons}>🪪</Text>
                <Text style={{ color: '#223F87', fontWeight: 'bold', fontSize: 16 }}>Show ID</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.guidesBtn}>
              <View style={styles.btnContainer}>
                <Text style={styles.btnIcons}>❓</Text>
                <Text style={{ color: '#223F87', fontWeight: 'bold', fontSize: 16 }}>Guides</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callBtn}>
              <View style={styles.btnContainer}>
                <Text style={styles.btnIcons}>📞</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>995</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Message Row */}
          <TouchableOpacity style={styles.msgBtn} onPress={() => {
              moveUserTowardPatientBy10m();
              setTimeout(() => {
                nextStepCase();
              }, 500);
            }}
          >
            <View style={styles.msgContent}>
              <Text style={{ fontSize: 18, color: '#223F87' }}>💬</Text>
              <Text style={{ color: '#223F87', fontWeight: 'bold', fontSize: 16, marginLeft: 7, marginRight: 5 }}>Message</Text>
              <Image source={require('../assets/role_engine/chat_icon.png')} style={{ width: 48, height: 32, marginRight: 4 }} />
            </View>
            <View style={styles.notificationIcon}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>1</Text>
            </View>
          </TouchableOpacity>

          {/* Arrive Scene button */}
          <TouchableOpacity
            style={styles.arriveBtn}
            onPress={() => {/* Tap when arrived logic */}}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Tap when arrived</Text>
          </TouchableOpacity>
        </View>
      )}
        
      {/* Btn for Testing */}
      {/* {flow && <Text style={styles.flowtText}>💻 Role Engine: {flow}</Text>} */}
      {/* <TouchableOpacity style={[styles.button, { backgroundColor: "maroon" }]} onPress={() => nextStepCase()}>
      </TouchableOpacity> */}
    </View>
  )
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
  text: { fontSize: 24, color: 'blue' },
  button: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  flowtText: { marginTop: 10, fontSize: 18 },
  
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

  // On Case Btns
  btnContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  showidBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#223F87',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: 'white'
  },
  guidesBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#223F87',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: 'white'
  },
  callBtn:{
    flex: 1,
    backgroundColor: '#B22222',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  btnIcons: { 
    fontSize: 18, 
    marginRight: 5,
  },
  // msg btn
  msgBtn:{
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#223F87',
    borderRadius: 12,
    padding: 8,
    marginBottom: 7,
    backgroundColor: 'white'
  },
  msgContent:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon:{
    backgroundColor: '#B22222',
    borderRadius: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    right: 0,
  },
  // Arrive btn
  arriveBtn:{
    backgroundColor: '#223F87',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 7,
  }
});
