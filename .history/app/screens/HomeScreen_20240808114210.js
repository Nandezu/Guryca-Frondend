import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.circleOuter]} />
        <View style={[styles.circle, styles.circleMiddle]} />
        <View style={[styles.circle, styles.circleInner]} />
      </View>
      <Image source={require('../../assets/images/model.png')} style={styles.modelImage} />
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.appName}>NANDEZU</Text>
      <Text style={styles.subtitle}>Your First AI-Powered Fashion Assistant</Text>
      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={() => navigation.navigate('Signupscreen')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE', // Černé pozadí
    position: 'relative',
  },
  circleContainer: {
    position: 'absolute',
    top: 50,
    left: '50%',
    transform: [{ translateX: -135 }],
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circleOuter: {
    width: 280,
    height: 280,
    backgroundColor: '#849CFC',
  },
  circleMiddle: {
    width: 240,
    height: 240,
    backgroundColor: '#6785FF',
    top: 20,
    left: 20,
  },
  circleInner: {
    width: 200,
    height: 200,
    backgroundColor: '#2450FF',
    top: 40,
    left: 40,
  },
  modelImage: {
    position: 'absolute',
    top: -160,
    left: '50%',
    width: 550,
    height: 550,
    resizeMode: 'contain',
    transform: [{ translateX: -290 }],
  },
  welcomeText: {
    position: 'absolute',
    top: 400,
    left: '50%',
    color: '#000', // Bílá barva textu
    fontSize: 24,
    transform: [{ translateX: -56 }],
  },
  appName: {
    position: 'absolute',
    top: 455,
    left: '50%',
    color: '#000',
    fontSize: 30,
    fontWeight: 'light',
    transform: [{ translateX: -64 }],
  },
  subtitle: {
    position: 'absolute',
    top: 520,
    left: '50%',
    color: '#000',
    fontSize: 16,
    transform: [{ translateX: -140 }],
  },
  button: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Transparentní pozadí
  },
  loginButton: {
    top: 580,
    left: '50%',
    width: 180, // Nastavení šířky tlačítka
    height: 45, // Nastavení výšky tlačítka
    transform: [{ translateX: -87 }],
  },
  signUpButton: {
    top: 650,
    left: '50%',
    width: 180, // Nastavení šířky tlačítka
    height: 45, // Nastavení výšky tlačítka
    transform: [{ translateX: -87 }],
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
});
