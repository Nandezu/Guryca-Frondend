import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Text } from 'react-native';
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
      setProfileImages(response.data.profile_images);
    } catch (error) {
      console.error('Error loading profile images:', error);
      setError('Nepodařilo se načíst profilové obrázky.');
    }
  };

  const selectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 1,
    });

    if (pickerResult.canceled) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      uploadPhoto(pickerResult.assets[0].uri);
    }
  };

  const uploadPhoto = async (uri) => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      const formData = new FormData();
      formData.append('profile_image', {
        uri: uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      await axios.post(`http://192.168.0.106:8000/user/users/${userId}/add_profile_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${userToken}`
        },
      });

      loadProfileImages();
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Nepodařilo se nahrát nový profilový obrázek.');
    }
  };

  const renderProfileItem = ({ item, index }) => (
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
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {profileImages.map((imageUrl, index) => renderProfileItem({ item: imageUrl, index }))}
      </ScrollView>

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
  },
  scrollContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.12,
    left: SCREEN_WIDTH * 0.010,
    width: SCREEN_WIDTH,
    height: CONTAINER_HEIGHT,
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
    alignSelf: 'center',
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
});

export default ManageProfileImage;