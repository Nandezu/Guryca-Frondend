import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GouideScreen5() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const handleConfirm = () => {
    navigation.navigate('GouideScreen6', { userId });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/mep.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.progressText}>5/5</Text>
      <Text style={styles.descriptionText}>
        Save your favorite pieces and easily purchase them through direct links in your favorite online stores within your shopping zone.
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
    top: SCREEN_HEIGHT * 0.04,
    left: '50%',
    transform: [{ translateX: -150 }],
  },
  progressText: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.36,
    left: '50%',
    transform: [{ translateX: -10 }],
    color: '#fff',
    fontSize: 20,
    fontWeight: 'normal',
  },
  descriptionText: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.42,
    left: '50%',
    width: '80%',
    transform: [{ translateX: -150 }],
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
    transform: [{ translateX: -90 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});