// AllScreen.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AllScreen = () => {
  return (
    <View style={styles.container}>
      {/* První obrázek s vlastní velikostí a dotykovou zónou */}
      <View style={[styles.imageContainer, { top: 50, left: 30 }]}>
        <Image
          source={require('../../assets/images/alles.png')}
          style={[styles.image, { width: 200, height: 100 }]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.button, { width: 100, height: 50, top: 25, left: 50 }]}
          onPress={() => alert('First button pressed!')}
        >
          {/* Prázdný obsah TouchableOpacity */}
        </TouchableOpacity>
      </View>

      {/* Druhý obrázek s vlastní velikostí a dotykovou zónou */}
      <View style={[styles.imageContainer, { top: 200, left: 100 }]}>
        <Image
          source={require('../../assets/images/allp.png')}
          style={[styles.image, { width: 150, height: 75 }]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.button, { width: 75, height: 37, top: 19, left: 37 }]}
          onPress={() => alert('Second button pressed!')}
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
  button: {
    position: 'absolute',
  },
});

export default AllScreen;
