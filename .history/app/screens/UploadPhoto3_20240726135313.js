import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function UploadPhoto3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Photo3.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate('UploadPhoto4', { userId })}
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
    bottom: 20,
    width: 180,
    height: 45,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});