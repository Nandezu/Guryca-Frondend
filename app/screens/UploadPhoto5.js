import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function UploadPhoto5() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Photo5.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate('GouideScreen1', { userId })}
      >
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  confirmButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.01, // Posunuto nahoru o přibližně 15-20%
    width: 150,
    height: 35,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
});