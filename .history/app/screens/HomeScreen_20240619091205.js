import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

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
      <View style={styles.buttonContainer}>
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
    position: 'relative',
  },
  circleContainer: {
    position: 'absolute',
    top: 70,
    left: '50%',
    transform: [{ translateX: -100 }],
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circleOuter: {
    width: 220,
    height: 220,
    backgroundColor: '#849CFC',
  },
  circleMiddle: {
    width: 180,
    height: 180,
    backgroundColor: '#6785FF',
    top: 20,
    left: 20,
  },
  circleInner: {
    width: 140,
    height: 140,
    backgroundColor: '#2450FF',
    top: 40,
    left: 40,
  },
  modelImage: {
    position: 'absolute',
    top: -100,
    left: '50%',
    width: 480,
    height: 480,
    resizeMode: 'contain',
    transform: [{ translateX: -230 }],
  },
  welcomeText: {
    position: 'absolute',
    top: 320,
    left: '50%',
    color: '#fff', // Bílá barva textu
    fontSize: 24,
    transform: [{ translateX: -60 }],
  },
  appName: {
    position: 'absolute',
    top: 360,
    left: '50%',
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    transform: [{ translateX: -80 }],
  },
  subtitle: {
    position: 'absolute',
    top: 400,
    left: '50%',
    color: '#fff',
    fontSize: 16,
    transform: [{ translateX: -120 }],
  },
  buttonContainer: {
    position: 'absolute',
    top: 450,
    left: '50%',
    width: '80%',
    alignItems: 'center',
    transform: [{ translateX: -160 }],
  },
  buttonWrapper: {
    marginVertical: 10,
    width: '100%',
  },
});
