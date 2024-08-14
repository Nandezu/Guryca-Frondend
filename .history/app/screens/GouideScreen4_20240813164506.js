import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GouideScreen4() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const handleConfirm = () => {
    navigation.navigate('GouideScreen5', { userId });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/aip.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.progressText}>4/5</Text>
      <Text style={styles.descriptionText}>
        Our AI software learns from your style and preferences, recommending clothing that fits you perfectly in both style and brand.
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
  image: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.07,
    left: '50%',
    transform: [{ translateX: -120 }],
  },
  progressText: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.40,
    left: '50%',
    transform: [{ translateX: -2 }],
    color: '#fff',
    fontSize: 20,
    fontWeight: 'normal',
  },
  descriptionText: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.45,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -105 }],
    color: '#fff',
    fontSize: 18,
    textAlign: 'left',
  },
  confirmButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.67,
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