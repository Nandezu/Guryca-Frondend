import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.8;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.5;

export default function UploadPhotoX() {
  const [isUploading, setIsUploading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {};

  const [photo, setPhoto] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState(null);

  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "No user ID provided");
      navigation.goBack();
    }
  }, [userId]);

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
      setPhoto(pickerResult.assets[0].uri);
      setOriginalDimensions({
        width: pickerResult.assets[0].width,
        height: pickerResult.assets[0].height
      });
    }
  };

  const uploadPhoto = async () => {
    if (!photo) {
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('profile_image', {
      uri: photo,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        Alert.alert('Error', 'You are not authenticated. Please log in again.');
        return;
      }

      console.log(`Uploading photo for user: ${userId}`);
      const response = await axios.post(`http://192.168.0.106:8000/user/users/${userId}/upload_profile_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Photo uploaded successfully');
        console.log('Response data:', response.data);
        Alert.alert('Success', 'Photo uploaded successfully', [
          { text: 'OK', onPress: () => navigation.navigate('ManageProfileImage', { userId, newPhoto: response.data.image_url }) }
        ]);
      } else {
        console.log('Failed to upload photo:', response.data);
        Alert.alert('Error', 'Failed to upload photo. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      console.log('Error response:', error.response ? error.response.data : 'No response data');
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setPhoto(null);
    setOriginalDimensions(null);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Photo1.png')} style={styles.backgroundImage} />
      
      {!photo && (
        <TouchableOpacity style={styles.selectButton} onPress={selectPhoto}>
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>
      )}

      {photo && (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: photo }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity 
            style={[styles.confirmButton, isUploading && styles.disabledButton]} 
            onPress={uploadPhoto}
            disabled={isUploading}
          >
            <Image source={require('../../assets/images/Confirm1.png')} style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.repeatButton, isUploading && styles.disabledButton]} 
            onPress={resetUpload}
            disabled={isUploading}
          >
            <Image source={require('../../assets/images/Repeat1.png')} style={styles.buttonImage} />
          </TouchableOpacity>
        </>
      )}
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
  confirmButton: {
    position: 'absolute',
    width: 160,
    height: 50,
    top: SCREEN_HEIGHT * 0.950,
    right: SCREEN_WIDTH * 0.27,
  },
  repeatButton: {
    position: 'absolute',
    width: 160,
    height: 50,
    top: SCREEN_HEIGHT * 0.870,
    right: SCREEN_WIDTH * 0.27,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  disabledButton: {
    opacity: 0.5,
  },
});