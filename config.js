const DEV_URL = 'https://app-tdh1.onrender.com';  // Změňte toto na URL vašeho Render backendu
const PROD_URL = 'https://app-tdh1.onrender.com';

export const BASE_URL = __DEV__ ? DEV_URL : PROD_URL;

// Tyto URL můžete ponechat pro případné budoucí použití
export const EXPO_DEV_URL = 'exp://192.168.0.106:8081';
export const EXPO_WEB_URL = 'http://localhost:8081';