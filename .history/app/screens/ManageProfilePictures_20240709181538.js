import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { getToken } from '@/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const ManageProfileImage = () => {
  const [profileImages, setProfileImages] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};

  useEffect(() => {
    loadProfileImages();
  }, []);

  const loadProfileImages = async () => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });
      
      console.log('API Response:', response.data); // Pro debugging

      if (response.data.profile_images && Array.isArray(response.data.profile_images)) {
        setProfileImages(response.data.profile_images);
      } else if (response.data.active_profile_image) {
        // Pokud existuje pouze jeden aktivní profilový obrázek
        setProfileImages([response.data.active_profile_image]);
      } else {
        console.error('No profile images found:', response.data);
        setError('Žádné profilové obrázky nebyly nalezeny.');
      }
    } catch (error) {
      console.error('Error loading profile images:', error);
      setError('Nepodařilo se načíst profilové obrázky.');
    }
  };

  const selectPhoto = async () => {
    // ... (zbytek kódu pro výběr fotky zůstává stejný)
  };

  const uploadPhoto = async (uri) => {
    // ... (zbytek kódu pro nahrávání fotky zůstává stejný)
  };

  const renderProfileItem = ({ item }) => (
    <View style={styles.profileItemContainer}>
      <Image
        source={{ uri: item }}
        style={styles.profileImage}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {profileImages.length > 0 ? (
        <FlatList
          data={profileImages}
          renderItem={renderProfileItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        />
      ) : (
        <Text style={styles.noImagesText}>Žádné profilové obrázky</Text>
      )}

      <TouchableOpacity style={styles.addButton} onPress={selectPhoto}>
        <Text style={styles.addButtonText}>Přidat nový obrázek</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContentContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  profileItemContainer: {
    width: SCREEN_WIDTH,
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SCREEN_WIDTH * 0.1,
  },
  profileImage: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'black',
    fontSize: 16,
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
  noImagesText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ManageProfileImage;