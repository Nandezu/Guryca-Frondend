// AllScreen.js
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const AllScreen = () => {
  const [pressed, setPressed] = useState({ first: false, second: false, third: false, fourth: false });
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params; // Získání userId z navigačních parametrů

  return (
    <View style={styles.container}>
      {/* První obrázek s vlastní velikostí a dotykovou zónou */}
      <View style={[styles.imageContainer, { position: 'absolute', top: 10, left: 10 }]}>
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
      <View style={[styles.imageContainer, { position: 'absolute', top: 50, left: 100 }]}>
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

      {/* Horizontální ScrollView pro třetí, čtvrtý a pátý obrázek */}
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
      >
        {/* Třetí obrázek s vlastní velikostí a dotykovou zónou */}
        <View style={[styles.imageContainer, { position: 'absolute', marginRight: -450, top: -10, left: -200 }]}>
          <Image
            source={require('../../assets/images/dresso.png')}
            style={[
              styles.image,
              { width: 700, height: 350 },
              pressed.third && styles.pressedImage, // Změna stylu při stisknutí
            ]}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={[styles.button, { width: 100, height: 100, top: 125, left: 300, backgroundColor: 'rgba(0, 0, 255, 0.2)' }]}
            onPressIn={() => setPressed({ ...pressed, third: true })}
            onPressOut={() => setPressed({ ...pressed, third: false })}
            onPress={() => navigation.navigate('UserScreen', { userId })}
          >
            {/* Prázdný obsah TouchableOpacity */}
          </TouchableOpacity>
        </View>

        {/* Čtvrtý obrázek s vlastní velikostí a dotykovou zónou */}
        <View style={[styles.imageContainer, { position: 'absolute', marginRight: -250, top: 90, left: -200 }]}>
          <Image
            source={require('../../assets/images/topps.png')}
            style={[
              styles.image,
              { width: 700, height: 350 },
              pressed.fourth && styles.pressedImage, // Změna stylu při stisknutí
            ]}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={[styles.button, { width: 100, height: 100, top: 125, left: 300, backgroundColor: 'rgba(0, 0, 255, 0.2)' }]}
            onPressIn={() => setPressed({ ...pressed, fourth: true })}
            onPressOut={() => setPressed({ ...pressed, fourth: false })}
            onPress={() => navigation.navigate('UserScreen', { userId })}
          >
            {/* Prázdný obsah TouchableOpacity */}
          </TouchableOpacity>
        </View>

        {/* Pátý obrázek s vlastní velikostí a dotykovou zónou */}
        <View style={[styles.imageContainer, { position: 'absolute', marginRight: -20, top: 25, left: 0 }]}>
          <Image
            source={require('../../assets/images/jacket.png')}
            style={[
              styles.image,
              { width: 490, height: 240 },
              pressed.fourth && styles.pressedImage, // Změna stylu při stisknutí
            ]}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={[styles.button, { width: 100, height: 100, top: 50, left: 200, backgroundColor: 'rgba(0, 0, 255, 0.2)' }]}
            onPressIn={() => setPressed({ ...pressed, fourth: true })}
            onPressOut={() => setPressed({ ...pressed, fourth: false })}
            onPress={() => navigation.navigate('UserScreen', { userId })}
          >
            {/* Prázdný obsah TouchableOpacity */}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
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
