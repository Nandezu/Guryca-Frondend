import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Text, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const TOGGLE_ICON_TOP = SCREEN_HEIGHT * 0.155;
const TOGGLE_ICON_RIGHT = SCREEN_WIDTH * 0.23;
const TOGGLE_ICON_SIZE = SCREEN_WIDTH * 0.06;

const FavoriteUserScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profiles, setProfiles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const { isDarkMode, toggleTheme } = useTheme();
  const flatListRef = useRef(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const fetchProfileImage = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`http://192.168.0.106:8000/users/${userId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setProfileImageUrl(response.data.profile_image);
      return response.data.profile_image;
    } catch (error) {
      console.error(error);
      setError('Nepodařilo se načíst profilový obrázek.');
      return null;
    }
  };

  const loadTryOnResults = async (profileImage) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`http://192.168.0.106:8000/tryon/results/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      const results = [
        { id: 'profile', imageUrl: profileImage },
        ...response.data.map(item => ({ id: item.id, imageUrl: item.result_image }))
      ];

      return results;
    } catch (error) {
      console.error('Error loading try-on results:', error);
      setError('Nepodařilo se načíst výsledky try-on.');
      return [{ id: 'profile', imageUrl: profileImage || null }];
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`http://192.168.0.106:8000/favorites/`, {
        headers: { 'Authorization': `Token ${token}` },
        params: { user: userId }
      });
      const sortedFavorites = response.data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setFavorites(sortedFavorites);
    } catch (error) {
      console.error(error);
      setError('Nepodařilo se načíst oblíbené položky.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const profileImage = await fetchProfileImage();
          const tryOnResults = await loadTryOnResults(profileImage);
          setProfiles(tryOnResults);
          await fetchFavorites();
        } catch (error) {
          console.error("Error in loadData:", error);
        }
      };

      loadData();
    }, [userId])
  );

  const handleTryOn = async (product) => {
    setError(null);
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post('http://192.168.0.106:8000/tryon/try-on/', {
        product_id: product.id,
      }, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (response.data && response.data.result_image) {
        const updatedProfiles = await loadTryOnResults(profileImageUrl);
        setProfiles(updatedProfiles);
        if (flatListRef.current && updatedProfiles.length > 1) {
          flatListRef.current.scrollToOffset({ offset: SCREEN_WIDTH, animated: true });
        }
      } else {
        throw new Error('Neplatná odpověď ze serveru');
      }
    } catch (error) {
      console.error('Chyba při zpracování Try on:', error);
      setError('Nepodařilo se zpracovat Try on. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        if (index !== 0 && item.id !== 'profile') {
          navigation.navigate('ImageDetailScreen', {
            imageUrl: item.imageUrl,
            profileIndex: index,
            itemId: item.id,
            userId: userId
          });
        }
      }}
      disabled={index === 0 || item.id === 'profile'}
    >
      <View style={styles.profileItemContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={[styles.profileImage, index > 0 && styles.transformedProfileImage]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: 'gray' }]} />
        )}
      </View>
    </TouchableOpacity>
  );

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

  const renderProductItem = ({ item: favorite, index }) => {
    const product = favorite.product;
    const isLightColor = product.colour === 'light';
    const squareImage = isLightColor
      ? require('../../assets/images/lightsquare.png')
      : require('../../assets/images/darksquare.png');
    const textColor = isLightColor ? '#333333' : '#FFFFFF';

    return (
      <View key={product.id} style={styles.productWrapper}>
        <TouchableOpacity 
          style={styles.productTouchable}
          onPress={() => navigation.navigate('MeProductDetailScreen', { product, userId })}
        >
          <Image
            source={squareImage}
            style={styles.colorSquare}
            resizeMode="contain"
          />
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <Text style={[styles.productManufacturer, { color: textColor }]}>{product.manufacturer_name}</Text>
          <Text style={[styles.productPrice, { color: textColor }]}>{`${product.price}`}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tryonButton}
          onPress={() => handleTryOn(product)}
        >
          <Image
            source={require('../../assets/images/tryons.png')}
            style={styles.tryonButtonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/backroundme.png')}
        style={styles.backgroundImage}
      />
      
      <FlatList
        ref={flatListRef}
        data={profiles}
        renderItem={renderProfileItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.profileScrollContainer}
      />

      <Image
        source={isDarkMode ? require('../../assets/images/square2.png') : require('../../assets/images/square.png')}
        style={styles.squareImage}
        resizeMode="contain"
      />
      
      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        <Image
          source={isDarkMode ? require('../../assets/images/dark.png') : require('../../assets/images/sun.png')}
          style={styles.themeToggleIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      {renderImageWithTouchableOpacity(
        require('../../assets/images/formeg.png'),
        styles.forMeImage,
        styles.forMeButton,
        'first',
        styles.forMeContainer,
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezu.png'),
        styles.nandezuImage,
        styles.nandezuButton,
        'treti',
        styles.nandezuContainer,
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/love.png'),
        styles.loveImage,
        styles.loveButton,
        'loves',
        styles.loveContainer
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subsi.png'),
        styles.subsImage,
        styles.subsButton,
        'subs',
        styles.subsContainer
      )}
      
      <FlatList
        data={favorites}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.scrollContainer}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={require('../../assets/ufo.json')}
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
          <Text style={styles.loadingText}>Dressing....</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (zachovejte stávající styly a přidejte nové podle potřeby)
  profileScrollContainer: {
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingAnimation: {
    width: 300,
    height: 300,
  },
  loadingText: {
    color: 'white',
    fontSize: 35,
    marginTop: 60,
  },

  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
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
  scrollContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.56,
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.55,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.03,
  },
  productWrapper: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.40,
    marginRight: SCREEN_WIDTH * -0.25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productTouchable: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: SCREEN_WIDTH * 0.50,
    height: SCREEN_HEIGHT * 0.25,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.06,
    right: SCREEN_WIDTH * 0.15,
    zIndex: 2,
  },
  productManufacturer: {
    fontSize: 22,
    fontWeight: 'bold',
    top: SCREEN_HEIGHT * -0.009,
    right: SCREEN_WIDTH * 0.295,
    zIndex: 2,
    transform: [{ rotate: '90deg' }],
    textAlign: 'left',
    textAlignVertical: 'top',
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.1,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.32,
    right: SCREEN_WIDTH * 0.49,
    zIndex: 2,
  },
  colorSquare: {
    width: SCREEN_WIDTH * 0.63,
    height: SCREEN_WIDTH * 0.63,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.045,
    right: SCREEN_WIDTH * 0.14,
    zIndex: 1,
  },
  tryonButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * -0.05,
    left: SCREEN_WIDTH * 0.20,
    zIndex: 3,
  },
  tryonButtonImage: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.05,
  },
});

export default FavoriteUserScreen;
