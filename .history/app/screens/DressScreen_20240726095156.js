import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Text, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';
import { getToken } from '@/auth';
import LottieView from 'lottie-react-native';
import { useProfile } from '../../ProfileProvider';
import { useSubscription } from 'src/contexts/SubscriptionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const TOGGLE_ICON_TOP = SCREEN_HEIGHT * 0.155;
const TOGGLE_ICON_RIGHT = SCREEN_WIDTH * 0.23;
const TOGGLE_ICON_SIZE = SCREEN_WIDTH * 0.06;

const MAX_TRY_ON_RESULTS = 100;
const MAX_PRODUCTS_PER_DAY = 400;

const DressScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const { isDarkMode, toggleTheme } = useTheme();
  const flatListRef = useRef(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const { profiles, setProfiles, selectedProfileIndex, setSelectedProfileIndex } = useProfile();
  const { updateSubscriptionLimits } = useSubscription();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          if (!userId) {
            console.error('userId is undefined in loadData');
            setError('User is not authenticated');
            return;
          }

          console.log('Starting loadData for userId:', userId);
          const profileImage = await loadProfileImage();
          const tryOnResults = await loadTryOnResults(profileImage);

          if (route.params?.deletedItemId) {
            const updatedResults = tryOnResults.filter(item => item.id !== route.params.deletedItemId);
            setProfiles(updatedResults);
            navigation.setParams({ deletedItemId: undefined });
          } else {
            setProfiles(tryOnResults);
          }

          await fetchProducts();
        } catch (error) {
          console.error("Error in loadData:", error);
        }
      };

      if (userId) {
        loadData();
      } else {
        console.error('userId is undefined in useFocusEffect');
        setError('User is not authenticated');
      }
    }, [userId, route.params?.deletedItemId, setProfiles])
  );

  useEffect(() => {
    if (route.params?.selectedProfileIndex !== undefined) {
      setSelectedProfileIndex(route.params.selectedProfileIndex);
      flatListRef.current?.scrollToIndex({ 
        index: route.params.selectedProfileIndex, 
        animated: false,
        viewPosition: 0.5
      });
    }
  }, [route.params?.selectedProfileIndex]);

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
      const profileImages = response.data.profile_images;
      const activeImageUrl = profileImages && profileImages.length > 0 ? profileImages[0] : null;
      console.log("Active profile image URL loaded:", activeImageUrl);
      setProfileImageUrl(activeImageUrl);
      return activeImageUrl;
    } catch (error) {
      console.error('Error loading profile image:', error);
      setError('Failed to load profile image.');
      return null;
    }
  };

  const loadTryOnResults = async (profileImage) => {
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

      console.log('Try-on results:', response.data);

      const results = [
        { id: 'profile', imageUrl: profileImage },
        ...response.data.map(item => ({ id: item.id, imageUrl: item.result_image }))
      ];

      console.log('Processed try-on results:', results);

      if (results.length > MAX_TRY_ON_RESULTS) {
        Alert.alert(
          'Try-On Limit Reached',
          'You have reached the maximum number of try-ons. Each new try-on will delete the oldest result. Please back up any important results.'
        );
      }

      return results;
    } catch (error) {
      console.error('Error loading try-on results:', error);
      setError('Failed to load try-on results.');
      return [{ id: 'profile', imageUrl: profileImage || null }];
    }
  };

  const fetchProducts = async () => {
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }
  
      console.log("Fetching new products with category: dress");
      const response = await axios.get('http://192.168.0.106:8000/products/', {
        headers: {
          'Authorization': `Token ${userToken}`
        },
        params: {
          clothing_category: 'dress'
        }
      });
  
      let allProducts = response.data;
      
      // Implementace Fisher-Yates shuffle algoritmu
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
  
      // Náhodné zamíchání všech produktů
      const shuffledProducts = shuffleArray([...allProducts]);
  
      // Výběr prvních MAX_PRODUCTS_PER_DAY produktů
      const selectedProducts = shuffledProducts.slice(0, MAX_PRODUCTS_PER_DAY);
  
      console.log(`Received and shuffled ${selectedProducts.length} products`);
      setProducts(selectedProducts);
  
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products.');
    }
  };

  const handleTryOn = async (product) => {
    setError(null);
    setIsLoading(true);
    try {
      const userToken = await getToken();
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      const useFeatureResponse = await axios.post('http://192.168.0.106:8000/subscription/use_feature/',
        { feature_type: 'virtual_try_on' },
        { headers: { 'Authorization': `Token ${userToken}` } }
      );

      if (!useFeatureResponse.data.success) {
        if (useFeatureResponse.data.error === 'No virtual try-ons remaining') {
          Alert.alert('No Try-Ons Remaining', 'To get more try-ons, upgrade your subscription, or wait for the monthly renewal if you have a premium plan.');
          setIsLoading(false);
          return;
        }
        throw new Error(useFeatureResponse.data.message || 'Failed to use try-on feature');
      }

      updateSubscriptionLimits({
        virtual_try_ons_remaining: useFeatureResponse.data.virtual_try_ons_remaining
      });

      const response = await axios.post('http://192.168.0.106:8000/tryon/try-on/', {
        product_id: product.id,
      }, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });

      if (response.data && response.data.result_image) {
        const updatedProfiles = await loadTryOnResults(profileImageUrl);

        if (updatedProfiles.length > MAX_TRY_ON_RESULTS) {
          const excessProfiles = updatedProfiles.slice(0, updatedProfiles.length - MAX_TRY_ON_RESULTS);
          for (const profile of excessProfiles) {
            await axios.delete(`http://192.168.0.106:8000/tryon/delete-result/${profile.id}/`, {
              headers: { 'Authorization': `Token ${userToken}` }
            });
          }
          const limitedProfiles = updatedProfiles.slice(-MAX_TRY_ON_RESULTS);
          setProfiles(limitedProfiles);
        } else {
          setProfiles(updatedProfiles);
        }

        if (flatListRef.current && updatedProfiles.length > 1) {
          flatListRef.current.scrollToOffset({ offset: SCREEN_WIDTH, animated: true });
        }
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      if (error.message === 'User not authenticated') {
        setError('Please log in to use the Try On feature.');
      } else if (error.response && error.response.status === 403) {
        setError('You have run out of virtual try-ons. To get more, upgrade your subscription or wait for the monthly renewal if you have a premium plan.');
      } else {
        setError('Failed to process Try On. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    if (index !== selectedProfileIndex) {
      setSelectedProfileIndex(index);
      navigation.setParams({ selectedProfileIndex: index });
    }
  };

  const renderProfileItem = ({ item, index }) => {
    const isFromImageDetail = item.imageUrl.includes('from_image_detail=true');
    return (
      <TouchableOpacity
        onPress={() => {
          if (index !== 0 && item.id !== 'profile') {
            setSelectedProfileIndex(index);
            navigation.navigate('ImageDetailScreen', {
              imageUrl: item.imageUrl,
              profileIndex: index,
              itemId: item.id,
              userId: userId,
              lastViewedIndex: index
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
              style={[
                styles.profileImage,
                (index > 0 || isFromImageDetail) && styles.transformedProfileImage,
              ]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: 'gray' }]} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
              navigation.navigate(targetScreen, { userId, selectedProfileIndex });
            }
          }}
          delayPressIn={delayConfig.delayPressIn || 100}
          delayPressOut={delayConfig.delayPressOut || 100}
          delayLongPress={delayConfig.delayLongPress || 200}
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
          onPress={() => navigation.navigate('ProductDetailScreen', { product, userId, initialIndex: selectedProfileIndex })}
          delayPressIn={100}
          delayPressOut={100}
          delayLongPress={200}
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
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setSelectedProfileIndex(newIndex);
    }
  }, []);

  return (
    <View style={styles.container}>
      {profileImageUrl && (
        <FlatList
          ref={flatListRef}
          data={profiles}
          renderItem={renderProfileItem}
          extraData={selectedProfileIndex}
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
          initialScrollIndex={selectedProfileIndex}
          removeClippedSubviews={true}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          decelerationRate="fast"
          snapToAlignment="center"
          snapToInterval={SCREEN_WIDTH}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false, viewPosition: 0.5 });
            });
          }}
        />
      )}

      {renderImageWithTouchableOpacity(
        require('../../assets/images/dressg.png'),
        styles.dressImage,
        styles.dressButton,
        'first',
        styles.dressContainer,
        'AllScreen',
        { delayPressIn: 3, delayPressOut: 3, delayLongPress: 3 }
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/nandezud.png'),
        styles.nandezuImage,
        styles.nandezuButton,
        'treti',
        styles.nandezuContainer,
        'UserScreen',
        { delayPressIn: 3, delayPressOut: 3, delayLongPress: 3 }
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/loved.png'),
        styles.loveImage,
        styles.loveButton,
        'loves',
        styles.loveContainer,
        'ManageProfilePictures',
        { delayPressIn: 3, delayPressOut: 3, delayLongPress: 3 }
      )}
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subsd.png'),
        styles.subsImage,
        styles.subsButton,
        'subs',
        styles.subsContainer,
        'ProfileSetScreen',
        { delayPressIn: 3, delayPressOut: 3, delayLongPress: 3 }
      )}

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
    backgroundColor: '#CFD6DE',
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
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.07,
    right: SCREEN_WIDTH * 0.32,
    zIndex: 2,
    transform: [{ rotate: '90deg' }, { translateY: -SCREEN_WIDTH * 0.35 }],
    transformOrigin: 'top left',
    width: SCREEN_HEIGHT * 0.3,
    textAlign: 'left',
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

export default DressScreen;