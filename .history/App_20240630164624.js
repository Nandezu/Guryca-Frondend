import * as React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

import HomeScreen from './app/screens/HomeScreen';
import LoginScreen from './app/screens/LoginScreen';
import Signupscreen from './app/screens/Signupscreen';
import AfterRegistration from './app/screens/AfterRegistration';
import UploadPhoto from './app/screens/UploadPhoto';
import GouideScreen1 from './app/screens/GouideScreen1';
import GouideScreen2 from './app/screens/GouideScreen2';
import GouideScreen3 from './app/screens/GouideScreen3';
import GouideScreen4 from './app/screens/GouideScreen4';
import GouideScreen5 from './app/screens/GouideScreen5';
import GouideScreen6 from './app/screens/GouideScreen6';
import UserScreen from './app/screens/UserScreen';
import AllScreen from './app/screens/AllScreen';
import DressScreen from './app/screens/DressScreen';
import ProductDetailScreen from './app/screens/ProductDetailScreen';

import { useColorScheme } from './hooks/useColorScheme';
import { ThemeProvider } from './ThemeContext';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function AppContent() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: '#06022A' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Signupscreen" component={Signupscreen} />
        <Stack.Screen name="AfterRegistration" component={AfterRegistration} />
        <Stack.Screen name="UploadPhoto" component={UploadPhoto} />
        <Stack.Screen name="GouideScreen1" component={GouideScreen1} />
        <Stack.Screen name="GouideScreen2" component={GouideScreen2} />
        <Stack.Screen name="GouideScreen3" component={GouideScreen3} />
        <Stack.Screen name="GouideScreen4" component={GouideScreen4} />
        <Stack.Screen name="GouideScreen5" component={GouideScreen5} />
        <Stack.Screen name="GouideScreen6" component={GouideScreen6} />
        <Stack.Screen name="UserScreen" component={UserScreen} />
        <Stack.Screen name="AllScreen" component={AllScreen} />
        <Stack.Screen name="DressScreen" component={DressScreen} />
        <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06022A',
  },
});