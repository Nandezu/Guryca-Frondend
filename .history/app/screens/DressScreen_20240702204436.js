import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '@/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_PROFILES = 20;
const PROFILE_WIDTH = SCREEN_WIDTH * 0.8;

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
    fetchProfileImage();
    fetchProducts();
  }, [userId]);

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(`http://192.168.0.106:8000/user/users/${userId}/`);
      setProfiles([response.data.profile_image]);
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

  const manageProfiles = (newProfile) => {
    setProfiles(prevProfiles => {
      const originalProfile = prevProfiles[0];
      let updatedProfiles = [originalProfile, ...prevProfiles.slice(1), newProfile];
      if (updatedProfiles.length > MAX_PROFILES) {
        updatedProfiles = [originalProfile, ...updatedProfiles.slice(-(MAX_PROFILES - 1))];
      }
      return updatedProfiles;
    });
  };

  const handleTryOn = async (product) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://192.168.0.106:8000/api/spustit-ai-model/', {
        garm_img: product.image_url,
        human_img: profiles[selectedProfileIndex],
        garment_des: product.manufacturer_name + " " + product.name
      });
      
      manageProfiles(response.data.output);
      setSelectedProfileIndex(profiles.length);
      flatListRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Chyba při zpracování Try on:', error);
      setError('Nepodařilo se zpracovat Try on. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / PROFILE_WIDTH);
    setSelectedProfileIndex(index);
  };

  const renderProfileItem = ({ item }) => (
    <Image
      source={{ uri: item }}
      style={styles.profileImage}
      resizeMode="contain"
    />
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

  const renderProductItem = ({ item: product }) => {
    const isLightColor = product.colour === 'light';
    const squareImage = isLightColor
      ? require('../../assets/images/lightsquare.png')
      : require('../../assets/images/darksquare.png');
    const textColor = isLightColor ? '#333333' : '#FFFFFF';

    return (
      <View style={styles.productWrapper}>
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
        contentContainerStyle={styles.profileScrollContainer}
      />

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

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.scrollContainer}
      />

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
  // ... (ponechte všechny existující styly)
});

export default DressScreen;