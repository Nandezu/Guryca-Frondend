import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DressScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false, fifth: false });
  const [profileImage, setProfileImage] = useState(null);
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

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
        const response = await axios.get('http://192.168.0.106:8000/shop/products/');
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileImage();
    fetchProducts();
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

  const renderProductItem = (product, index) => {
    let touchStartTime = 0;
    let touchEndTime = 0;
    let touchStartX = 0;
    let touchEndX = 0;

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
              navigation.navigate('ProductDetailScreen', { product, userId });
            }
          }}
        >
          <Image
            source={require('../../assets/images/redsquare.png')}
            style={styles.colorSquare}
            resizeMode="contain"
          />
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
      {profileImage && (
        <Image
          source={{ uri: profileImage }}
          style={{ width: SCREEN_WIDTH * 1, height: SCREEN_HEIGHT * 0.5, position: 'absolute', top: SCREEN_HEIGHT * 0.08, left: SCREEN_WIDTH * 0.010, zIndex: 2 }}
          resizeMode="contain"
        />
      )}
      <Image
        source={require('../../assets/images/square.png')}
        style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.40, position: 'absolute', top: SCREEN_HEIGHT * 0.14, left: SCREEN_WIDTH * 0.12, zIndex: 1 }}
        resizeMode="contain"
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
     
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContentContainer}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {products.map((product, index) => renderProductItem(product, index))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0920',
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
    top: SCREEN_HEIGHT * 0.1,
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.44,
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
    marginRight: SCREEN_WIDTH * -0.20,
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
    color: '#C5C5C5',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.32,
    right: SCREEN_WIDTH * 0.52,
    zIndex: 2,
    color: '#C5C5C5',
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
    bottom: SCREEN_HEIGHT * 0.02,
    left: SCREEN_WIDTH * 0.25,
    zIndex: 3,
  },
  tryonButtonImage: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.05,
  },
});

export default DressScreen;