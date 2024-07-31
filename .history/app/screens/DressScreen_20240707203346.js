import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { getToken } from '@/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_PROFILES = 20;
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const TOGGLE_ICON_TOP = SCREEN_HEIGHT * 0.155;
const TOGGLE_ICON_RIGHT = SCREEN_WIDTH * 0.23;
const TOGGLE_ICON_SIZE = SCREEN_WIDTH * 0.06;

const DressScreen = () => {
  // ... (zbytek state a hooks zůstává stejný)

  const loadProfiles = async () => {
    try {
      const savedProfiles = await AsyncStorage.getItem('profiles');
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      } else {
        fetchProfileImage();
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      fetchProfileImage();
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`);
      const profileImageUrl = response.data.profile_image_url;
      setProfiles([{ type: 'profile', url: profileImageUrl }]);
      await AsyncStorage.setItem('profiles', JSON.stringify([{ type: 'profile', url: profileImageUrl }]));
    } catch (error) {
      console.error(error);
      setError('Nepodařilo se načíst profilový obrázek.');
    }
  };

  const manageProfiles = async (newProfile) => {
    setProfiles(prevProfiles => {
      const updatedProfiles = [
        prevProfiles[0],
        ...prevProfiles.slice(1),
        { type: 'generated', url: newProfile }
      ];
      if (updatedProfiles.length > MAX_PROFILES) {
        updatedProfiles.splice(1, 1);
      }
      AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      return updatedProfiles;
    });
  };

  const handleTryOn = async (product) => {
    // ... (zbytek funkce zůstává stejný)
  };

  const renderProfileItem = ({ item }) => (
    <View style={styles.profileItemContainer}>
      {item.type === 'profile' ? (
        <Image
          source={{ uri: item.url }}
          style={styles.profileImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.generatedImageWrapper}>
          <Image
            source={{ uri: item.url }}
            style={styles.generatedImage}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );

  // ... (zbytek komponent a renderovacích funkcí zůstává stejný)

  return (
    <View style={styles.container}>
      {/* ... (zbytek JSX zůstává stejný) */}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (předchozí styly zůstávají stejné)
  profileItemContainer: {
    width: SCREEN_WIDTH,
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
  },
  generatedImageWrapper: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatedImage: {
    width: CONTAINER_WIDTH * 0.8, // Zúžení na 80% šířky
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
  },
  // ... (zbytek stylů zůstává stejný)



  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  profileScrollContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.08,
    left: SCREEN_WIDTH * 0.010,
    width: SCREEN_WIDTH,
    height: CONTAINER_HEIGHT,
    zIndex: 2,
  
  
    
  },
  themeToggle: {
    position: 'absolute',
    top: TOGGLE_ICON_TOP,
    right: TOGGLE_ICON_RIGHT,
    zIndex: 3,
  },
  themeToggleIcon: {
    width: TOGGLE_ICON_SIZE,
    height: TOGGLE_ICON_SIZE,
  },
  dressContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.50,
    left: SCREEN_WIDTH * 0.060,
    zIndex: 1,
  },
  dressImage: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.2,
  },
  dressButton: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.2,
    top: SCREEN_HEIGHT * 0.025,
    left: SCREEN_WIDTH * 0.1,
  },
  nandezuContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * -0.01,
    left: SCREEN_WIDTH * 0.330,
    zIndex: 2,
  },
  nandezuImage: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.16,
  },
  nandezuButton: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.16,
    top: SCREEN_HEIGHT * 0.025,
    left: SCREEN_WIDTH * 0.1,
  },
  loveContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.052,
    left: SCREEN_WIDTH * 0.88,
    zIndex: 2,
  },
  loveImage: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_HEIGHT * 0.035,
  },
  loveButton: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_HEIGHT * 0.035,
  },
  subsContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.050,
    left: SCREEN_WIDTH * 0.050,
    zIndex: 2,
  },
  subsImage: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.04,
  },
  subsButton: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.04,
  },
  scrollContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.56,
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.55,
  },
  scrollContentContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.03,
  },
  productWrapper: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.40,
    marginRight: SCREEN_WIDTH * -0.25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productTouchable: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: SCREEN_WIDTH * 0.50,
    height: SCREEN_HEIGHT * 0.25,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.06,
    right: SCREEN_WIDTH * 0.15,
    zIndex: 2,
  },
  productManufacturer: {
    fontSize: 22,
    fontWeight: 'bold',
    top: SCREEN_HEIGHT * -0.009,
    right: SCREEN_WIDTH * 0.295,
    zIndex: 2,
    transform: [{ rotate: '90deg' }],
    textAlign: 'left',
    textAlignVertical: 'top',
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.1,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.32,
    right: SCREEN_WIDTH * 0.49,
    zIndex: 2,
  },
  colorSquare: {
    width: SCREEN_WIDTH * 0.63,
    height: SCREEN_WIDTH * 0.63,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.045,
    right: SCREEN_WIDTH * 0.14,
    zIndex: 1,
  },
  tryonButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * -0.05,
    left: SCREEN_WIDTH * 0.20,
    zIndex: 3,
  },
  tryonButtonImage: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.05,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    // Základní styl pro obrázky
  },
  pressedImage: {
    opacity: 0.5,
  },
  button: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

export default DressScreen;