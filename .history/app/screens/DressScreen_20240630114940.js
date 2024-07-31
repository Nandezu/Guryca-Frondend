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


  const getColorImage = (colour) => {
    if (!colour) {
      return require('../../assets/images/bluesquare.png');
    }
   
    switch (colour.toLowerCase()) {
      case 'red':
        return require('../../assets/images/redsquare.png');
      case 'green':
        return require('../../assets/images/greensquare.png');
      case 'blue':
        return require('../../assets/images/bluesquare.png');
      default:
        return require('../../assets/images/bluesquare.png');
    }
  };


  const renderProductItem = (product, index) => {
    let touchStartTime = 0;
    let touchEndTime = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    return (
        <TouchableOpacity 
            key={product.id} 
            style={styles.productWrapper}
            delayPressIn={200}  // Přidáme zpoždění 200ms před aktivací tlačítka
            onPressIn={(e) => {
                touchStartTime = new Date().getTime();
                touchStartX = e.nativeEvent.locationX;
            }}
            onPressOut={(e) => {
                touchEndTime = new Date().getTime();
                touchEndX = e.nativeEvent.locationX;
                
                const touchDuration = touchEndTime - touchStartTime;
                const touchDistance = Math.abs(touchEndX - touchStartX);

                // Pokud byl dotyk kratší než 300ms a posun byl menší než 10px, považujeme to za kliknutí
                if (touchDuration < 300 && touchDistance < 10) {
                    navigation.navigate('ProductDetailScreen', { product, userId });
                }
            }}
        >
            <Image
                source={getColorImage(product.colour)}
                style={styles.colorSquare}
                resizeMode="contain"
            />
            <Image
                source={{ uri: product.image_url }}
                style={styles.productImage}
                resizeMode="contain"
            />
            <Text style={styles.productManufacturer}>{product.manufacturer_name}</Text>
            <Text style={styles.productPrice}>{`${product.price} USD`}</Text>
        </TouchableOpacity>
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
    height: SCREEN_HEIGHT * 0.35,
    marginRight: SCREEN_WIDTH * -0.20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productImage: {
    width: SCREEN_WIDTH * 0.50,
    height: SCREEN_HEIGHT * 0.25,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.06,   // Zde nastavujete vertikální polohu
    right: SCREEN_WIDTH * 0.15,  // Zde nastavujete horizontální polohu
    zIndex: 2, // Zajistíme, že produkt bude nad barevným čtvercem
   
  },
  productManufacturer: {
    fontSize: 22,
    fontWeight: 'bold',
    top: SCREEN_HEIGHT * -0.009,   // Zde nastavujete vertikální polohu
    right: SCREEN_WIDTH * 0.295,  // Zde nastavujete horizontální polohu
    zIndex: 2,
    transform: [{ rotate: '90deg' }],// Zajistíme, že produkt bude nad barevným čtvercem
    textAlign: 'left',  // Zarovná text na levý okraj
    textAlignVertical: 'top',  // Zarovná text vertikálně nahoru
    width: SCREEN_WIDTH * 0.35,  // Šířka textového pole
    height: SCREEN_HEIGHT * 0.1,  // Výška textového pole
    color: '#342E2E',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',  // Zajistíme absolutní pozicování
    top: SCREEN_HEIGHT * 0.32,   // Nastavte vertikální polohu podle potřeby
    right: SCREEN_WIDTH * 0.52,  // Nastavte horizontální polohu podle potřeby
    zIndex: 2,
    color: '#342E2E',
   
  },
  colorSquare: {
    width: SCREEN_WIDTH * 0.63,  // Zde nastavujete šířku barevného čtverce
    height: SCREEN_WIDTH * 0.63, // Zde nastavujete výšku barevného čtverce
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.045,   // Zde nastavujete vertikální polohu
    right: SCREEN_WIDTH * 0.14,  // Zde nastavujete horizontální polohu
    zIndex: 1,


  },
});


export default DressScreen;