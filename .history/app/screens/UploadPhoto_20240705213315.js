import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.8;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.5; // Poměr stran 2:3






export default function UploadPhoto() {
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
    if (!photo) return;


    // Zde můžete přidat logiku pro zmenšení obrázku, pokud je to potřeba
    // Například použitím knihovny react-native-image-resizer


    const formData = new FormData();
    formData.append('profile_image', {
      uri: photo,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });


    try {
      console.log(`Uploading photo for user: ${userId}`);
      const response = await axios.post(`http://192.168.0.106:8000/user/users/${userId}/upload_profile_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      if (response.status === 200 || response.status === 201) {
        console.log('Photo uploaded successfully');
        console.log('Response data:', response.data);
        navigation.navigate('GouideScreen1', { userId });
      } else {
        console.log('Failed to upload photo:', response.data);
        Alert.alert('Upload Failed', 'Failed to upload photo. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      console.log('Error response:', error.response ? error.response.data : 'No response data');
      Alert.alert('Upload Error', 'An error occurred while uploading the photo. Please try again.');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.circleOuter]} />
        <View style={[styles.circle, styles.circleMiddle]} />
        <View style={[styles.circle, styles.circleInner]} />
      </View>
      <Text style={styles.appName}>NANDEZU</Text>
     
      {!photo && (
        <>
          <Text style={styles.successText}>
            For the best results, please upload a full-body photo in form-fitting clothing.
            You can select a larger area, but the final image will be cropped to a 2:3 ratio.
            Make sure your whole body is visible and the photo is taken in a well-lit area.
          </Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectPhoto}>
            <Text style={styles.buttonText}>Upload Photo</Text>
          </TouchableOpacity>
        </>
      )}
      {photo && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: photo }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
      {photo && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={uploadPhoto}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  circleContainer: {
    position: 'absolute',
    top: -130,
    left: '50%',
    transform: [{ translateX: -125 }],
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circleOuter: {
    width: 280,
    height: 280,
    backgroundColor: '#849CFC',
  },
  circleMiddle: {
    width: 240,
    height: 240,
    backgroundColor: '#6785FF',
    top: 20,
    left: 20,
  },
  circleInner: {
    width: 200,
    height: 200,
    backgroundColor: '#2450FF',
    top: 40,
    left: 40,
  },
  appName: {
    position: 'absolute',
    top: 190,
    left: '50%',
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    transform: [{ translateX: -52 }],
  },
  successText: {
    position: 'absolute',
    top: 350,
    left: '50%',
    color: '#fff',
    fontSize: 10,
    fontWeight: '300',
    transform: [{ translateX: -145 }],
    textAlign: 'center',
    width: 290,
  },
  selectButton: {
    position: 'absolute',
    top: 500,
    left: '50%',
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -90 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  imageContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.15,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  confirmButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    width: 130,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
