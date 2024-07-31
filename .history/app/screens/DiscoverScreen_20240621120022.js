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
      <Image source={require('../../assets/images/Discover.png')} style={styles.image} />
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
    width: 200, // Nastavte šířku podle potřeby
    height: 200, // Nastavte výšku podle potřeby
    position: 'absolute',
    top: 100, // Nastavte horní pozici podle potřeby
    left: '50%',
    transform: [{ translateX: -120 }], // Center horizontally
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
    top: 500, // Nastavte horní pozici podle potřeby
    left: '50%',
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -90 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
