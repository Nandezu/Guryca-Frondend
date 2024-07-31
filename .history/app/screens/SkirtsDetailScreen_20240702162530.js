import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, Linking, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TOGGLE_ICON_TOP = SCREEN_HEIGHT * 0.155;
const TOGGLE_ICON_RIGHT = SCREEN_WIDTH * 0.23;
const TOGGLE_ICON_SIZE = SCREEN_WIDTH * 0.06;

const SkirtsDetailScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profileImage, setProfileImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { product, userId } = route.params;
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setProfileImage(response.data.profile_image);
      } catch (error) {
        console.error(error);
      }
    };

    const checkIfFavorite = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`http://192.168.0.106:8000/favorites/check/`, {
          headers: {
            'Authorization': `Token ${token}`
          },
          params: {
            user: userId,
            product: product.id
          }
        });
        setIsFavorite(response.data.is_favorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsFavorite(false);
      }
    };

    fetchProfileImage();
    checkIfFavorite();
  }, [userId, product.id]);

  const handleLikePress = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const config = {
        headers: { 'Authorization': `Token ${token}` }
      };
  
      const response = await axios.post('http://192.168.0.106:8000/favorites/toggle/', 
        { product: product.id }, 
        config
      );
  
      setIsFavorite(response.data.is_favorite);
      // Odstraníme navigaci do FavoriteUserScreen
      // navigation.navigate('FavoriteUserScreen', { userId, refresh: Date.now() });
    } catch (error) {
      console.error('Error updating favorite status:', error);
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
            if (pressed[pressedKey]) {
              navigation.navigate(targetScreen, { userId });
            }
          }}
        />
      </View>
    );
  };

  const handleProductPress = () => {
    navigation.navigate('SkirtScreen', { userId, selectedProductId: product.id });
  };

  const handleStoreLinkPress = () => {
    if (product.store_link) {
      Linking.openURL(product.store_link).catch((err) => console.error('An error occurred', err));
    }
  };

  const isLightColor = product.colour === 'light';
  const squareImage = isLightColor
    ? require('../../assets/images/lightsquare2.png')
    : require('../../assets/images/darksquare2.png');
  const textColor = isLightColor ? '#333333' : '#FFFFFF';
  const likeIconSource = isFavorite
    ? require('../../assets/images/like.png')
    : isLightColor
    ? require('../../assets/images/nolike2.png')
    : require('../../assets/images/nolike.png');

  return (
    <View style={styles.container}>
      {profileImage && (
        <Image
          source={{ uri: profileImage }}
          style={{ width: SCREEN_WIDTH * 1, height: SCREEN_HEIGHT * 0.5, position: 'absolute', top: SCREEN_HEIGHT * 0.08, left: SCREEN_WIDTH * 0.010, zIndex: 2 }}
          resizeMode="contain"
        />
      )}
      <Image
        source={isDarkMode ? require('../../assets/images/square2.png') : require('../../assets/images/square.png')}
        style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.40, position: 'absolute', top: SCREEN_HEIGHT * 0.14, left: SCREEN_WIDTH * 0.12, zIndex: 1 }}
        resizeMode="contain"
      />
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          position: 'absolute',
          top: TOGGLE_ICON_TOP,
          right: TOGGLE_ICON_RIGHT,
          zIndex: 3
        }}
      >
        <Image
          source={isDarkMode ? require('../../assets/images/dark.png') : require('../../assets/images/sun.png')}
          style={{
            width: TOGGLE_ICON_SIZE,
            height: TOGGLE_ICON_SIZE
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {renderImageWithTouchableOpacity(
        require('../../assets/images/skirtsg.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
        'first',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.50, left: SCREEN_WIDTH * 0.060, zIndex: 1 },
         'AllScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezu.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
        'treti',
        { position: 'absolute', top: SCREEN_HEIGHT * -0.01, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/love.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        'loves',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, left: SCREEN_WIDTH * 0.88, zIndex: 2 }
      )}
      {/* subs obrázek */}
      {renderImageWithTouchableOpacity(
  require('../../assets/images/subs.png'),
  { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
  { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 }, // Upraveno
  'subs',
  { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 }
)}
     
     <View style={styles.productDetailContainer}>
     <Image
        source={squareImage}
        style={styles.colorSquare}
        resizeMode="contain"
  />
  <View style={styles.productImageContainer}>
    <Image
      source={{ uri: product.image_url }}
      style={styles.productImage}
      resizeMode="contain"
    />
    <TouchableOpacity style={styles.touchableArea} onPress={handleProductPress} />
  </View>
  
  
  <Text style={[styles.productName, { color: textColor }]}>{product.name}</Text>
  
  <View style={styles.productDescriptionContainer}>
       <ScrollView>
         <Text style={[styles.productDescription, { color: textColor }]}>{product.description}</Text>
       </ScrollView>
     </View>
  
     <Text style={[styles.productManufacturer, { color: textColor }]}>{product.manufacturer_name}</Text>
     <Text style={[styles.productPrice, { color: textColor }]}>{`${product.price}`}</Text>
     
      </View>

      <TouchableOpacity style={styles.storeLinkButton} onPress={handleStoreLinkPress}>
        <Image
          source={require('../../assets/images/buybut.png')}
          style={styles.storeLinkIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
  <Image
    source={isFavorite ? require('../../assets/images/like.png') : 
      (isLightColor ? require('../../assets/images/nolike2.png') : require('../../assets/images/nolike.png'))}
    style={styles.likeIcon}
    resizeMode="contain"
  />
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04011A',
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
  productDetailContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImageContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.11,
    right: SCREEN_WIDTH * 0.40,
    zIndex: 2,
  },
  
    productImage: {
      width: SCREEN_WIDTH * 0.50,
      height: SCREEN_HEIGHT * 0.25,
  },
  touchableArea: {
    position: 'absolute',
    top: '15%',  // Upravte tuto hodnotu pro vertikální pozici
    left: '25%', // Upravte tuto hodnotu pro horizontální pozici
    width: '50%', // Upravte tuto hodnotu pro šířku
    height: '80%', // Upravte tuto hodnotu pro výšku
  
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.10,
    left: SCREEN_WIDTH * 0.58,
    zIndex: 2,
  },
  productDescription: {
    fontSize: 10,
    paddingHorizontal: 14,
  },
  productDescriptionContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.15,
    left: SCREEN_WIDTH * 0.55,
    right: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.12,
    zIndex: 2,
  },
  productManufacturer: {
    fontSize: 22,
    fontWeight: 'bold',
    top: SCREEN_HEIGHT * -0.010,
    right: SCREEN_WIDTH * 0.445,
    zIndex: 2,
    transform: [{ rotate: '90deg' }],
    textAlign: 'left',
    textAlignVertical: 'top',
    width: SCREEN_WIDTH * 0.40,
    height: SCREEN_HEIGHT * 0.1,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.29,
    right: SCREEN_WIDTH * 0.265,
    zIndex: 2,
  },
  colorSquare: {
    width: SCREEN_WIDTH * 0.895,
    height: SCREEN_WIDTH * 0.895,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.010,
    zIndex: 1,
  },
  storeLinkButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.55,
    right: SCREEN_WIDTH * 0.16,
    top: SCREEN_HEIGHT * 0.89,
    zIndex: 3,
  },
  storeLinkIcon: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.25,
  },
  likeButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.079,
    left: SCREEN_WIDTH * 0.09,
    zIndex: 3,
  },
  likeIcon: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
  },
  
});

export default SkirtsDetailScreen;
