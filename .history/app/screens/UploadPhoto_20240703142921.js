import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

AWS.config.update({
  accessKeyId: 'AKIA6GBMEM6GK3D72JIE',
  secretAccessKey: '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',
  region: 'us-east-1'
});

const s3 = new AWS.S3();

const uploadToS3 = async (photoUri) => {
  const response = await fetch(photoUri);
  const blob = await response.blob();
  const key = `${uuidv4()}.jpg`;

  const params = {
    Bucket: 'usersnandezu',
    Key: key,
    Body: blob,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };

  console.log('Uploading to S3 with params:', params);

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error uploading to S3:', err);
        reject(err);
      } else {
        console.log('S3 upload successful. Data:', data);
        console.log('Returned URL:', data.Location);
        resolve(data.Location);
      }
    });
  });
};

export default function UploadPhoto() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {};

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedPhoto, setProcessedPhoto] = useState(null);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "No user ID provided");
      navigation.goBack();
    }

    const getToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    };
    getToken();
  }, [userId, navigation]);

  const selectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (pickerResult.canceled) {
      console.log('User cancelled image picker');
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      console.log('Picker result: ', pickerResult);
      setPhoto(pickerResult.assets[0].uri);
      setProcessedPhoto(null);
      removeBackground(pickerResult.assets[0].uri);
    }
  };

  const removeBackground = async (photoUri) => {
    if (!photoUri) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image_file', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': 'vQLBBceZj5GbY9h6Srf2LCaF',
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setProcessedPhoto(base64data);

        setTimeout(() => {
          setLoading(false);
        }, 2000);
      };
      reader.readAsDataURL(response.data);
    } catch (error) {
      console.error('Failed to remove background:', error);
      setLoading(false);
    }
  };

  const uploadPhoto = async () => {
    if (!processedPhoto) return;

    if (!userToken) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const s3Url = await uploadToS3(processedPhoto);
      console.log(`S3 URL: ${s3Url}`);

      const response = await axios.post(`http://192.168.0.106:8000/user/upload-profile-image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${userToken}`
        }
      });

      if (response.status === 200) {
        navigation.navigate('GouideScreen1', { userId });
      } else {
        console.log('Failed to upload photo:', response.data);
        Alert.alert('Failed to upload photo');
      }
    } catch (error) {
      console.error('Failed to upload photo:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error', error.message);
      }
      Alert.alert('Failed to upload photo', error.message);
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
      
      {!photo && <Text style={styles.successText}>For the best results with our virtual fitting application, please upload a 
        full-body photo in form-fitting clothing that does not cover your legs, arms, or neck, 
        so the AI can accurately assess your proportions. 
        Make sure the photo is taken in a well-lit area for optimal clarity.</Text>}
      {!photo && (
        <TouchableOpacity style={styles.selectButton} onPress={selectPhoto}>
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>
      )}
      {loading ? (
        <LottieView
          source={require('../../assets/loading.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      ) : (
        <>
          {photo && <Image source={{ uri: processedPhoto || photo }} 
          style={styles.image} 
          resizeMode="contain" />}
          {processedPhoto && (
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={uploadPhoto}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          )}
        </>
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
    transform: [{ translateX: -72 }],
  },
  confirmButton: {
    position: 'absolute',
    top: 680,
    left: '50%',
    width: 130,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -47 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  lottie: {
    width: 400,
    height: 400,
    position: 'absolute',
    top: 280,
    left: '50%',
    transform: [{ translateX: -183 }],
  },
  image: {
    width: 400,
    height: 400,
    marginVertical: 16,
    position: 'absolute',
    top: 230,
    left: '50%',
    transform: [{ translateX: -170 }],
  },
});