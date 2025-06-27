// utils/getDeviceId.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'device_id';

export async function getPersistentDeviceId(): Promise<string> {
  let storedId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!storedId) {
    storedId = uuidv4();
    await AsyncStorage.setItem(DEVICE_ID_KEY, storedId);
  }
  return storedId;
}
