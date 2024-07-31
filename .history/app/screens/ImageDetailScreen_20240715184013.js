import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '@/auth';
import * as FileSystem from 'expo-file-system';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.7;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.9;

const ImageDetailScreen = () => {
  const [pressed, setPressed] = useState({ nandezu: false, love: false, subs: false });
  const [statusMessage, setStatusMessage] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUrl, itemId, userId } = route.params;

  useEffect(() => {
    let timer;
    if (statusMessage) {
      timer = setTimeout(() => {
        setStatusMessage('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [statusMessage]);

  const handleDelete = async () => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User is not authenticated');
      }

      await axios.delete(`http://192.168.0.106:8000/tryon/delete-result/${itemId}/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });

      if (!userId) {
        console.error('userId is undefined');
        setStatusMessage('Error: userId is undefined');
        return;
      }

      navigation.navigate('DressScreen', { userId, deletedItemId: itemId });
    } catch (error) {
      console.error('Error deleting image:', error);
      setStatusMessage('Failed to delete image');
    }
  };

  const addToProfileImages = async () => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User is not authenticated');
      }

      const fileUri = `${FileSystem.cacheDirectory}tempProfileImage.jpg`;
      await FileSystem.downloadAsync(imageUrl, fileUri);

      const formData = new FormData();
      formData.append('profile_image', {
        uri: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        type: 'image/jpeg',
        name: 'profile_image_from_image_detail.jpg',
      });

      const response = await axios.post(
        `http://192.168.0.106:8000/user/users/${userId}/add_profile_image/?from_image_detail=true`,
        formData,
        {
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setStatusMessage('Image successfully added as profile picture');
      } else {
        throw new Error('Failed to add image');
      }
    } catch (error) {
      console.error('Error adding image:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      setStatusMessage(`Failed to add image as profile picture: ${error.message}`);
    } finally {
      const fileUri = `${FileSystem.cacheDirectory}tempProfileImage.jpg`;
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }
  };

  const renderImageWithTouchableOpacity = (imageSource, imageStyle, touchableStyle, pressedKey, containerStyle, targetScreen) => {
    let pressTimer;

    return (
      <View style={[styles.imageWrapper, containerStyle]}>
        <Image
          source={imageSource}
          style={[styles.image, imageStyle, pressed[pressedKey] && styles.pressedImage]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.button, touchableStyle]}
          onPressIn={() => {
            pressTimer = setTimeout(() => setPressed({ ...pressed, [pressedKey]: true }), 70);
          }}
          onPressOut={() => {
            clearTimeout(pressTimer);
            setPressed({ ...pressed, [pressedKey]: false });
          }}
          onPress={() => {
            if (pressed[pressedKey] && targetScreen) {
              navigation.navigate(targetScreen, { userId });
            }
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.mainImageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {statusMessage ? (
          <Text style={styles.statusMessage}>{statusMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Image source={require('../../assets/images/delete.png')} style={styles.deleteButtonImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addToProfileButton} onPress={addToProfileImages}>
          <Image source={require('../../assets/images/love.png')} style={styles.addToProfileButtonImage} />
        </TouchableOpacity>
      </View>

      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezu.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        'nandezu',
        { position: 'absolute', top: SCREEN_HEIGHT * -0.02, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        'love',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.88, zIndex: 2 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        'subs',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
        null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  mainImageContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    transform: [{ scaleX: 0.87 }],
    borderRadius: 20,
  },
  deleteButton: {
    position: 'absolute',
    bottom: -110,
    left: -10,
  },
  deleteButtonImage: {
    width: SCREEN_WIDTH * 0.10,
    height: SCREEN_WIDTH * 0.12,
  },
  addToProfileButton: {
    position: 'absolute',
    bottom: -SCREEN_HEIGHT * 0.145,
    right: SCREEN_WIDTH * -0.04,
    width: SCREEN_WIDTH * 0.11,
    height: SCREEN_WIDTH * 0.11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToProfileButtonImage: {
    width: '100%',
    height: '100%',
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  statusMessage: {
    position: 'absolute',
    bottom: CONTAINER_HEIGHT - 540, // Adjust this value as needed
    left: 0,
    right: 0,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
  },
});

export default ImageDetailScreen;