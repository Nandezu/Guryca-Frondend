// AllScreen.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AllScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/alles.png')}
        style={styles.image}
      />
      <TouchableOpacity style={styles.button} onPress={() => alert('Button pressed!')}>
        {/* Prázdný obsah TouchableOpacity, protože chceme jen nastavit dotykovou zónu */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200, // Šířka obrázku
    height: 100, // Výška obrázku
  },
  button: {
    position: 'absolute',
    width: 100, // Šířka dotykové zóny
    height: 50, // Výška dotykové zóny
    top: '50%', // Umístí dotykovou zónu do středu obrázku (může být upraveno)
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -25 }], // Posune dotykovou zónu na správné místo
  },
});

export default AllScreen;

