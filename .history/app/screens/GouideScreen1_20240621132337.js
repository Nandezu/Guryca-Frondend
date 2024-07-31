import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function GouideScreen1() {
  const navigation = useNavigation();

  const handleConfirm = () => {
    // Zde můžete přidat logiku, kam má tlačítko Confirm navigovat
    // například: navigation.navigate('NextScreen');
    alert('Confirmed');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/Disco.png')} 
        style={styles.image} 
        resizeMode="contain" // Přidání resizeMode pro správné přizpůsobení obrázku
      />
      <Text style={styles.progressText}>1/4</Text>
      <Text style={styles.descriptionText}>
      
Get access to the world's largest selection of over 60,000 clothing products and thousands of brands, from top designers to emerging talents.
        
      </Text>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
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
    width: 300, // Nastavte šířku podle potřeby
    height: 300, // Nastavte výšku podle potřeby
    position: 'absolute',
    top: 70, // Nastavte horní pozici podle potřeby
    left: '50%',
    transform: [{ translateX: -130 }], // Center horizontally
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
    top: 430, // Nastavte horní pozici podle potřeby
    left: '50%',
    width: '80%',
    transform: [{ translateX: -105 }], // Center horizontally
    color: '#fff',
    fontSize: 20,
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
    transform: [{ translateX: -80 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
