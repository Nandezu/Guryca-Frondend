import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, Linking, ScrollView, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfile } from '../../ProfileProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONTAINER_WIDTH = SCREEN_WIDTH * 0.55;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.6;

const ProductDetailScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profileImage, setProfileImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { product, userId } = route.params;
  const flatListRef = useRef(null);

  const { profiles, setProfiles, selectedProfileIndex, setSelectedProfileIndex } = useProfile();

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

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: selectedProfileIndex,
        animated: true,
      });
    }
  }, [selectedProfileIndex]);

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
    navigation.navigate('DressScreen', { userId, selectedProductId: product.id });
  };

  const handleStoreLinkPress = () => {
    if (product.store_link) {
      Linking.openURL(product.store_link).catch((err) => console.error('An error occurred', err));
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setSelectedProfileIndex(index);
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
              style={[
                styles.profileImage,
                (isFromImageDetail || index > 0) && styles.transformedProfileImage,
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
        onScrollToIndexFailed={() => {}}
      />

      {renderImageWithTouchableOpacity(
        require('../../assets/images/dressg.png'),
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
      {renderImageWithTouchableOpacity(
        require('../../assets/images/subs.png'),
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
        { width: SCREEN_WIDTH * 0.08, height: SCREEN_HEIGHT * 0.04 },
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
          source={likeIconSource}
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
    fontSize: 19,
    fontWeight: 'bold',
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.12,  // Upravte tuto hodnotu pro požadovanou výšku
    right: SCREEN_WIDTH * 0.60,  // Upravte tuto hodnotu pro požadovanou pozici zleva
    zIndex: 2,
    transform: [{ rotate: '90deg' }, { translateY: -SCREEN_WIDTH * 0.35 }],  // Přidáno translateY
    transformOrigin: 'top left',
    width: SCREEN_HEIGHT * 0.3,  // Použijeme výšku obrazovky pro šířku rotovaného textu
    textAlign: 'left',
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
  
});

export default ProductDetailScreen;
