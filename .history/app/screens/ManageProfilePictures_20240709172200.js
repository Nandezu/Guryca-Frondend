import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getToken } from '@/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.8;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.5;

const ManageProfilePictures = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {};

  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "No user ID provided");
      navigation.goBack();
    } else {
      fetchPhotos();
    }
  }, [userId]);

  const fetchPhotos = async () => {
    try {
      const userToken = await getToken();
      const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/profile_images/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      Alert.alert('Error', 'Unable to fetch photos');
    }
  };

  const selectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
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
      setSelectedPhoto(pickerResult.assets[0].uri);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedPhoto) {
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('profile_image', {
      uri: selectedPhoto,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const userToken = await getToken();
      const response = await axios.post(`http://192.168.0.106:8000/user/users/${userId}/upload_profile_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${userToken}`
        },
      });

      if (response.status === 200 || response.status === 201) {
        fetchPhotos();
        setSelectedPhoto(null);
      } else {
        console.log('Failed to upload photo:', response.data);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      const userToken = await getToken();
      await axios.delete(`http://192.168.0.106:8000/user/users/${userId}/profile_images/${photoId}/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert('Error', 'Failed to delete photo');
    }
  };

  const selectAsProfileImage = async (photoUrl) => {
    try {
      const userToken = await getToken();
      await axios.put(`http://192.168.0.106:8000/user/users/${userId}/select_profile_image/`, { profile_image_url: photoUrl }, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });
      Alert.alert('Success', 'Profile image updated');
      navigation.navigate('DressScreen', { userId });
    } catch (error) {
      console.error('Error selecting profile image:', error);
      Alert.alert('Error', 'Failed to set profile image');
    }
  };

  const renderPhotoItem = ({ item }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: item.url }} style={styles.photo} />
      <TouchableOpacity style={styles.deleteButton} onPress={() => deletePhoto(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.selectButton} onPress={() => selectAsProfileImage(item.url)}>
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Profile Images</Text>
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
      />
      {!selectedPhoto && (
        <TouchableOpacity style={styles.uploadButton} onPress={selectPhoto}>
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>
      )}
      {selectedPhoto && (
        <View style={styles.selectedPhotoContainer}>
          <Image source={{ uri: selectedPhoto }} style={styles.selectedPhoto} />
          <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto} disabled={isUploading}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectedPhoto(null)} disabled={isUploading}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  photoItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  photo: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  deleteButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
  selectButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  selectButtonText: {
    color: '#fff',
  },
  uploadButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  selectedPhotoContainer: {
    alignItems: 'center',
  },
  selectedPhoto: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
    marginBottom: 20,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#6c757d',
    borderRadius: 5,
  },
});

export default ManageProfilePictures;
