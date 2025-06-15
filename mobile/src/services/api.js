// api.js

// Change this value based on your environment:
// For Android emulator use 10.0.2.2
// For iOS simulator or React Native on macOS use localhost
// For physical device use your computer's LAN IP (e.g., 192.168.x.x)

const API_URL = 'http://10.0.2.2:5000'; // <-- Adjust accordingly

/// mobile/src/services/api.js

export const fetchData = async () => {
  try {
    const response = await fetch('http://10.0.2.2:5000/api');
    return await response.json();
  } catch (error) {
    console.error('Error fetching from backend:', error);
    return null;
  }
};
