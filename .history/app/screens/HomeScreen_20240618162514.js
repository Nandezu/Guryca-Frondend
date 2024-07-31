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
      <Image source={require('../assets/model.png')} style={styles.modelImage} />
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.appName}>NANDEZU</Text>
      <Text style={styles.subtitle}>Your First AI-Powered Fashion Assistant</Text>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={() => navigation.navigate('Screen2')} />
        <Button title="Sign Up" onPress={() => navigation.navigate('Screen3')} />
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
  circleContainer: {
    position: 'absolute',
    top: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circleOuter: {
    width: 220,
    height: 220,
    backgroundColor: '#6C63FF',
  },
  circleMiddle: {
    width: 180,
    height: 180,
    backgroundColor: '#7267FB',
  },
  circleInner: {
    width: 140,
    height: 140,
    backgroundColor: '#8375FF',
  },
  modelImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 150,
    marginBottom: 20,
    zIndex: 1,
  },
  welcomeText: {
    color: '#fff', // Bílá barva textu
    fontSize: 24,
    marginBottom: 10,
  },
  appName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  },
});
