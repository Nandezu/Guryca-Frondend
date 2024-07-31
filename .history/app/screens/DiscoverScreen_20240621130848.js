import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DiscoverScreen() {
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
        Discover the amazing features of our application. Explore and find out how it can help you with your daily fashion needs.
        
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
    top: 50, // Nastavte horní pozici podle potřeby
    left: '50%',
    transform: [{ translateX: -20 }], // Center horizontally
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText: {
    position: 'absolute',
    top: 420, // Nastavte horní pozici podle potřeby
    left: '50%',
    width: '80%',
    transform: [{ translateX: -150 }], // Center horizontally
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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
