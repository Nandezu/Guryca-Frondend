import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Text, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const UserScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const flatListRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
            setError('Uživatel není autentizován');
            return;
          }
          const tryOnResults = await loadTryOnResults(token);
          setProfiles(tryOnResults);
          await fetchProducts();
        } catch (error) {
          console.error("Error in loadData:", error);
        }
      };
      if (userId) {
        loadData();
      } else {
        setError('Uživatel není autentizován');
      }
    }, [userId])
  );

  const loadTryOnResults = async (token) => {
    try {
      const response = await axios.get(`http://192.168.0.106:8000/tryon/results/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data.map(item => ({ id: item.id, imageUrl: item.result_image }));
    } catch (error) {
      setError('Nepodařilo se načíst výsledky try-on.');
      return [];
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.0.106:8000/products/');
      setProducts(response.data);
    } catch (error) {
      setError('Nepodařilo se načíst produkty.');
    }
  };

  const handleTryOn = async (product) => {
    setError(null);
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Pro použití funkce Try on se prosím přihlaste.');
        return;
      }
      const response = await axios.post('http://192.168.0.106:8000/tryon/try-on/', {
        product_id: product.id,
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      if (response.data && response.data.result_image) {
        const updatedProfiles = await loadTryOnResults(token);
        setProfiles(updatedProfiles);
        if (flatListRef.current && updatedProfiles.length > 1) {
          flatListRef.current.scrollToOffset({ offset: SCREEN_WIDTH, animated: true });
        }
      } else {
        setError('Neplatná odpověď ze serveru');
      }
    } catch (error) {
      setError('Nepodařilo se zpracovat Try on. Zkuste to prosím znovu.');
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
    <TouchableOpacity
      onPress={() => {
        if (item.id !== 'profile') {
          navigation.navigate('ImageDetailScreen', {
            imageUrl: item.imageUrl,
            profileIndex: index,
            itemId: item.id,
            userId: userId
          });
        }
      }}
      disabled={item.id === 'profile'}
      delayPressIn={100}
      delayPressOut={100}
      delayLongPress={200}
    >
      <View style={styles.profileItemContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: 'gray' }]} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item: product, index }) => (
    <View key={product.sku || `product-${index}`} style={styles.productWrapper}>
      <TouchableOpacity
        style={styles.productTouchable}
        onPress={() => navigation.navigate('ProductDetailScreen', { product, userId })}
        delayPressIn={100}
        delayPressOut={100}
        delayLongPress={200}
      >
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <Text style={styles.productManufacturer}>{product.manufacturer_name}</Text>
        <Text style={styles.productPrice}>{`${product.price}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tryonButton}
        onPress={() => handleTryOn(product)}
        delayPressIn={100}
        delayPressOut={100}
        delayLongPress={200}
      >
        <Image
          source={require('../../assets/images/tryons.png')}
          style={styles.tryonButtonImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
          { width: SCREEN_WIDTH * 0.51, height: SCREEN_HEIGHT * 0.260 },
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
          { width: SCREEN_WIDTH * 0.51, height: SCREEN_HEIGHT * 0.230 },
          'mep',
          { position: 'absolute', top: SCREEN_HEIGHT * 0.82, left: SCREEN_WIDTH * 0.240, zIndex: 2 },
          'FavoriteUserScreen'
        )}
      </ScrollView>

      <FlatList
        ref={flatListRef}
        data={profiles}
        renderItem={renderProfileItem}
        extraData={profiles}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.profileScrollContainer}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        scrollEventThrottle={200}
      >
        {products.map((product, index) => renderProductItem({ item: product, index }))}
      </ScrollView>

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
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.1,
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
    transform: [{ scaleX: 0.87 }],
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
});

export default UserScreen;
