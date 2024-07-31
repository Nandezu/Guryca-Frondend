import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, Text, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
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
  const { userId } = route.params || {};

  useEffect(() => {
    loadProfileImages();
  }, []);

  const loadProfileImages = async () => {
    // ... (zachováno beze změny)
  };

  const getMaxImagesAllowed = (subscriptionType) => {
    // ... (zachováno beze změny)
  };

  const selectPhoto = async () => {
    // ... (zachováno beze změny)
  };

  const uploadPhoto = async (uri) => {
    // ... (zachováno beze změny)
  };

  const setActiveProfileImage = async (imageUrl) => {
    // ... (zachováno beze změny)
  };

  const deleteProfileImage = async (imageUrl) => {
    // ... (zachováno beze změny)
  };

  const renderProfileItem = ({ item, index }) => {
    const isFromImageDetail = item.includes('from_image_detail=true');
    return (
      <TouchableOpacity
        onPress={() => {
          if (index !== 0) {
            // Zde můžete přidat navigaci na detail obrázku, pokud je potřeba
          }
        }}
        disabled={index === 0}
        delayPressIn={100}
        delayPressOut={100}
        delayLongPress={200}
      >
        <View style={styles.profileItemContainer}>
          <Image
            source={{ uri: item }}
            style={[
              styles.profileImage,
              (index > 0 || isFromImageDetail) && styles.transformedProfileImage,
            ]}
            resizeMode="cover"
          />
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
      </TouchableOpacity>
    );
  };

  const renderImageWithTouchableOpacity = (imageSource, imageStyle, touchableStyle, pressedKey, containerStyle, targetScreen) => {
    // ... (zachováno beze změny)
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
          />
        ) : (
          <Text style={styles.noImagesText}>No profile pictures</Text>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={selectPhoto}>
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