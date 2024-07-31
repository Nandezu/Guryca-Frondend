import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, Text, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '@/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const ManageProfileImage = () => {
  const [profileImages, setProfileImages] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState('');
  const [error, setError] = useState(null);
  const [pressed, setPressed] = useState({ nandezu: false, love: false, subs: false });
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, newPhoto } = route.params || {};

  useEffect(() => {
    loadProfileImages();
  }, []);

  useEffect(() => {
    if (newPhoto) {
      setProfileImages(prevImages => [newPhoto, ...prevImages]);
    }
  }, [newPhoto]);

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

      if (response.data.profile_images && Array.isArray(response.data.profile_images)) {
        setProfileImages(response.data.profile_images);
      } else {
        console.error('No profile images found:', response.data);
        setError('No profile images found.');
      }

      setSubscriptionType(response.data.subscription_type);
    } catch (error) {
      console.error('Error loading profile images:', error);
      setError('Error loading profile images.');
    }
  };

  const getMaxImagesAllowed = (subscriptionType) => {
    switch (subscriptionType) {
      case 'basic':
        return 7;
      case 'pro':
        return 12;
      case 'premium':
        return 30;
      case 'basic_yearly':
        return 7;
      case 'pro_yearly':
        return 12;
      case 'premium_yearly':
        return 30;
      default:
        return 3;
    }
  };

  const navigateToUploadPhotoX = () => {
    const maxImagesAllowed = getMaxImagesAllowed(subscriptionType);

    if (profileImages.length >= maxImagesAllowed) {
      Alert.alert(
        'Limit Reached',
        `Your subscription allows up to ${maxImagesAllowed} profile images. Please delete some images to add new ones.`
      );
      return;
    }

    navigation.navigate('UploadPhotoX', { userId });
  };

  const setActiveProfileImage = async (imageUrl) => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }
 
      const response = await axios.post(
        `http://192.168.0.106:8000/user/users/${userId}/set_active_profile_image/`,
        { image_url: imageUrl },
        {
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
 
      if (response.status === 200) {
        console.log('Active profile image set successfully');
        loadProfileImages();
      } else {
        console.log('Failed to set active profile image:', response.data);
        setError('Failed to set active profile image.');
      }
    } catch (error) {
      console.error('Error setting active profile image:', error);
      setError('Error setting active profile image.');
    }
  };

  const deleteProfileImage = async (imageUrl) => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      const response = await axios.delete(`http://192.168.0.106:8000/user/users/${userId}/remove_profile_image/`,
        {
          headers: {
            'Authorization': `Token ${userToken}`
          },
          data: { image_url: imageUrl }
        }
      );

      if (response.status === 200) {
        console.log('Profile image deleted successfully');
        loadProfileImages();
      } else {
        console.log('Failed to delete profile image:', response.data);
        setError('Failed to delete profile image.');
      }
    } catch (error) {
      console.error('Error deleting profile image:', error);
      setError('Error deleting profile image.');
    }
  };

  const renderProfileItem = ({ item, index }) => {
    const isFromImageDetail = item.includes('from_image_detail=true');

    return (
      <View style={styles.profileItemContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item }}
            style={[
              styles.profileImage,
              isFromImageDetail && styles.transformedProfileImage
            ]}
            resizeMode="cover"
          />
        </View>
        <View style={styles.imageActions}>
          {index !== 0 ? (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setActiveProfileImage(item)}
              >
                <Text style={styles.actionButtonText}>Set as Main</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => deleteProfileImage(item)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.activeImageText}>Active Profile Picture</Text>
          )}
        </View>
      </View>
    );
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
            if (pressed[pressedKey]) {
              if (pressedKey === 'love') {
                navigation.goBack();
              } else if (targetScreen) {
                navigation.navigate(targetScreen, { userId });
              }
            }
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezud.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        'nandezu',
        { position: 'absolute', top: SCREEN_HEIGHT * -0.010, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/loved.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        'love',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, left: SCREEN_WIDTH * 0.88, zIndex: 2 },
        null
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subsd.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        'subs',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
        'ProfileSetScreen'
      )}

      <Text style={styles.titleText}>PROFILE IMAGES</Text>

      <View style={styles.scrollViewContainer}>
        {profileImages.length > 0 ? (
          <FlatList
            data={profileImages}
            renderItem={renderProfileItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={SCREEN_WIDTH}
            decelerationRate="fast"
            snapToAlignment="center"
            contentContainerStyle={styles.scrollContentContainer}
          />
        ) : (
          <Text style={styles.noImagesText}>No profile pictures</Text>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={navigateToUploadPhotoX}>
        <Text style={styles.addButtonText}>Add New Photo</Text>
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
    backgroundColor: '#CFD6DE',
    alignItems: 'center',
  },
  titleText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'light',
    marginTop: SCREEN_HEIGHT * 0.17,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  scrollViewContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.12,
    left: SCREEN_WIDTH * 0.010,
    width: SCREEN_WIDTH,
    height: CONTAINER_HEIGHT,
    zIndex: 2,
  },
  scrollContentContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.02,
  },
  profileItemContainer: {
    width: SCREEN_WIDTH,
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  transformedProfileImage: {
    transform: [{ scaleX: 0.87 }],
  },
  imageActions: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    padding: 5,
    marginVertical: 3,
    width: '40%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'black',
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.05,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  noImagesText: {
    color: 'black',
    fontSize: 18,
  },
  activeImageText: {
    color: 'black',
    fontSize: 16,
    marginTop: 7,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    // Basic style for images
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
});

export default ManageProfileImage;