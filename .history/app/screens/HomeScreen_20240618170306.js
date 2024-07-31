import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { transform: [{ translateX: 0 }, { translateY: -200 }] }]} />
      <Image source={require('../../assets/images/model.png')} style={[styles.modelImage, { transform: [{ translateX: 0 }, { translateY: -50 }] }]} />
      <Text style={[styles.welcomeText, { transform: [{ translateX: 0 }, { translateY: 50 }] }]}>Welcome to</Text>
      <Text style={[styles.appName, { transform: [{ translateX: 0 }, { translateY: 100 }] }]}>NANDEZU</Text>
      <Text style={[styles.subtitle, { transform: [{ translateX: 0 }, { translateY: 150 }] }]}>Your First AI-Powered Fashion Assistant</Text>
      <View style={[styles.buttonContainer, { transform: [{ translateX: 0 }, { translateY: 200 }] }]}>
        <View style={styles.buttonWrapper}>
          <Button title="Login" onPress={() => navigation.navigate('Screen2')} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Sign Up" onPress={() => navigation.navigate('Screen3')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Černé pozadí
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 220,
    height: 220,
    backgroundColor: '#6C63FF',
    borderRadius: 110,
  },
  modelImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  welcomeText: {
    color: '#fff', // Bílá barva textu
    fontSize: 24,
  },
  appName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonWrapper: {
    marginVertical: 10,
  },
});
