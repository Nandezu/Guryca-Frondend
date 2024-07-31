import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
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
import FavoriteUserScreen from './app/screens/FavoriteUserScreen';
import TopScreen from './app/screens/TopScreen';
import JeansScreen from './app/screens/JeansScreen';
import JumpsuitScreen from './app/screens/JumpsuitScreen';
import ShortScreen from './app/screens/ShortScreen';
import JacketScreen from './app/screens/JacketScreen';
import SweatpantsScreen from './app/screens/SweatpantsScreen';
import SkirtScreen from './app/screens/SkirtScreen';
import SweaterScreen from './app/screens/SweaterScreen';
import PantsScreen from './app/screens/PantsScreen';
import LeggingsScreen from './app/screens/LeggingsScreen';
import CoatScreen from './app/screens/CoatScreen';
import MeProductDetailScreen from './app/screens/MeProductDetailScreen';
import TopDetailScreen from './app/screens/TopDetailScreen';
import JeansDetailScreen from './app/screens/JeansDetailScreen';
import JumpsuitDetailScreen from './app/screens/JumpsuitDetailScreen';
import ShortsDetailScreen from './app/screens/ShortsDetailScreen';
import JacketDetailScreen from './app/screens/JacketDetailScreen';
import SweatpantsDetailScreen from './app/screens/SweatpantsDetailScreen';
import PantsDetailScreen from './app/screens/PantsDetailScreen';
import LegginsDetailScreen from './app/screens/LegginsDetailScreen';
import CoatDetailScreen from './app/screens/CoatDetailScreen';
import SweaterDetailScreen from './app/screens/SweaterDetailScreen';
import SkirtsDetailScreen from './app/screens/SkirtsDetailScreen';
import AIScreen from './app/screens/AIScreen';
import AIDetailScreen from './app/screens/AIDetailScreen';
import NewScreen from './app/screens/NewScreen';
import NewDetailScreen from './app/screens/NewDetailScreen';
import UploadPhoto2 from './app/screens/UploadPhoto2';
import UploadPhoto3 from './app/screens/UploadPhoto3';
import ImageDetailScreen from './app/screens/ImageDetailScreen';
import ManageProfilePictures from './app/screens/ManageProfilePictures';
import ProfileSetScreen from './app/screens/ProfileSetScreen';
import ChangeUserNameScreen from './app/screens/ChangeUserNameScreen';
import ChangeRegionScreen from './app/screens/ChangeRegionScreen';
import ChangeEmailScreen from './app/screens/ChangeEmailScreen';
import ChangePasswordScreen from './app/screens/ChangePasswordScreen';

import { useColorScheme } from './hooks/useColorScheme';
import { ThemeProvider } from './ThemeContext';
import { ProfileProvider } from './ProfileProvider';  // Import ProfileProvider

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
        <Stack.Screen name="FavoriteUserScreen" component={FavoriteUserScreen} />
        <Stack.Screen name="TopScreen" component={TopScreen} />
        <Stack.Screen name="JeansScreen" component={JeansScreen} />
        <Stack.Screen name="JumpsuitScreen" component={JumpsuitScreen} />
        <Stack.Screen name="ShortScreen" component={ShortScreen} />
        <Stack.Screen name="JacketScreen" component={JacketScreen} />
        <Stack.Screen name="SweatpantsScreen" component={SweatpantsScreen} />
        <Stack.Screen name="SkirtScreen" component={SkirtScreen} />
        <Stack.Screen name="SweaterScreen" component={SweaterScreen} />
        <Stack.Screen name="PantsScreen" component={PantsScreen} />
        <Stack.Screen name="LeggingsScreen" component={LeggingsScreen} />
        <Stack.Screen name="CoatScreen" component={CoatScreen} />
        <Stack.Screen name="TopDetailScreen" component={TopDetailScreen} />
        <Stack.Screen name="JeansDetailScreen" component={JeansDetailScreen} />
        <Stack.Screen name="JumpsuitDetailScreen" component={JumpsuitDetailScreen} />
        <Stack.Screen name="ShortsDetailScreen" component={ShortsDetailScreen} />
        <Stack.Screen name="JacketDetailScreen" component={JacketDetailScreen} />
        <Stack.Screen name="SweatpantsDetailScreen" component={SweatpantsDetailScreen} />
        <Stack.Screen name="SkirtsDetailScreen" component={SkirtsDetailScreen} />
        <Stack.Screen name="SweaterDetailScreen" component={SweaterDetailScreen} />
        <Stack.Screen name="PantsDetailScreen" component={PantsDetailScreen} />
        <Stack.Screen name="LegginsDetailScreen" component={LegginsDetailScreen} />
        <Stack.Screen name="CoatDetailScreen" component={CoatDetailScreen} />
        <Stack.Screen name="MeProductDetailScreen" component={MeProductDetailScreen} />
        <Stack.Screen name="AIScreen" component={AIScreen} />
        <Stack.Screen name="AIDetailScreen" component={AIDetailScreen} />
        <Stack.Screen name="NewScreen" component={NewScreen} />
        <Stack.Screen name="NewDetailScreen" component={NewDetailScreen} />
        <Stack.Screen name="UploadPhoto2" component={UploadPhoto2} />
        <Stack.Screen name="UploadPhoto3" component={UploadPhoto3} />
        <Stack.Screen name="ImageDetailScreen" component={ImageDetailScreen} />
        <Stack.Screen name="ManageProfilePictures" component={ManageProfilePictures} />
        <Stack.Screen name="ProfileSetScreen" component={ProfileSetScreen} />
        <Stack.Screen name="ChangeUserNameScreen" component={ChangeUserNameScreen} />
        <Stack.Screen name="ChangeRegionScreen" component={ChangeRegionScreen} />
        <Stack.Screen name="ChangeEmailScreen" component={ChangeEmailScreen} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06022A',
  },
});
