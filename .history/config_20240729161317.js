// config.js

const DEV_URL = 'http://192.168.0.106:8000';  // Váš lokální Django backend
const PROD_URL = 'https://app-tdh1.onrender.com';  // Váš backend na Render

export const BASE_URL = __DEV__ ? DEV_URL : PROD_URL;

// Pro Expo můžete přidat:
export const EXPO_DEV_URL = 'exp://192.168.0.106:8081';
export const EXPO_WEB_URL = 'http://localhost:8081';