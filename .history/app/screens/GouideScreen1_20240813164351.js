import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GouideScreen1() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const handleConfirm = () => {
    navigation.navigate('GouideScreen2', { userId });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/allp.png')}
        style={styles.allp}
        resizeMode="contain"
      />
      <Text style={styles.progressText}>1/5</Text>
      <Text style={styles.descriptionText}>
        Get access to the world's largest selection of over 60,000 clothing products and thousands of brands, from top designers to emerging talents.
      </Text>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
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
  allp: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.04, // Posunuto o 20% výše (původně 0.05)
    left: '50%',
    transform: [{ translateX: -150 }],
  },
  progressText: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.40, // Posunuto o 20% výše (původně 0.45)
    left: '50%',
    transform: [{ translateX: -2 }],
    color: '#fff',
    fontSize: 20,
    fontWeight: 'normal',
  },
  descriptionText: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.45, // Posunuto o 20% výše (původně 0.52)
    left: '50%',
    width: '80%',
    transform: [{ translateX: -105 }],
    color: '#fff',
    fontSize: 18,
    textAlign: 'left',
  },
  confirmButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.67, // Posunuto o 20% výše (původně 0.75)
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