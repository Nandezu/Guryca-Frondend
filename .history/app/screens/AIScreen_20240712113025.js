import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Text, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { getToken } from '@/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TOGGLE_ICON_TOP = SCREEN_HEIGHT * 0.155;
const TOGGLE_ICON_RIGHT = SCREEN_WIDTH * 0.23;
const TOGGLE_ICON_SIZE = SCREEN_WIDTH * 0.06;

const getWeeklySeed = (userId) => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.floor(diff / oneWeek);
  return weekNumber * 1000000 + userId;
};

const shuffleArray = (array, seed) => {
  let currentIndex = array.length, randomIndex;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  while (currentIndex !== 0) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

const AIScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profileImage, setProfileImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const { isDarkMode, toggleTheme } = useTheme();
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`);
        setProfileImage(response.data.profile_image);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.0.106:8000/products/');
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileImage();
    fetchProducts();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          if (!userId) {
            console.error('userId je nedefinované v loadData');
            return;
          }

          console.log('Začíná loadData pro userId:', userId);
          const profileImage = await loadProfileImage();
          const tryOnResults = await loadTryOnResults(profileImage);
          setProfiles(tryOnResults);
        } catch (error) {
          console.error("Chyba v loadData:", error);
        }
      };

      if (userId) {
        loadData();
      } else {
        console.error('userId je nedefinované v useFocusEffect');
      }
    }, [userId])
  );

  const loadProfileImage = async () => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('Uživatel není autentizován');
      }
  
      const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });
      const profileImages = response.data.profile_images;
      return profileImages && profileImages.length > 0 ? profileImages[0] : null;
    } catch (error) {
      console.error('Chyba při načítání profilového obrázku:', error);
      return null;
    }
  };

  const loadTryOnResults = async (profileImage) => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('Uživatel není autentizován');
      }
      const response = await axios.get(`http://192.168.0.106:8000/tryon/results/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });

      const results = [
        { id: 'profile', imageUrl: profileImage },
        ...response.data.map(item => ({ id: item.id, imageUrl: item.result_image }))
      ];

      return results;
    } catch (error) {
      console.error('Chyba při načítání výsledků try-on:', error);
      return [{ id: 'profile', imageUrl: profileImage || null }];
    }
  };

  const shuffledLimitedProducts = useMemo(() => {
    const userWeeklySeed = getWeeklySeed(userId);
    const shuffled = shuffleArray([...products], userWeeklySeed);
    return shuffled.slice(0, 100);
  }, [products, userId]);

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

  const renderProfileItem = ({ item, index }) => {
    return (
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
        delayPressIn={100}
        delayPressOut={100}
        delayLongPress={200}
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
  };

  const renderProductItem = (product, index) => {
    let touchStartTime = 0;
    let touchEndTime = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    const isLightColor = product.colour === 'light';
    const squareImage = isLightColor
      ? require('../../assets/images/lightsquare.png')
      : require('../../assets/images/darksquare.png');
    const textColor = isLightColor ? '#333333' : '#FFFFFF';

    return (
      <View key={product.id} style={styles.productWrapper}>
        <TouchableOpacity 
          style={styles.productTouchable}
          delayPressIn={200}
          onPressIn={(e) => {
            touchStartTime = new Date().getTime();
            touchStartX = e.nativeEvent.locationX;
          }}
          onPressOut={(e) => {
            touchEndTime = new Date().getTime();
            touchEndX = e.nativeEvent.locationX;
            
            const touchDuration = touchEndTime - touchStartTime;
            const touchDistance = Math.abs(touchEndX - touchStartX);

            if (touchDuration < 300 && touchDistance < 10) {
              navigation.navigate('AIDetailScreen', { product, userId });
            }
          }}
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
          onPress={() => console.log(`Try on pressed for product ${product.id}`)}
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
        source={require('../../assets/images/backai.png')}
        style={styles.backgroundImage}
      />
      <FlatList
        ref={flatListRef}
        data={profiles}
        renderItem={renderProfileItem}
        extraData={profiles}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const contentOffset = event.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffset / SCREEN_WIDTH);
          setSelectedProfileIndex(index);
        }}
        style={styles.profileScrollContainer}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />
      {renderImageWithTouchableOpacity(
        require('../../assets/images/aig.png'),
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2 },
        { width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.2, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
        'first',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.49, left: SCREEN_WIDTH * 0.060, zIndex: 1 },
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezud.png'),
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16 },
        { width: SCREEN_WIDTH * 0.35, height: SCREEN_HEIGHT * 0.16, top: SCREEN_HEIGHT * 0.025, left: SCREEN_WIDTH * 0.1 },
        'treti',
        { position: 'absolute', top: SCREEN_HEIGHT * -0.01, left: SCREEN_WIDTH * 0.330, zIndex: 2 },
        'UserScreen'
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/loved.png'),
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        { width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.035 },
        'loves',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.052, left: SCREEN_WIDTH * 0.88, zIndex: 2 }
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subsd.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        'subs',
        { position: 'absolute', top: SCREEN_HEIGHT * 0.050, left: SCREEN_WIDTH * 0.050, zIndex: 2 }
      )}
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContentContainer}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {shuffledLimitedProducts.map((product, index) => renderProductItem(product, index))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  profileScrollContainer: {
    position: 'absolute',
    top: 20, // Změňte tuto hodnotu na 0, aby byl FlatList úplně nahoře
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.5, // Můžete upravit výšku podle potřeby
    zIndex: 2,
  },
  profileItemContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_WIDTH * 0.55 * 1.6,
    borderRadius: 20,
  },
  transformedProfileImage: {
    transform: [{ scaleX: 0.87 }],
  },
});

export default AIScreen;