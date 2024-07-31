import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const UserScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.get(`http://192.168.0.106:8000/users/${userId}/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          console.log('Profile image URL:', response.data.profile_image_url);
          setProfileImage(response.data.profile_image_url);
        } else {
          console.log('Token nenalezen');
        }
      } catch (error) {
        console.error('Chyba při načítání profilového obrázku:', error);
      }
    };
  
    fetchProfileImage();
  }, [userId]);

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
              navigation.navigate(targetScreen, { userId });
            }
          }}
        />
      </View>
    );
  };

  const renderNewButton = (text, style, onPress) => (
    <TouchableOpacity style={[styles.newButton, style]} onPress={onPress}>
      <Text style={styles.newButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {profileImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        )}
        
        {renderImageWithTouchableOpacity(
          require('../../assets/images/nandezu.png'),
          { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
          { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
          'treti',
          { position: 'absolute', top: SCREEN_HEIGHT * -0.01, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
          'AllScreen'
        )}
        {renderImageWithTouchableOpacity(
          require('../../assets/images/love.png'),
          { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
          { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
          'loves',
          { position: 'absolute', top: SCREEN_HEIGHT * 0.052, left: SCREEN_WIDTH * 0.88, zIndex: 2 },
          'ManageProfilePictures'
        )}
        {renderImageWithTouchableOpacity(
          require('../../assets/images/subs.png'),
          { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
          { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
          'subs',
          { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 },
          'ProfileSetScreen'
        )}
        {renderImageWithTouchableOpacity(
          require('../../assets/images/allp.png'),
          { width: SCREEN_WIDTH * 0.51, height: SCREEN_HEIGHT * 0.260 },
          { width: SCREEN_WIDTH * 0.51, height: SCREEN_HEIGHT * 0.260 },
          'allp',
          { position: 'absolute', top: SCREEN_HEIGHT * 0.70, left: SCREEN_WIDTH * -0.072, zIndex: 2 },
          'AllScreen'
        )}
        {renderImageWithTouchableOpacity(
          require('../../assets/images/aip.png'),
          { width: SCREEN_WIDTH * 0.51, height: SCREEN_HEIGHT * 0.260 },
          { width: SCREEN_WIDTH * 0.51, height: SCREEN_HEIGHT * 0.260},
          'aip',
          { position: 'absolute', top: SCREEN_HEIGHT * 0.57, left: SCREEN_WIDTH * 0.250, zIndex: 3 },
          'AIScreen'
        )}
        {renderImageWithTouchableOpacity(
          require('../../assets/images/newp.png'),
          { width: SCREEN_WIDTH * 0.52, height: SCREEN_HEIGHT * 0.260 },
          { width: SCREEN_WIDTH * 0.52, height: SCREEN_HEIGHT * 0.260 },
          'newp',
          { position: 'absolute', top: SCREEN_HEIGHT * 0.72, left: SCREEN_WIDTH * 0.560, zIndex: 2 },
          'NewScreen'
        )}
        {renderImageWithTouchableOpacity(
          require('../../assets/images/mep.png'),
          { width: SCREEN_WIDTH * 0.51, height: SCREEN_HEIGHT * 0.230 },
          { width: SCREEN_WIDTH * 0.51, height: SCREEN_HEIGHT * 0.230},
          'mep',
          { position: 'absolute', top: SCREEN_HEIGHT * 0.82, left: SCREEN_WIDTH * 0.240, zIndex: 2 },
          'FavoriteUserScreen'
        )}
        
        {/* Nové tlačítko "Change Region" */}
        {renderNewButton(
          'Change Region',
          { 
            position: 'absolute',
            top: SCREEN_HEIGHT * 0.35,
            left: SCREEN_WIDTH * 0.20,
            width: SCREEN_WIDTH * 0.6,
            height: SCREEN_HEIGHT * 0.06
          },
          async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              if (token) {
                navigation.navigate('ChangeRegionScreen', { userId, token });
              } else {
                console.log('Token nenalezen');
              }
            } catch (error) {
              console.error('Chyba při načítání tokenu:', error);
            }
          }
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  imageContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'red',
    marginTop: SCREEN_HEIGHT * 0.13,
    marginBottom: 40,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    backgroundColor: 'transparent',
  },
  newButton: {
    backgroundColor: '#4B4B4B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    transform: [{ skewX: '-20deg' }],
  },
  newButtonText: {
    color: 'white',
    fontSize: 16,
    transform: [{ skewX: '20deg' }],
  },
});

export default UserScreen;