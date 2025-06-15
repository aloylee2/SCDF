
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