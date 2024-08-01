import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6DE', // Pozadí obrazovky
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'absolute',
    top: 80,
    alignItems: 'center',
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
  },
  circleInner: {
    width: 200,
    height: 200,
    backgroundColor: '#2450FF',
    top: 40,
  },
  modelImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 100,
  },
  welcomeText: {
    marginTop: 20,
    color: '#000',
    fontSize: 24,
  },
  appName: {
    color: '#000',
    fontSize: 30,
    fontWeight: '300',
  },
  subtitle: {
    marginTop: 10,
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 180,
    height: 45,
  },
  loginButton: {
    marginBottom: 10,
  },
  signUpButton: {
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
});
