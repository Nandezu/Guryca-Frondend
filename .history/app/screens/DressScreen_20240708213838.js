import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { getToken } from '@/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await loadProfileImage();
      await loadTryOnResults();
      await fetchProducts();
    };
    
    loadData();
  }, [userId]);

  const loadProfileImage = async () => {
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
      setProfileImageUrl(response.data.profile_image_url);
    } catch (error) {
      console.error('Error loading profile image:', error);
      setError('Nepodařilo se načíst profilový obrázek.');
    }
  };

  const loadTryOnResults = async () => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }
  
      const response = await axios.get(`http://192.168.0.106:8000/tryon/results/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });
      
      // Ensure profileImageUrl is loaded before setting profiles
      if (profileImageUrl) {
        setProfiles([profileImageUrl, ...response.data.map(item => item.result_image)]);
      } else {
        console.warn('Profile image URL is not loaded yet');
      }
    } catch (error) {
      console.error('Error loading try-on results:', error);
      setError('Nepodařilo se načíst výsledky try-on.');
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

  const handleTryOn = async (product) => {
    setIsLoading(true);
    setError(null);
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post('http://192.168.0.106:8000/tryon/try-on/', {
        product_id: product.id,
      }, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });

      if (response.data && response.data.result_image) {
        await loadTryOnResults();
        setSelectedProfileIndex(1);  // Nastaví index na první try-on výsledek
        flatListRef.current.scrollToIndex({ index: 1, animated: true });
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

  const handleDelete = async (index) => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }
  
      const tryOnResultId = profiles[index].id;
      await axios.delete(`http://192.168.0.106:8000/tryon/delete-result/${tryOnResultId}/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });
      await loadTryOnResults();
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Nepodařilo se smazat výsledek try-on.');
    }
  };

  const renderProfileItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        if (index !== 0) {
          navigation.navigate('ImageDetailScreen', {
            imageUrl: item,
            profileIndex: index,
            onDelete: () => handleDelete(index),
          });
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
          style={[styles.profileImage, index > 0 && styles.transformedProfileImage]}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );

  const renderImageWithTouchableOpacity = (imageSource, imageStyle, touchableStyle, pressedKey, containerStyle, targetScreen, delayConfig = {}) => {
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
          delayPressIn={delayConfig.delayPressIn || 100}  // Delay before press in starts
          delayPressOut={delayConfig.delayPressOut || 100} // Delay before press out starts
          delayLongPress={delayConfig.delayLongPress || 200} // Delay for long press
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
          delayPressIn={100}  // Delay before press in starts
          delayPressOut={100} // Delay before press out starts
          delayLongPress={200} // Delay for long press
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
          delayPressIn={100}  // Delay before press in starts
          delayPressOut={100} // Delay before press out starts
          delayLongPress={200} // Delay for long press
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
      {profileImageUrl && (
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
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/dressg.png'),
        styles.dressImage,
        styles.dressButton,
        'first',
        styles.dressContainer,
        'AllScreen',
        { delayPressIn: 5, delayPressOut: 5, delayLongPress: 5 }
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
        scrollEventThrottle={200} // Zvyšuje interval scroll událostí
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
    transform: [{ scaleX: 0.87 }], // Zde měníme šířku obrázku pro nové obrázky
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
