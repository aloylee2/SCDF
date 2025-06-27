import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// Update the import path below to the correct location of your App file
import { RootStackParamList } from '../../App';
import { getPersistentDeviceId } from '../utils/getDeviceId';
import { Alert } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleScreen'>;

export default function RoleScreen({ navigation }: Props) {
  const [role, setRole] = useState<string | null>(null);

  const handleJoin = async () => {
    console.log("🔍 handleJoin triggered");
    const deviceId = await getPersistentDeviceId();
    console.log('Device ID:', deviceId);

    try {
      const response = await axios.post('http://10.0.2.2:5000/assign-role', {
        device_id: deviceId,
      });

      const assignedRole = response.data.role;
      setRole(assignedRole);

      if (assignedRole === 'A') {
        navigation.replace('ScreenA');
      } else if (assignedRole === 'B') {
        navigation.replace('ScreenB');
      } else {
        alert('Roles are full or invalid.');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Failed to assign role.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join as CFRs</Text>
      <Button title="Join" onPress={handleJoin} />
      {role && <Text style={styles.role}>You are assigned Role {role}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  role: { marginTop: 10, fontSize: 18 },
});
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

