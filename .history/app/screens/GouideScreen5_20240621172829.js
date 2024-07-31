import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function GouideScreen5() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;  // Přidáno pro získání userId

  const handleConfirm = () => {
    navigation.navigate('GouideScreen6', { userId });
  };
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/Favourite.png')} 
        style={styles.image} 
        resizeMode="contain" // Přidání resizeMode pro správné přizpůsobení obrázku
      />
      <Image 
        source={require('../../assets/images/favour.png')} 
        style={styles.images} 
        resizeMode="contain" // Přidání resizeMode pro správné přizpůsobení obrázku
      />
      <Text style={styles.progressText}>5/5</Text>
      <Text style={styles.descriptionText}>
      
      Save your favorite pieces and easily purchase them through direct links in your favorite online stores within your shopping zone.
        
      </Text>
      <TouchableOpacity 
  style={styles.confirmButton} 
  onPress={() => navigation.navigate('GouideScreen6', { userId })}
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
    width: 250, // Nastavte šířku podle potřeby
    height: 250, // Nastavte výšku podle potřeby
    position: 'absolute',
    top: 70, // Nastavte horní pozici podle potřeby
    left: '50%',
    transform: [{ translateX: -130 }], // Center horizontally
  },
  images: {
    width: 250, // Nastavte šířku podle potřeby
    height: 250, // Nastavte výšku podle potřeby
    position: 'absolute',
    top: 460, // Nastavte horní pozici podle potřeby
    left: '50%',
    transform: [{ translateX: -105 }], // Center horizontally
  },
  progressText: {
    position: 'absolute',
    top: 350, // Nastavte horní pozici podle potřeby
    left: '50%',
    transform: [{ translateX: -2 }], // Center horizontally
    color: '#fff',
    fontSize: 20,
    fontWeight: 'light',
  },
  descriptionText: {
    position: 'absolute',
    top: 410, // Nastavte horní pozici podle potřeby
    left: '50%',
    width: '80%',
    transform: [{ translateX: -95 }], // Center horizontally
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
    transform: [{ translateX: -72 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
