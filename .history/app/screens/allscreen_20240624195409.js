// AllScreen.js
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const AllScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false });
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params; // Získání userId z navigačních parametrů

  return (
    <View style={styles.container}>
      {/* První obrázek s vlastní velikostí a dotykovou zónou */}
      <View style={[styles.imageContainer, { top: 50, left: 30 }]}>
        <Image
          source={require('../../assets/images/alles.png')}
          style={[
            styles.image,
            { width: 200, height: 100 },
            pressed.first && styles.pressedImage, // Změna stylu při stisknutí
          ]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.button, { width: 100, height: 50, top: 25, left: 50 }]}
          onPressIn={() => setPressed({ ...pressed, first: true })}
          onPressOut={() => setPressed({ ...pressed, first: false })}
          onPress={() => navigation.navigate('UserScreen', { userId })}
        >
          {/* Prázdný obsah TouchableOpacity */}
        </TouchableOpacity>
      </View>

      {/* Druhý obrázek s vlastní velikostí a dotykovou zónou */}
      <View style={[styles.imageContainer, { top: 200, left: 100 }]}>
        <Image
          source={require('../../assets/images/allp.png')}
          style={[
            styles.image,
            { width: 150, height: 75 },
            pressed.second && styles.pressedImage, // Změna stylu při stisknutí
          ]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.button, { width: 75, height: 37, top: 19, left: 37 }]}
          onPressIn={() => setPressed({ ...pressed, second: true })}
          onPressOut={() => setPressed({ ...pressed, second: false })}
          onPress={() => navigation.navigate('UserScreen', { userId })}
        >
          {/* Prázdný obsah TouchableOpacity */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Přidáno pro absolutní pozicování v rámci kontejneru
  },
  imageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // Základní styl pro obrázky
  },
  pressedImage: {
    opacity: 0.5, // Efekt při stisknutí (můžeš upravit dle potřeby)
  },
  button: {
    position: 'absolute',
  },
});

export default AllScreen;
