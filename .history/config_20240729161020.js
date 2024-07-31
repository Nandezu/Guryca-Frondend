// config.js

const DEV_URL = 'http://192.168.0.106:8000';
const PROD_URL = 'https://app-tdh1.onrender.com';

export const BASE_URL = __DEV__ ? DEV_URL : PROD_URL;

// Další konfigurační proměnné můžete přidat zde
export const API_TIMEOUT = 10000; // příklad: timeout pro API volání v milisekundách