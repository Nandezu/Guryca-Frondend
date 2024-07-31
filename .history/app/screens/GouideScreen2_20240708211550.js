import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function GouideScreen2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;  // Přidáno pro získání userId

  const handleConfirm = () => {
    navigation.navigate('GouideScreen3', { userId });
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/Tryon.png')} 
        style={styles.image} 
        resizeMode="contain" // Přidání resizeMode pro správné přizpůsobení obrázku
      />
      <Image 
        source={require('../../assets/images/tryons.png')} 
        style={styles.images} 
        resizeMode="contain" // Přidání resizeMode pro správné přizpůsobení obrázku
      />
      
      <Text style={styles.progressText}>2/5</Text>
      <Text style={styles.descriptionText}>
      
      Easily try on any outfit on your photo in seconds with our virtual fitting feature, simply by clicking the TRY ON button.
        
      </Text>
      <TouchableOpacity 
  style={styles.confirmButton} 
  onPress={() => navigation.navigate('GouideScreen3', { userId })}
>
  <Text style={styles.buttonText}>Confirm</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 350, // Nastavte šířku podle potřeby
    height: 350, // Nastavte výšku podle potřeby
    position: 'absolute',
    top: 60, // Nastavte horní pozici podle potřeby
    left: '50%',
    transform: [{ translateX: -160 }], // Center horizontally
  },
  images: {
    width: 100, // Nastavte šířku podle potřeby
    height: 100, // Nastavte výšku podle potřeby
    position: 'absolute',
    top: 560, // Nastavte horní pozici podle potřeby
    left: '50%',
    transform: [{ translateX: -27 }], // Center horizontally
  },
  progressText: {
    position: 'absolute',
    top: 400, // Nastavte horní pozici podle potřeby
    left: '50%',
    transform: [{ translateX: 5 }], // Center horizontally
    color: '#fff',
    fontSize: 20,
    fontWeight: 'light',
  },
  descriptionText: {
    position: 'absolute',
    top: 450, // Nastavte horní pozici podle potřeby
    left: '50%',
    width: '80%',
    transform: [{ translateX: -99 }], // Center horizontally
    color: '#fff',
    fontSize: 18,
    textAlign: 'left',
  },
  confirmButton: {
    position: 'absolute',
    top: 680, // Nastavte horní pozici podle potřeby
    left: '50%',
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -70 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
