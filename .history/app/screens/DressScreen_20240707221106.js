import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { getToken } from '@/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_PROFILES = 20;
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const TOGGLE_ICON_TOP = SCREEN_HEIGHT * 0.155;
const TOGGLE_ICON_RIGHT = SCREEN_WIDTH * 0.23;
const TOGGLE_ICON_SIZE = SCREEN_WIDTH * 0.06;

const DressScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const { isDarkMode, toggleTheme } = useTheme();
  const flatListRef = useRef(null);

  useEffect(() => {
    loadProfiles();
    fetchProducts();
  }, [userId]);

  const loadProfiles = async () => {
    try {
      const savedProfiles = await AsyncStorage.getItem('profiles');
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      } else {
        fetchProfileImage();
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      fetchProfileImage();
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`);
      const profileImageUrl = response.data.profile_image_url;
      setProfiles([profileImageUrl]);
      await AsyncStorage.setItem('profiles', JSON.stringify([profileImageUrl]));
    } catch (error) {
      console.error(error);
      setError('Nepodařilo se načíst profilový obrázek.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.0.106:8000/products/');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      setError('Nepodařilo se načíst produkty.');
    }
  };

  const manageProfiles = async (newProfile) => {
    setProfiles(prevProfiles => {
      const updatedProfiles = [prevProfiles[0], ...prevProfiles.slice(1), newProfile];
      if (updatedProfiles.length > MAX_PROFILES) {
        updatedProfiles.splice(1, 1);
      }
      AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      return updatedProfiles;
    });
  };

  const handleTryOn = async (product) => {
    setIsLoading(true);
    setError(null);
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      const currentImageUrl = profiles[selectedProfileIndex];

      const response = await axios.post('http://192.168.0.106:8000/tryon/try-on/', {
        product_id: product.id,
        base_image_url: currentImageUrl
      }, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });

      if (response.data && response.data.result_image) {
        await manageProfiles(response.data.result_image);
        setSelectedProfileIndex(profiles.length);
        flatListRef.current.scrollToEnd({ animated: true });
      } else {
        throw new Error('Neplatná odpověď ze serveru');
      }
    } catch (error) {
      console.error('Chyba při zpracování Try on:', error);
      if (error.message === 'User not authenticated') {
        setError('Pro použití funkce Try on se prosím přihlaste.');
      } else {
        setError('Nepodařilo se zpracovat Try on. Zkuste to prosím znovu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setSelectedProfileIndex(index);
  };

  const renderProfileItem = ({ item, index }) => (
    <View style={styles.profileItemContainer}>
      <Image
        source={{ uri: item }}
        style={[styles.profileImage, index > 0 && styles.transformedProfileImage]}
        resizeMode="cover"
      />
    </View>
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

  const renderProductItem = ({ item: product, index }) => {
    const isLightColor = product.colour === 'light';
    const squareImage = isLightColor
      ? require('../../assets/images/lightsquare.png')
      : require('../../assets/images/darksquare.png');
    const textColor = isLightColor ? '#333333' : '#FFFFFF';

    return (
      <View key={product.sku || `product-${index}`} style={styles.productWrapper}>
        <TouchableOpacity
          style={styles.productTouchable}
          onPress={() => navigation.navigate('ProductDetailScreen', { product, userId })}
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
      <FlatList
        ref={flatListRef}
        data={profiles}
        renderItem={renderProfileItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.profileScrollContainer}
      />

      

      {renderImageWithTouchableOpacity(
        require('../../assets/images/dressg.png'),
        styles.dressImage,
        styles.dressButton,
        'first',
        styles.dressContainer,
        'AllScreen'
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
        require('../../assets/images/subs.png'),
        styles.subsImage,
        styles.subsButton,
        'subs',
        styles.subsContainer
      )}

      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {products.map((product, index) => renderProductItem({ item: product, index }))}
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

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
    backgroundColor: '#000000',
  },
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
    transform: [{ scaleX: 0.82 }], // Zde měníme šířku obrázku pro nové obrázky
  },
  themeToggle: {
    position: 'absolute',
    top: TOGGLE_ICON_TOP,
    right: TOGGLE_ICON_RIGHT,
    zIndex: 3,
  },
  themeToggleIcon: {
    width: TOGGLE_ICON_SIZE,
    height: TOGGLE_ICON_SIZE,
  },
  dressContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.50,
    left: SCREEN_WIDTH * 0.060,
    zIndex: 1,
  },
  dressImage: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.2,
  },
  dressButton: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.2,
    top: SCREEN_HEIGHT * 0.025,
    left: SCREEN_WIDTH * 0.1,
  },
  nandezuContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * -0.01,
    left: SCREEN_WIDTH * 0.330,
    zIndex: 2,
  },
  nandezuImage: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.16,
  },
  nandezuButton: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.16,
    top: SCREEN_HEIGHT * 0.025,
    left: SCREEN_WIDTH * 0.1,
  },
  loveContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.052,
    left: SCREEN_WIDTH * 0.88,
    zIndex: 2,
  },
  loveImage: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_HEIGHT * 0.035,
  },
  loveButton: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_HEIGHT * 0.035,
  },
  subsContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.050,
    left: SCREEN_WIDTH * 0.050,
    zIndex: 2,
  },
  subsImage: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.04,
  },
  subsButton: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.04,
  },
  scrollContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.56,
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.55,
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
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
});

export default DressScreen;
