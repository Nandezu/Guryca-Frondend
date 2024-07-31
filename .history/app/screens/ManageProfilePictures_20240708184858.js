import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.8;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.5;

export default function ManageProfilePictures() {
  const [isUploading, setIsUploading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {};

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "No user ID provided");
      navigation.goBack();
    } else {
      fetchUserPhotos();
    }
  }, [userId]);

  const fetchUserPhotos = async () => {
    try {
      const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/profile_images/`);
      if (response.status === 200) {
        setPhotos(response.data.images);
      } else {
        console.log('Failed to fetch photos:', response.data);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      console.log('Error response:', error.response ? error.response.data : 'No response data');
    }
  };

  const selectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 1,
    });

    if (pickerResult.canceled) {
      console.log('User cancelled image picker');
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      console.log('Picker result: ', pickerResult);
      const newPhotos = [...photos, { uri: pickerResult.assets[0].uri }];
      setPhotos(newPhotos);
      uploadPhoto(newPhotos);
    }
  };

  const uploadPhoto = async (newPhotos) => {
    if (newPhotos.length === 0) return;

    setIsUploading(true);

    const formData = new FormData();
    newPhotos.forEach((photo, index) => {
      formData.append('profile_images', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: `photo_${index}.jpg`,
      });
    });

    try {
      console.log(`Uploading photos for user: ${userId}`);
      const response = await axios.post(`http://192.168.0.106:8000/user/users/${userId}/upload_profile_images/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Photos uploaded successfully');
        Alert.alert("Success", "Photos uploaded successfully");
        fetchUserPhotos();
      } else {
        console.log('Failed to upload photos:', response.data);
        Alert.alert("Error", "Failed to upload photos");
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      console.log('Error response:', error.response ? error.response.data : 'No response data');
      Alert.alert("Error", "Error uploading photos");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Photo1.png')} style={styles.backgroundImage} />
      
      <TouchableOpacity style={styles.selectButton} onPress={selectPhoto}>
        <Text style={styles.buttonText}>Add Photo</Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.photosContainer}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  selectButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  photosContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'black',
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
